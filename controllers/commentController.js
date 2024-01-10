const router = require('express').Router();
const { Comment, User } = require('../models');
const withAuth = require('../utils/auth');

// Gets all comments for a post
router.get('/:postId', async (req, res) => {
    try {
        const commentData = await Comment.findAll({
            where: { post_id: req.params.postId },
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });

        const comments = commentData.map((comment) => comment.get({ plain: true }));
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Creates a new comment
router.post('/:postId', withAuth, async (req, res) => {
    try {
        const newComment = await Comment.create({
            content: req.body.content,
            user_id: req.session.user_id,
            post_id: req.params.postId,
        });

        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Updates a comment by the id
router.put('/:id', withAuth, async (req, res) => {
    try {
        const updatedComment = await Comment.update(
            {
                content: req.body.content,
            },
            {
                where: {
                    id: req.params.id,
                    user_id: req.session.user_id,
                },
            }
        );

        if (updatedComment[0] === 0) {
            res.status(404).json({ message: 'No comment found with this id' });
            return;
        }

        res.status(200).json({ message: 'Comment updated successfully' });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Deletes a comment by the id
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const deletedComment = await Comment.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!deletedComment) {
            res.status(404).json({ message: 'No comment found with this id' });
            return;
        }

        res.status(204).end();
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;