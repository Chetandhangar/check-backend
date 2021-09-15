const express = require('express');
const {
   getTweets,
   getUserTweets,
   getTweet,
   handlePostTweet,
   handleToggleLike,
   handleToggleBookMark,
} = require('../controllers/tweet.controller');

const {verifyAuth} = require('../middlewares/auth.middleware.js')

const router = express.Router();

router.get('/tweets',verifyAuth, getTweets);
router.get('/tweets/user',verifyAuth, getUserTweets);
router.post('/tweet',verifyAuth, handlePostTweet);
router.get('/tweet/:id',verifyAuth, getTweet);
router.get('/tweet/:id/togglelike',verifyAuth, handleToggleLike);
router.get('/tweet/:id/togglebookmark',verifyAuth, handleToggleBookMark);

module.exports = router;