const router = require('express').Router();
const { User } = require('../models');

// Handles user signup
router.post('/signup', async (req,res) => {
    try {
        const newUser = await User.create(req.body)

        req.session.save(() => {
            req.session.user_id = newUser.id;
            req.session.username = newUser.username;
            req.session.loggedIn = true;

            res.status(200).json(newUser);
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

// Handles user login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
  
        if (!user || req.body.password !== user.password) {
            res.status(400).json({ message: 'Incorrect username or password' });
            return;
        }
  
        req.session.save(() => {
            req.session.user_id = user.id;
            req.session.username = user.username;
            req.session.loggedIn = true;
  
            res.status(200).json({ user, message: 'Login successful' });
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

// Handles user logout
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
        res.status(204).end();
    });
    } else {
        res.status(404).end();
    }
});
  

module.exports = router;