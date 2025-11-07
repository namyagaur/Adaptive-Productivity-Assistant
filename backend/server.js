require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ Enable CORS — allow frontend on Vercel to talk to backend
app.use(
  cors({
    origin: [
      'http://localhost:5173', // local dev
      'https://adaptive-productivity-assistant.vercel.app' // your Vercel domain
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ Base Route
app.get('/', (req, res) => {
  res.send('Adaptive Productivity Assistant Backend 💪');
});

// ✅ API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ Mongo Error:', err));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
