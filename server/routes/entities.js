const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// PUBLIC: List entities (no auth required)
router.get('/:entity/list', async (req, res) => {
  try {
    const { entity } = req.params;
    const orderBy = req.query.orderBy || null;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    if (!db.DB_NAMES.includes(entity)) {
      return res.status(404).json({ error: `Unknown entity: ${entity}` });
    }

    const entityApi = db.getEntity(entity);
    const docs = await entityApi.list(orderBy, limit);
    res.json(docs);
  } catch (err) {
    console.error('List error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUBLIC: Filter entities
router.post('/:entity/filter', async (req, res) => {
  try {
    const { entity } = req.params;
    if (!db.DB_NAMES.includes(entity)) {
      return res.status(404).json({ error: `Unknown entity: ${entity}` });
    }
    const entityApi = db.getEntity(entity);
    const docs = await entityApi.filter(req.body || {});
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUBLIC: Get single entity by ID
router.get('/:entity/:id', async (req, res) => {
  try {
    const { entity, id } = req.params;
    if (!db.DB_NAMES.includes(entity)) {
      return res.status(404).json({ error: `Unknown entity: ${entity}` });
    }
    const entityApi = db.getEntity(entity);
    const doc = await entityApi.get(id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PROTECTED: Create entity
router.post('/:entity', authMiddleware, async (req, res) => {
  try {
    const { entity } = req.params;
    if (!db.DB_NAMES.includes(entity) || entity === 'users') {
      return res.status(400).json({ error: `Cannot create: ${entity}` });
    }
    const entityApi = db.getEntity(entity);
    const doc = await entityApi.create(req.body);
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PROTECTED: Update entity
router.put('/:entity/:id', authMiddleware, async (req, res) => {
  try {
    const { entity, id } = req.params;
    if (!db.DB_NAMES.includes(entity) || entity === 'users') {
      return res.status(400).json({ error: `Cannot update: ${entity}` });
    }
    const entityApi = db.getEntity(entity);
    const doc = await entityApi.update(id, req.body);
    res.json(doc);
  } catch (err) {
    if (err.message.includes('not found')) return res.status(404).json({ error: 'Not found' });
    res.status(500).json({ error: err.message });
  }
});

// PROTECTED: Delete entity
router.delete('/:entity/:id', authMiddleware, async (req, res) => {
  try {
    const { entity, id } = req.params;
    if (!db.DB_NAMES.includes(entity) || entity === 'users') {
      return res.status(400).json({ error: `Cannot delete: ${entity}` });
    }
    const entityApi = db.getEntity(entity);
    await entityApi.delete(id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
