const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true, 
    },
    roles: {
      type: [String],
      enum: ['Student', 'Admin'],
      default: ['Student'],
    },
    refreshToken: {
      type: String, // used for JWT refresh token rotation
    },
    active: {
      type: Boolean,
      default: true, // lets you soft-disable accounts instead of deleting
    },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

userSchema.methods.toUserResponse = function () {
    return {
        id: this._id,
        username: this.username,
        email: this.email,
        roles: this.roles
    };
};

module.exports = mongoose.model('User', userSchema);