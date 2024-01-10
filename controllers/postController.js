const router = require('express').Router();
const { Post, User } = require('../models');
const withAuth = require('../utils/auth');

// Gets all posts
router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });

        const posts = postData.map((post) => post.get({ plain: true }));
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Gets one post by the id
router.get('/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });

        if (!postData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }

        const post = postData.get({ plain: true });
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Creates a new post
router.post('/', withAuth, async (req, res) => {
    try {
        const newPost = await Post.create({
            title: req.body.title,
            content: req.body.content,
            user_id: req.session.user_id,
        });

        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Updates a post by the id
router.put('/:id', withAuth, async (req, res) => {
    try {
        const updatedPost = await Post.update(
            {
                title: req.body.title,
                content: req.body.content,
            },
            {
                where: {
                    id: req.params.id,
                    user_id: req.session.user_id,
                },
            }
        );

        if (updatedPost[0] === 0) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }

        res.status(200).json({ message: 'Post updated successfully' });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Deletes a post by the id
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const deletedPost = await Post.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!deletedPost) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }

        res.status(204).end();
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;