import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },                                    // shown in game, e.g. "Maan"
  usernameLower: { type: String, required: true, unique: true, index: true },    // for case-insensitive lookups
  passwordHash: { type: String, required: true },
  lastSeen: { type: Date }
}, { timestamps: true });

const MongoUser = mongoose.model('User', userSchema);

// Test mode: with no MONGODB_URI the server keeps accounts in memory, so the site still works
// before the database is connected. Accounts disappear whenever the server restarts.
const mem = new Map();
const MemoryUser = {
  async exists(q) { const u = mem.get(q.usernameLower); return u ? { _id: u._id } : null; },
  async create(doc) { const u = { ...doc, _id: randomUUID(), createdAt: new Date() }; mem.set(doc.usernameLower, u); return u; },
  async findOne(q) { return mem.get(q.usernameLower) || null; },
  async updateOne() { return { acknowledged: true }; }
};

export const usingDatabase = Boolean(process.env.MONGODB_URI);
export default usingDatabase ? MongoUser : MemoryUser;
