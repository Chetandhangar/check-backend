const { Tweet } = require('../models/tweet.model');
const { User } = require('../models/user.model');

const getTweets = async (req, res) => {
  console.log("get tweets called")
   try {
      const tweets = await Tweet.find().sort({ createdAt: -1 });
      res.json({
         success: true,
         response: tweets,
      });
   } catch (error) {
      res.json({
         success: false,
         errorMessage: error.message,
      });
   }
};

const getUserTweets = async (req, res) => {
   const user = req.user;
   try {
      const tweets = await Tweet.find({ user })
         .sort({ createdAt: -1 })
         .populate({ path: 'user' });

      console.log(tweets);
      res.json({
         success: true,
         tweets,
      });
   } catch (error) {
      res.json({
         success: false,
         errorMessage: error.message,
      });
   }
};

const getTweet = async (req, res) => {
   try {
      const tweet = await Tweet.findById(req.params.id).populate({
         path: 'user',
         select: 'userName createdAt',
      });

      res.json({
         success: true,
         response: tweet,
      });
   } catch (error) {
      res.json({
         success: false,
         errorMessage: error.message,
      });
   }
};

const handlePostTweet = async (req, res) => {
   const { tweet } = req.body;
   const user = req.user;
   try {
      const newTweet = new Tweet({
         tweet: tweet,
         user: req.user._id,
      });
      const savedTweet = await newTweet.save();
      user.tweets.push(savedTweet._id);
      user.tweetsCount = user.tweetsCount + 1;
      await user.save();

      res.json({
         success: true,
         savedTweet,
      });
   } catch (error) {
      res.json({
         success: false,
         errorMessage: error.message,
      });
   }
};

const handleToggleLike = async (req, res) => {
   try {
      const currentUser = await User.findById(req.user._id);
      const tweet = await Tweet.findById(req.params.id);
      if (!tweet) {
         res.status(401).json({
            success: false,
            message: 'Tweet not found with this id',
         });
      }

      const likes = tweet.likes;
      if (likes.includes(req.user._id)) {
         const index = likes.indexOf(req.user._id);
         likes.splice(index, 1);
         tweet.likesCount = tweet.likesCount - 1;
         await tweet.save();

         await currentUser.liked.pull(tweet);
         console.log('heere', currentUser.liked);
         await currentUser.save();
      } else {
         likes.push(req.user._id);
         tweet.likesCount = tweet.likesCount + 1;
         await tweet.save();

         await currentUser.liked.push(tweet);
         console.log('heere push', currentUser.liked);
         await currentUser.save();
      }

      res.status(201).json({
         success: true,
         likes,
      });
   } catch (error) {
      res.json({
         success: false,
         errorMessage: error.message,
      });
   }
};

const handleToggleBookMark = async (req, res) => {
   try {
      const currentUser = await User.findById(req.user._id);
      const tweet = await Tweet.findById(req.params.id);
      if (!tweet) {
         res.status(401).json({
            success: false,
            message: 'Tweet not found with this id',
         });
      }

      const bookmarks = tweet.bookmarks;
      if (bookmarks.includes(req.user._id)) {
         const index = bookmarks.indexOf(req.user._id);
         bookmarks.splice(index, 1);
         await tweet.save();

         await currentUser.bookmarked.pull(tweet);
         console.log('heere', currentUser.bookmarked);
         await currentUser.save();
      } else {
         bookmarks.push(req.user._id);
         await tweet.save();

         await currentUser.bookmarked.push(tweet);
         console.log('heere push', currentUser.bookmarked);
         await currentUser.save();
      }

      res.status(201).json({
         success: true,
         bookmarks,
      });
   } catch (error) {
      res.json({
         success: false,
         errorMessage: error.message,
      });
   }
};

module.exports = {
   getTweets,
   getUserTweets,
   getTweet,
   handlePostTweet,
   handleToggleLike,
   handleToggleBookMark,
};