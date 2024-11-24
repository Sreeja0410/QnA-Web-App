const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { adminMiddleware } = require('../middleware/authMiddleware');

router.use(adminMiddleware);

router.get('/pending-posts', async (req, res) => {
    try {
        const posts = await Post.find({ status: 'pending' })
            .populate('userId', 'name')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/posts/:id/status', async (req, res) => {
    // ... admin route logic ...
});

module.exports = router;
