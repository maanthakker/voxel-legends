import 'dotenv/config';
import crypto from 'crypto';
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import authRouter from './routes/auth.js';
import { startMultiplayer } from './multiplayer.js';
import { usingDatabase } from './models/User.js';

const { MONGODB_URI, PORT = 3000 } = process.env;
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex');
  console.warn('JWT_SECRET is not set: using a temporary one, so everyone is logged out when the server restarts.');
}
const JWT_SECRET = process.env.JWT_SECRET;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, '../../client/dist');

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '20kb' }));
app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('Referrer-Policy', 'same-origin');
  res.set('X-Frame-Options', 'SAMEORIGIN'); // only this site may frame the game
  next();
});

app.get('/api/health', (req, res) => res.json({ ok: true, db: usingDatabase ? 'mongodb' : 'memory' }));
app.use('/api/auth', authRouter);

// The built React app (and the game file in /game) are served by the same service.
app.use(express.static(dist, { index: false, maxAge: '1h' }));
app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));

const server = http.createServer(app);
const io = new Server(server, { maxHttpBufferSize: 16 * 1024 });
startMultiplayer(io, JWT_SECRET);

const start = () => server.listen(PORT, () => console.log(`Voxel Realms running on port ${PORT} (${usingDatabase ? 'MongoDB' : 'test mode, accounts in memory'})`));
if (usingDatabase) {
  mongoose.connect(MONGODB_URI)
    .then(start)
    .catch((err) => { console.error('MongoDB connection failed:', err.message); process.exit(1); });
} else {
  console.warn('MONGODB_URI is not set: running in test mode. Accounts are kept in memory and disappear when the server restarts.');
  start();
}
