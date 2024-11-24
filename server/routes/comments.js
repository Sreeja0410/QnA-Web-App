const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { authMiddleware } = require('../middleware/authMiddleware');
const Post = require('../models/Post');

router.use(authMiddleware);

// Like a comment
router.post('/:id/like', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        const userIndex = comment.likes.indexOf(req.user.userId);
        if (userIndex === -1) {
            comment.likes.push(req.user.userId);
            // Remove from dislikes if exists
            const dislikeIndex = comment.dislikes.indexOf(req.user.userId);
            if (dislikeIndex > -1) {
                comment.dislikes.splice(dislikeIndex, 1);
            }
        } else {
            comment.likes.splice(userIndex, 1);
        }

        await comment.save();
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Dislike a comment
router.post('/:id/dislike', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        const userIndex = comment.dislikes.indexOf(req.user.userId);
        if (userIndex === -1) {
            comment.dislikes.push(req.user.userId);
            // Remove from likes if exists
            const likeIndex = comment.likes.indexOf(req.user.userId);
            if (likeIndex > -1) {
                comment.likes.splice(likeIndex, 1);
            }
        } else {
            comment.dislikes.splice(userIndex, 1);
        }

        await comment.save();
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add this route to create comments
router.post('/', async (req, res) => {
    try {
        const { postId, text } = req.body;
        
        if (!text || !text.trim()) {
            return res.status(400).json({ error: 'Comment text is required' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const comment = new Comment({
            text: text.trim(),
            user: req.user.userId,
            post: postId,
            likes: [],
            dislikes: []
        });

        await comment.save();

        // Add comment to post's comments array
        post.comments.push(comment._id);
        await post.save();

        // Populate user info before sending response
        await comment.populate('user', 'name');

        res.status(201).json(comment);
    } catch (error) {
        console.error('Create comment error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
