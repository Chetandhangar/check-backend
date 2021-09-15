const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema(
   {
      firstName: {
         type: String,
         trim: true,
         required: true,
      },
      lastName: {
         type: String,
         trim: true,
         required: true,
      },
      username: {
         type: String,
         trim: true,
         unique: true,
         required: true,
      },
      email: {
         type: String,
         trim: true,
         unique: true,
         required: true,
      },
      password: {
         type: String,
         trim: true,
         required: true,
      },
      bio: {
         type: String,
         trim: true,
      },
      website: {
         type: String,
         trim: true,
      },
      tweets: [
        { 
          type: Schema.Types.ObjectId,
           ref: 'Tweet' 
        }
      ],
      tweetsCount: { 
        type: Number, 
        default: 0 
      },
      liked: [
        { 
          type: Schema.Types.ObjectId, 
          ref: 'Tweet'
        }
      ],
      bookmarked: [
        { 
          type: Schema.Types.ObjectId, 
          ref: 'Tweet' 
        }
      ],
      followers: [
        {
           type: Schema.Types.ObjectId, 
           ref: 'User' 
        }
      ],
      followersCount: { 
        type: Number,
         default: 0
      },
      following: [
        {
           type: Schema.Types.ObjectId, 
           ref: 'User' 
        }
      ],
      followingCount: { 
        type: Number, 
        default: 0
      },
   },
   { timestamps: true },
);

const User = mongoose.model('User', UserSchema);

module.exports = { User };