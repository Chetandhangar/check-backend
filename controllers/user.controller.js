const { User } = require('../models/user.model');
const { Tweet } = require('../models/tweet.model');

const getUsers = async (req, res) => {
   try {
      const users = await User.find()
         .select('-password')
         .populate({
            path: 'tweets',
            populate: { path: 'user' },
         });
      res.status(201).json({
         success: true,
         users,
      });
   } catch (error) {
      res.json({
         success: false,
         errorMessage: error.message,
      });
   }
};

const getUser = async (req, res) => {
   try {
      const user = await User.findOne({ username: req.params.username })
         .select('-password')
         .populate({ path: 'tweets', populate: { path: 'user' } })
         .populate({ path: 'liked', select: 'id tweet user' })
         .populate({
            path: 'bookmarked',
            select: 'id tweet createdAt',
            populate: {
               path: 'user',
               select: 'id username firstName lastName createdAt',
            },
         })
         .populate({
            path: 'following',
            select: 'id firstName lastName username',
         })
         .populate({
            path: 'followers',
            select: 'id firstName lastName username',
         });

      console.log('hre', user);

      if (!user) {
         throw new Error(
            `Unable to find the user with username ${req.params.username} `,
         );
      }
      res.json({
         succces: true,
         user,
      });
   } catch (error) {
      res.json({
         succces: false,
         message: 'Unable to retrieve the User',
         errorMessage: error.message,
      });
   }
};

const handleFollow = async (req, res) => {
   try {
      const user = await User.findById(req.params.id);

      if (!user) {
         throw new Error('Unable to find the user');
      }

      if (user.followers.includes(req.user._id)) {
         throw new Error("You're already following the User");
      }

      const followUser = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user._id);

      await followUser.followers.push({ _id: req.user._id });
      followUser.followersCount = followUser.followersCount + 1;
      await followUser.save();

      await currentUser.following.push({ _id: req.params.id });
      currentUser.followingCount = currentUser.followingCount + 1;
      await currentUser.save();

      const users = await User.find();

      res.status(201).json({
         success: true,
         users,
      });
   } catch (error) {
      res.json({
         success: false,
         errorMessage: error.message,
      });
   }
};

const handleUnFollow = async (req, res) => {
   try {
      const user = await User.findById(req.params.id);

      if (!user) {
         throw new Error('Unable to find the user');
      }

      const unFollowUser = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user._id);

      await unFollowUser.followers.pull({ _id: req.user._id });
      unFollowUser.followersCount = unFollowUser.followersCount - 1;
      await unFollowUser.save();

      await currentUser.following.pull({ _id: req.params.id });
      currentUser.followingCount = currentUser.followingCount - 1;
      await currentUser.save();

      const users = await User.find();

      res.status(201).json({
         success: true,
         response: users,
      });
   } catch (error) {
      res.json({
         success: false,
         response: users,
      });
   }
};

const getFeed = async (req, res) => {
   try {
      const following = req.user.following;

      const users = await User.find()
         .where('_id')
         .in(following.concat([req.user._id]))
         .exec();

      const tweetIds = users.map((user) => user.tweets).flat();

      const tweets = await Tweet.find()
         .sort('-createdAt')
         .where('_id')
         .in(tweetIds)
         .lean()
         .populate({ path: 'user' })
         .exec();

      res.json({
         success: true,
         tweets,
      });
   } catch (error) {
      res.json({
         success: false,
         message: 'Unable to retrieve feed',
         errorMessage: error.message,
      });
   }
};

module.exports = { getUsers, getUser, handleFollow, handleUnFollow, getFeed };