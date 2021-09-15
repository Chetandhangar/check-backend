const mongoose = require('mongoose');
const { Schema } = mongoose;

const TweetSchema = new Schema(
   {
      user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
         required: true
      },
      tweet: { 
        type: String,
         required: true
      },
      likes: [
        { 
          type: Schema.Types.ObjectId,
           ref: 'User'
        }
      ],
      likesCount: {
         type: Number,
         default: 0,
      },
      bookmarks: [
        {
           type: Schema.Types.ObjectId,
            ref: 'User'
        }
      ],
   },
   {
      timestamps: true,
   },
);

const Tweet = mongoose.model('Tweet', TweetSchema);

module.exports = { Tweet };