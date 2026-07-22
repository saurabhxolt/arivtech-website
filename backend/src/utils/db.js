'use strict';

const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const { defaultSiteConfig } = require('./defaultConfig');

const DB_DIR = path.join(__dirname, '../../data');
const DB_PATH = path.join(DB_DIR, 'db.json');
const ADMIN_PATH = path.join(DB_DIR, 'admin.json');
const USERS_PATH = path.join(DB_DIR, 'users.json');

// MongoDB singleton state
let client = null;
let db = null;
let isConnected = false;

async function getDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return null; // Fallback to local files
  }
  if (db && isConnected) {
    return db;
  }
  try {
    if (!client) {
      client = new MongoClient(uri, {
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000
      });
    }
    await client.connect();
    db = client.db('arivtek');
    // Test the ping
    await db.command({ ping: 1 });
    isConnected = true;
    console.log('Successfully connected to MongoDB Atlas');
    return db;
  } catch (err) {
    console.warn('Failed to connect to MongoDB, falling back to local database files:', err.message);
    isConnected = false;
    db = null;
    return null;
  }
}

// ─── File Fallback Store Handlers ──────────────────────────────────────────

function readStoreLocal() {
  if (!fs.existsSync(DB_PATH)) {
    const defaultStore = { contacts: [], careers: [], internships: [], siteConfig: defaultSiteConfig };
    writeStoreLocal(defaultStore);
    return defaultStore;
  }
  try {
    const store = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    if (!store.siteConfig) {
      store.siteConfig = defaultSiteConfig;
      writeStoreLocal(store);
    } else {
      let merged = false;
      for (const key in defaultSiteConfig) {
        if (store.siteConfig[key] === undefined) {
          store.siteConfig[key] = defaultSiteConfig[key];
          merged = true;
        }
      }
      if (merged) {
        writeStoreLocal(store);
      }
    }
    return store;
  } catch {
    return { contacts: [], careers: [], internships: [], siteConfig: defaultSiteConfig };
  }
}

function writeStoreLocal(store) {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(store, null, 2), 'utf8');
}

// ─── Unified Database Handlers ──────────────────────────────────────────────

async function readStore() {
  const database = await getDb();
  if (database) {
    try {
      const configDoc = await database.collection('config').findOne({ _id: 'siteConfig' });
      let siteConfig = configDoc ? configDoc.siteConfig : defaultSiteConfig;
      let merged = false;
      for (const key in defaultSiteConfig) {
        if (siteConfig[key] === undefined) {
          siteConfig[key] = defaultSiteConfig[key];
          merged = true;
        }
      }
      if (merged && configDoc) {
        await database.collection('config').updateOne(
          { _id: 'siteConfig' },
          { $set: { siteConfig } }
        );
      }
      const contacts = await database.collection('contacts').find({}).toArray();
      const careers = await database.collection('careers').find({}).toArray();
      const internships = await database.collection('internships').find({}).toArray();
      return { siteConfig, contacts, careers, internships };
    } catch (err) {
      console.error('Error reading store from MongoDB:', err.message);
    }
  }
  // Local fallback
  return readStoreLocal();
}

async function getConfig() {
  const database = await getDb();
  if (database) {
    try {
      const doc = await database.collection('config').findOne({ _id: 'siteConfig' });
      let siteConfig = doc ? doc.siteConfig : defaultSiteConfig;
      let merged = false;
      for (const key in defaultSiteConfig) {
        if (siteConfig[key] === undefined) {
          siteConfig[key] = defaultSiteConfig[key];
          merged = true;
        }
      }
      if (merged && doc) {
        await database.collection('config').updateOne(
          { _id: 'siteConfig' },
          { $set: { siteConfig } }
        );
      }
      return siteConfig;
    } catch (err) {
      console.error('Error getting config from MongoDB:', err.message);
    }
  }
  // Local fallback
  const store = readStoreLocal();
  return store.siteConfig || null;
}

async function saveConfig(config) {
  const database = await getDb();
  if (database) {
    try {
      const { _id, ...cleanConfig } = config;
      await database.collection('config').updateOne(
        { _id: 'siteConfig' },
        { $set: { siteConfig: cleanConfig } },
        { upsert: true }
      );
      return;
    } catch (err) {
      console.error('Error saving config to MongoDB:', err.message);
    }
  }
  // Local fallback
  const store = readStoreLocal();
  store.siteConfig = config;
  writeStoreLocal(store);
}

