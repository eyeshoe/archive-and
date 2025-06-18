const express = require('express');
const router = express.Router();
const db = require('../config/database');
const path = require('path');

// Get user's public site
router.get('/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    
    // Get user info
    const userResult = await db.query(
      `SELECT id, username, full_name, created_at
       FROM users
       WHERE username = $1 AND is_active = true`,
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Get user's public media
    const mediaResult = await db.query(
      `SELECT id, title, description, file_path, file_type, created_at
       FROM media
       WHERE user_id = $1 AND privacy_setting = 'public'
       ORDER BY created_at DESC`,
      [user.id]
    );

    res.json({
      user: {
        username: user.username,
        full_name: user.full_name,
        joined_at: user.created_at
      },
      media: mediaResult.rows
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router; 