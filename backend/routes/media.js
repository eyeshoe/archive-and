const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { mediaValidation } = require('../middleware/validation');

// Add media
router.post('/', mediaValidation, async (req, res, next) => {
  try {
    const { title, file_path, file_type, file_size, description = '', privacy_setting = 'public' } = req.body;
    const userId = 3; // Using our test user
    
    const result = await db.query(
      `INSERT INTO media (
        user_id, 
        title, 
        description,
        file_path, 
        file_type, 
        file_size, 
        privacy_setting, 
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING id, title, description, file_path, file_type, privacy_setting, created_at`,
      [userId, title, description, file_path, file_type, file_size, privacy_setting]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Get user's media
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      `SELECT id, title, description, file_path, file_type, privacy_setting, created_at
       FROM media
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Get public media for a user
router.get('/public/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    
    const result = await db.query(
      `SELECT m.id, m.title, m.description, m.file_path, m.file_type, m.created_at
       FROM media m
       JOIN users u ON m.user_id = u.id
       WHERE u.username = $1 AND m.privacy_setting = 'public'
       ORDER BY m.created_at DESC`,
      [username]
    );
    
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router; 