async function getAdmin() {
  const database = await getDb();
  if (database) {
    try {
      let doc = await database.collection('admin').findOne({ _id: 'admin' });
      if (!doc) {
        const { hashPassword } = require('./auth');
        doc = {
          _id: 'admin',
          username: 'admin',
          passwordHash: hashPassword('arivtek2026')
        };
        await database.collection('admin').insertOne(doc);
      }
      return doc;
    } catch (err) {
      console.error('Error getting admin from MongoDB:', err.message);
    }
  }

  // Local fallback
  if (!fs.existsSync(ADMIN_PATH)) {
    const { hashPassword } = require('./auth');
    const defaultAdmin = {
      username: 'admin',
      passwordHash: hashPassword('arivtek2026')
    };
    if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
    fs.writeFileSync(ADMIN_PATH, JSON.stringify(defaultAdmin, null, 2), 'utf8');
    return defaultAdmin;
  }
  try {
    return JSON.parse(fs.readFileSync(ADMIN_PATH, 'utf8'));
  } catch {
    return null;
  }
}

async function saveAdmin(adminData) {
  const database = await getDb();
  if (database) {
    try {
      const { _id, ...cleanAdmin } = adminData;
      await database.collection('admin').updateOne(
        { _id: 'admin' },
        { $set: cleanAdmin },
        { upsert: true }
      );
      return;
    } catch (err) {
      console.error('Error saving admin to MongoDB:', err.message);
    }
  }

  // Local fallback
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  fs.writeFileSync(ADMIN_PATH, JSON.stringify(adminData, null, 2), 'utf8');
}

// ─── Submissions Handlers ───────────────────────────────────────────────────

async function saveContact(entry) {
  const database = await getDb();
  if (database) {
    try {
      await database.collection('contacts').insertOne({ ...entry, timestamp: new Date().toISOString() });
      return;
    } catch (err) {
      console.error('Error saving contact submission to MongoDB:', err.message);
    }
  }

  // Local fallback
  const store = readStoreLocal();
  store.contacts.push({ ...entry, timestamp: new Date().toISOString() });
  writeStoreLocal(store);
}

async function saveCareerApplication(entry) {
  const database = await getDb();
  if (database) {
    try {
      await database.collection('careers').insertOne({ ...entry, timestamp: new Date().toISOString() });
      return;
    } catch (err) {
      console.error('Error saving career submission to MongoDB:', err.message);
    }
  }

  // Local fallback
  const store = readStoreLocal();
  store.careers.push({ ...entry, timestamp: new Date().toISOString() });
  writeStoreLocal(store);
}

async function saveInternshipApplication(entry) {
  const database = await getDb();
  if (database) {
    try {
      await database.collection('internships').insertOne({ ...entry, timestamp: new Date().toISOString() });
      return;
    } catch (err) {
      console.error('Error saving internship submission to MongoDB:', err.message);
    }
  }

  // Local fallback
  const store = readStoreLocal();
  store.internships.push({ ...entry, timestamp: new Date().toISOString() });
  writeStoreLocal(store);
}

async function getUsers() {
  const database = await getDb();
  if (database) {
    try {
      return await database.collection('users').find({}).toArray();
    } catch (err) {
      console.error('Error getting users from MongoDB:', err.message);
    }
  }

  // Local fallback
  if (!fs.existsSync(USERS_PATH)) {
    const { hashPassword } = require('./auth');
    const defaultUsers = [
      {
        username: 'employee1',
        passwordHash: hashPassword('arivtek_employee'),
        role: 'employee',
        name: 'Mrunal S'
      },
      {
        username: 'intern1',
        passwordHash: hashPassword('arivtek_intern'),
        role: 'intern',
        name: 'Aman Kumar'
      }
    ];
    if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
    fs.writeFileSync(USERS_PATH, JSON.stringify(defaultUsers, null, 2), 'utf8');
    return defaultUsers;
  }
  try {
    return JSON.parse(fs.readFileSync(USERS_PATH, 'utf8'));
  } catch {
    return [];
  }
}

async function saveUsers(users) {
  const database = await getDb();
  if (database) {
    try {
      await database.collection('users').deleteMany({});
      if (users.length > 0) {
        // Remove MongoDB internal _id before inserting if any
        const cleanUsers = users.map(({ _id, ...u }) => u);
        await database.collection('users').insertMany(cleanUsers);
      }
      return;
    } catch (err) {
      console.error('Error saving users to MongoDB:', err.message);
    }
  }

  // Local fallback
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2), 'utf8');
}

async function getUserByUsername(username) {
  const users = await getUsers();
  return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
}

module.exports = {
  readStore,
  getConfig,
  saveConfig,
  getAdmin,
  saveAdmin,
  saveContact,
  saveCareerApplication,
  saveInternshipApplication,
  getUsers,
  saveUsers,
  getUserByUsername
};