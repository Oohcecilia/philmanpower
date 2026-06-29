/**
 * File-based JSON data store.
 * Each entity is stored in a separate JSON file under server/data/
 * Can be swapped to CouchDB/nano later by replacing this module.
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getFilePath(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

function readData(name) {
  ensureDataDir();
  const filePath = getFilePath(name);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf-8');
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeData(name, data) {
  ensureDataDir();
  fs.writeFileSync(getFilePath(name), JSON.stringify(data, null, 2), 'utf-8');
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function now() {
  return new Date().toISOString();
}

const DB_NAMES = [
  'services',
  'industries',
  'process_steps',
  'faqs',
  'testimonials',
  'contact_submissions',
  'announcements',
  'site_content',
  'audit_logs',
  'users',
];

function parseValue(val) {
  if (typeof val === 'string') {
    const lower = val.toLowerCase();
    if (lower === 'true') return true;
    if (lower === 'false') return false;
  }
  return val;
}

function matchFilter(item, filter) {
  if (typeof filter !== 'object') return true;
  return Object.entries(filter).every(([key, val]) => {
    const itemVal = item[key];
    const parsedVal = parseValue(val);
    if (parsedVal === true || parsedVal === false) {
      return itemVal === parsedVal || itemVal === val;
    }
    if (typeof val === 'string' && typeof itemVal === 'string') {
      return itemVal.toLowerCase().includes(val.toLowerCase());
    }
    return itemVal === val;
  });
}

const db = {
  async init() {
    ensureDataDir();
    // Ensure all DB files exist
    for (const name of DB_NAMES) {
      const filePath = getFilePath(name);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '[]', 'utf-8');
      }
    }
    console.log('Data directory ready at:', DATA_DIR);
  },

  DB_NAMES,

  /**
   * Return a CRUD interface for an entity collection.
   * Matches the same API shape that nano/CouchDB would provide.
   */
  getEntity(name) {
    if (!DB_NAMES.includes(name)) {
      throw new Error(`Unknown entity: ${name}`);
    }

    return {
      async list(orderBy, limit) {
        let items = readData(name);
        if (orderBy) {
          const desc = orderBy.startsWith('-');
          const field = desc ? orderBy.slice(1) : orderBy;
          items.sort((a, b) => {
            const va = a[field] || '';
            const vb = b[field] || '';
            return desc
              ? va < vb ? 1 : va > vb ? -1 : 0
              : va < vb ? -1 : va > vb ? 1 : 0;
          });
        }
        if (limit) items = items.slice(0, limit);
        return items;
      },

      async filter(filterObj) {
        const items = readData(name);
        return items.filter(item => matchFilter(item, filterObj));
      },

      async get(id) {
        const items = readData(name);
        return items.find(i => i.id === id) || null;
      },

      async create(payload) {
        const items = readData(name);
        const newItem = { id: generateId(), ...payload, created_date: now() };
        items.push(newItem);
        writeData(name, items);
        return newItem;
      },

      async update(id, updates) {
        const items = readData(name);
        const idx = items.findIndex(i => i.id === id);
        if (idx === -1) throw new Error(`Entity ${name} with id ${id} not found`);
        items[idx] = { ...items[idx], ...updates };
        writeData(name, items);
        return items[idx];
      },

      async delete(id) {
        const items = readData(name);
        const filtered = items.filter(i => i.id !== id);
        writeData(name, filtered);
      },
    };
  },

  // Direct access for users (auth)
  readData,
  writeData,
};

module.exports = db;
