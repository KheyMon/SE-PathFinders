const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.get('/users', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, full_name, email, role, created_at FROM users ORDER BY id ASC'
    );
    res.json({ users: rows });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;