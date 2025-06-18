const fs = require('fs');
const path = require('path');
const db = require('../config/database');
const { insertTestData } = require('./queries');

async function initializeDatabase() {
    try {
        // Read and execute schema.sql as a single query
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await db.query(schema);
        console.log('Database schema created successfully');

        // Insert test data
        const testUser = await insertTestData();
        console.log('Test data inserted successfully');
        console.log('Test user created:', testUser);

    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

// Run the initialization if this file is executed directly
if (require.main === module) {
    initializeDatabase()
        .then(() => {
            console.log('Database initialization completed');
            process.exit(0);
        })
        .catch(error => {
            console.error('Database initialization failed:', error);
            process.exit(1);
        });
}

module.exports = initializeDatabase; 