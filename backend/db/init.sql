-- Drop tables if they exist
DROP TABLE IF EXISTS media;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create media table
CREATE TABLE media (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert test user
INSERT INTO users (username) VALUES ('testuser');

-- Create indexes for better performance
CREATE INDEX idx_media_user_id ON media(user_id);
CREATE INDEX idx_media_is_public ON media(is_public);
CREATE INDEX idx_users_username ON users(username);