// Online multiplayer: every logged-in player sends their "presence" (name, world code, position, skin, chat, invites)
// about 10 times a second; the server sends everyone the full list 10 times a second. The game filters by world code.
import jwt from 'jsonwebtoken';
import User from './models/User.js';

const BAD = ['fuck', 'shit', 'bitch', 'asshole', 'bastard', 'cunt', 'dick'];
const clean = (t) => String(t).replace(/[\u0000-\u001f\u007f\u200b-\u200f\u2028-\u202e\u2060-\u206f\ufeff]/g, '').slice(0, 120);
const mask = (t) => BAD.reduce((s, w) => s.replace(new RegExp(w, 'gi'), '*'.repeat(w.length)), t);

export function startMultiplayer(io, secret) {
  io.use((socket, next) => {
    try {
      const p = jwt.verify(socket.handshake.auth?.token || '', secret);
      socket.data.user = { id: p.id, username: p.username };
      next();
    } catch {
      next(new Error('Please log in'));
    }
  });

  const players = new Map(); // socket id -> presence

  io.on('connection', (socket) => {
    const { id, username } = socket.data.user;
    players.set(socket.id, { n: username });
    User.updateOne({ _id: id }, { lastSeen: new Date() }).catch(() => {});

    socket.on('presence', (p) => {
      if (!p || typeof p !== 'object' || Array.isArray(p)) return;
      let size = 0;
      try { size = JSON.stringify(p).length; } catch { return; }
      if (size > 4096) return;
      const out = { ...p, n: username }; // the name always comes from the account, so nobody can pretend to be someone else
      if (Array.isArray(out.c) && typeof out.c[1] === 'string') out.c = [out.c[0], mask(clean(out.c[1]))];
      players.set(socket.id, out);
    });

    socket.on('disconnect', () => players.delete(socket.id));
  });

  setInterval(() => {
    if (!players.size) return;
    io.emit('peers', [...players].map(([peer, presence]) => ({ peer, presence })));
  }, 100);
}
