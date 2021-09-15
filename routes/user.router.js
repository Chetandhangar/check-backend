const express = require('express');
const {
   getUsers,
   getUser,
   handleFollow,
   handleUnFollow,
   getFeed,
} = require('../controllers/user.controller');

const {verifyAuth} = require('../middlewares/auth.middleware.js')

const router = express.Router();

router.get('/users', verifyAuth, getUsers);
router.get('/user/:username', verifyAuth, getUser);
router.get('/user/:id/follow', verifyAuth, handleFollow);
router.get('/user/:id/unfollow', verifyAuth, handleUnFollow);
router.get('/feed', verifyAuth, getFeed);

module.exports = router;