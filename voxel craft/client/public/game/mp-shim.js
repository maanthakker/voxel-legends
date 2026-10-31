// Connects the game's multiplayer (written for claude.ai's "room") to this site's Socket.IO server.
// The game calls window.claude.use('room'); this file answers with an object that has the same
// presence() / onPeers() functions, backed by the server. Downloads fall back to normal browser downloads.
(function () {
  var token = null, me = null;
  try { token = localStorage.getItem('vr_token'); me = JSON.parse(localStorage.getItem('vr_user') || 'null'); } catch (e) {}
  // Use the account name as the in-game username.
  try {
    if (me && me.username) {
      var s = JSON.parse(localStorage.getItem('voxelrealms') || '{}') || {};
      s.uname = me.username; localStorage.setItem('voxelrealms', JSON.stringify(s));
    }
  } catch (e) {}

  function room() {
    if (!window.io || !token) return null;
    var socket = window.io({ auth: { token: token } });
    var handlers = [], errHandlers = [], mine = {}, known = new Set();
    socket.on('connect_error', function (err) {
      errHandlers.forEach(function (f) { f({ code: 'unavailable', message: err && err.message }); });
    });
    socket.on('peers', function (snap) {
      if (!Array.isArray(snap)) return;
      var now = new Set(), peers = [];
      snap.forEach(function (p) {
        if (!p || typeof p.peer !== 'string') return;
        now.add(p.peer);
        if (p.peer === socket.id) return;
        peers.push({ peer: p.peer, presence: p.presence || {}, kind: 'viewer', isMe: false, sameTab: false, by: null });
      });
      var left = [];
      known.forEach(function (id) { if (!now.has(id)) left.push({ peer: id }); });
      known = now;
      handlers.forEach(function (h) { h({ peers: peers, joined: [], left: left, updated: peers }); });
    });
    return {
      presence: function (patch) {
        for (var k in patch) { if (patch[k] === null || patch[k] === undefined) delete mine[k]; else mine[k] = patch[k]; }
        if (socket.connected) socket.volatile.emit('presence', mine);
        return Promise.resolve();
      },
      onPeers: function (h, onErr) {
        handlers.push(h); if (onErr) errHandlers.push(onErr);
        return function () { handlers = handlers.filter(function (x) { return x !== h; }); };
      }
    };
  }

  window.claude = { use: function (name) { return Promise.resolve(name === 'room' ? room() : null); } };
})();
