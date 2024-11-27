const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load models
require('./models/User');
require('./models/Post');
require('./models/Comment');
require('./models/Admin');


const { authMiddleware } = require('./middleware/authMiddleware');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: ["https://qna-web-app-client.vercel.app"],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    exposedHeaders: ['Access-Control-Allow-Origin']
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', authMiddleware, require('./routes/posts'));
app.use('/api/comments', authMiddleware, require('./routes/comments'));
app.use('/api/admin', authMiddleware, require('./routes/admin'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
