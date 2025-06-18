const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Database connection successful' });
});

const mediaRoutes = require('./routes/media');
app.use('/api/media', mediaRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 