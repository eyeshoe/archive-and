const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User Management
const createUser = async (email, password, fullName, username) => {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await db.query(
        'INSERT INTO users (email, password_hash, full_name, username) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, username',
        [email, passwordHash, fullName, username]
    );
    return result.rows[0];
};

const getUserByEmail = async (email) => {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

const getUserById = async (id) => {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
};

const updateUserProfile = async (userId, { fullName, username }) => {
    const result = await db.query(
        'UPDATE users SET full_name = $1, username = $2 WHERE id = $3 RETURNING id, email, full_name, username',
        [fullName, username, userId]
    );
    return result.rows[0];
};

// Authentication
const verifyPassword = async (password, passwordHash) => {
    return await bcrypt.compare(password, passwordHash);
};

const createAuthToken = async (userId, type = 'access') => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: type === 'access' ? '1h' : '7d' });
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + (type === 'access' ? 1 : 168));

    await db.query(
        'INSERT INTO auth_tokens (user_id, token, type, expires_at) VALUES ($1, $2, $3, $4)',
        [userId, token, type, expiresAt]
    );
    return token;
};

// User Settings
const getUserSettings = async (userId) => {
    const result = await db.query('SELECT * FROM user_settings WHERE user_id = $1', [userId]);
    return result.rows[0];
};

const updateUserSettings = async (userId, settings) => {
    const { theme, language, timezone, notificationPreferences, privacySettings } = settings;
    const result = await db.query(
        `UPDATE user_settings 
         SET theme = $1, language = $2, timezone = $3, 
             notification_preferences = $4, privacy_settings = $5
         WHERE user_id = $6
         RETURNING *`,
        [theme, language, timezone, notificationPreferences, privacySettings, userId]
    );
    return result.rows[0];
};

// Media Management
const addMedia = async (userId, { title, description, filePath, fileType, fileSize, privacySetting, metadata }) => {
    const result = await db.query(
        `INSERT INTO media 
         (user_id, title, description, file_path, file_type, file_size, privacy_setting, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [userId, title, description, filePath, fileType, fileSize, privacySetting, metadata]
    );
    return result.rows[0];
};

const getMediaByUserId = async (userId, privacyFilter = 'all') => {
    let query = 'SELECT * FROM media WHERE user_id = $1';
    const params = [userId];

    if (privacyFilter !== 'all') {
        query += ' AND privacy_setting = $2';
        params.push(privacyFilter);
    }

    query += ' ORDER BY created_at DESC';
    const result = await db.query(query, params);
    return result.rows;
};

const updateMediaPrivacy = async (mediaId, userId, privacySetting) => {
    const result = await db.query(
        'UPDATE media SET privacy_setting = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
        [privacySetting, mediaId, userId]
    );
    return result.rows[0];
};

// Website Settings
const getWebsiteSettings = async (userId) => {
    const result = await db.query('SELECT * FROM website_settings WHERE user_id = $1', [userId]);
    return result.rows[0];
};

const updateWebsiteSettings = async (userId, settings) => {
    const { domain, title, description, theme, customCss, customJs, isPublic } = settings;
    const result = await db.query(
        `UPDATE website_settings 
         SET domain = $1, title = $2, description = $3, theme = $4, 
             custom_css = $5, custom_js = $6, is_public = $7
         WHERE user_id = $8
         RETURNING *`,
        [domain, title, description, theme, customCss, customJs, isPublic, userId]
    );
    return result.rows[0];
};

// Test Data
const insertTestData = async () => {
    // Create test user
    const testUser = await createUser(
        'test@example.com',
        'password123',
        'Test User',
        'testuser'
    );

    // Create user settings
    await db.query(
        'INSERT INTO user_settings (user_id, theme, language, timezone) VALUES ($1, $2, $3, $4)',
        [testUser.id, 'dark', 'en', 'UTC']
    );

    // Create website settings
    await db.query(
        'INSERT INTO website_settings (user_id, domain, title, description) VALUES ($1, $2, $3, $4)',
        [testUser.id, 'testuser.archive', 'Test User\'s Archive', 'My personal archive']
    );

    // Add test media
    await addMedia(testUser.id, {
        title: 'Test Image',
        description: 'A test image',
        filePath: '/uploads/test.jpg',
        fileType: 'image/jpeg',
        fileSize: 1024,
        privacySetting: 'public',
        metadata: { width: 800, height: 600 }
    });

    return testUser;
};

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    updateUserProfile,
    verifyPassword,
    createAuthToken,
    getUserSettings,
    updateUserSettings,
    addMedia,
    getMediaByUserId,
    updateMediaPrivacy,
    getWebsiteSettings,
    updateWebsiteSettings,
    insertTestData
}; 