import mongoose from 'mongoose';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';
import { seed } from './seed.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const storageDir = join(__dirname, 'storage');
const jsonPath = join(storageDir, 'eduflow-db.json');
const collections = Object.keys(seed);
const mongoModels = new Map();

function ensureJsonDb() {
  if (!existsSync(storageDir)) mkdirSync(storageDir, { recursive: true });
  if (!existsSync(jsonPath)) writeFileSync(jsonPath, JSON.stringify(seed, null, 2));
}

function readJson() {
  ensureJsonDb();
  return JSON.parse(readFileSync(jsonPath, 'utf-8'));
}

function writeJson(db) {
  writeFileSync(jsonPath, JSON.stringify(db, null, 2));
}

function publicDoc(doc) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  plain.id = plain.id || String(plain._id || '');
  delete plain._id;
  delete plain.__v;
  return plain;
}

function createModel(name) {
  if (mongoModels.has(name)) return mongoModels.get(name);
  const schema = new mongoose.Schema(
    { id: { type: String, index: true }, schoolId: { type: String, index: true } },
    { strict: false, timestamps: true, collection: name }
  );
  const model = mongoose.models[name] || mongoose.model(name, schema);
  mongoModels.set(name, model);
  return model;
}

export async function connectStore() {
  if (!process.env.MONGODB_URI) {
    ensureJsonDb();
    console.log('Using local JSON storage. Set MONGODB_URI to use MongoDB.');
    return { mode: 'json' };
  }
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB || 'eduflow_saas' });
  for (const name of collections) createModel(name);
  const School = createModel('schools');
  const existing = await School.countDocuments();
  if (!existing) {
    for (const name of collections) await createModel(name).insertMany(seed[name]);
    console.log('MongoDB seeded with demo school data.');
  }
  console.log('Connected to MongoDB.');
  return { mode: 'mongo' };
}

export function hasCollection(name) {
  return collections.includes(name);
}

export async function list(name, schoolId, query = '') {
  const q = String(query || '').toLowerCase();
  if (process.env.MONGODB_URI) {
    const criteria = name === 'schools' ? {} : { schoolId };
    const rows = (await createModel(name).find(criteria).sort({ createdAt: -1 }).lean()).map(publicDoc);
    return q ? rows.filter((row) => JSON.stringify(row).toLowerCase().includes(q)) : rows;
  }
  const rows = readJson()[name] || [];
  const filtered = name === 'schools' ? rows : rows.filter((row) => row.schoolId === schoolId);
  return q ? filtered.filter((row) => JSON.stringify(row).toLowerCase().includes(q)) : filtered;
}

export async function findOne(name, predicate) {
  if (process.env.MONGODB_URI) {
    const rows = await createModel(name).find().lean();
    return rows.map(publicDoc).find(predicate);
  }
  return (readJson()[name] || []).find(predicate);
}

export async function create(name, schoolId, payload) {
  const doc = { ...payload, id: payload.id || nanoid(12), schoolId: payload.schoolId || schoolId };
  if (process.env.MONGODB_URI) return publicDoc(await createModel(name).create(doc));
  const db = readJson();
  db[name] = db[name] || [];
  db[name].push(doc);
  writeJson(db);
  return doc;
}

export async function update(name, id, schoolId, payload) {
  if (process.env.MONGODB_URI) {
    const criteria = name === 'schools' ? { id } : { id, schoolId };
    const updated = await createModel(name).findOneAndUpdate(criteria, { $set: payload }, { new: true });
    return publicDoc(updated);
  }
  const db = readJson();
  const index = (db[name] || []).findIndex((row) => row.id === id && (name === 'schools' || row.schoolId === schoolId));
  if (index === -1) return null;
  db[name][index] = { ...db[name][index], ...payload, id: db[name][index].id };
  writeJson(db);
  return db[name][index];
}

export async function remove(name, id, schoolId) {
  if (process.env.MONGODB_URI) {
    const criteria = name === 'schools' ? { id } : { id, schoolId };
    const deleted = await createModel(name).findOneAndDelete(criteria);
    return Boolean(deleted);
  }
  const db = readJson();
  const before = (db[name] || []).length;
  db[name] = (db[name] || []).filter((row) => !(row.id === id && (name === 'schools' || row.schoolId === schoolId)));
  writeJson(db);
  return db[name].length !== before;
}

export async function allForDashboard(schoolId) {
  const names = ['students', 'teachers', 'classes', 'fees', 'expenses', 'payroll', 'attendance', 'admissions', 'notices'];
  const entries = await Promise.all(names.map(async (name) => [name, await list(name, schoolId)]));
  return Object.fromEntries(entries);
}
