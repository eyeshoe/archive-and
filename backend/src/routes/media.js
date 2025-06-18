const express = require('express');
const router = express.Router();
const { addMedia, getMediaByUserId } = require('../db/queries');

// Add a new media item
router.post('/', async (req, res) => {
  try {
    const { user_id, title, description, file_path, file_type, file_size, privacy_setting, metadata } = req.body;
    if (!user_id || !title || !file_path || !file_type || !file_size) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const media = await addMedia(user_id, {
      title,
      description: description || '',
      filePath: file_path,
      fileType: file_type,
      fileSize: file_size,
      privacySetting: privacy_setting || 'public',
      metadata: metadata || {}
    });
    res.status(201).json(media);
  } catch (error) {
    console.error('Error adding media:', error);
    res.status(500).json({ error: 'Failed to add media' });
  }
});

// Get all media for a user
router.get('/', async (req, res) => {
  try {
    const { user_id, privacy } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: 'Missing user_id' });
    }
    const media = await getMediaByUserId(user_id, privacy || 'all');
    res.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

module.exports = router; 