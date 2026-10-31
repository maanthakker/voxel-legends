import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';

const router = Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false });
const NAME = /^[A-Za-z0-9_]{3,16}$/;
const sign = (u) => jwt.sign({ id: u._id.toString(), username: u.username }, process.env.JWT_SECRET, { expiresIn: '30d' });
const wrap = (fn) => (req, res) => fn(req, res).catch((e) => { console.error(e); res.status(500).json({ error: 'Something went wrong, try again' }); });

router.post('/register', limiter, wrap(async (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || !NAME.test(username)) return res.status(400).json({ error: 'Username must be 3-16 letters, numbers or _' });
  if (typeof password !== 'string' || password.length < 6 || password.length > 100) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  if (await User.exists({ usernameLower: username.toLowerCase() })) return res.status(409).json({ error: 'That username is taken' });
  const user = await User.create({ username, usernameLower: username.toLowerCase(), passwordHash: await bcrypt.hash(password, 10) });
  res.json({ token: sign(user), user: { username: user.username } });
}));

router.post('/login', limiter, wrap(async (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string') return res.status(400).json({ error: 'Enter your username and password' });
  const user = await User.findOne({ usernameLower: username.toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ error: 'Wrong username or password' });
  res.json({ token: sign(user), user: { username: user.username } });
}));

export default router;
