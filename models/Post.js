const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    channel: {
      type: String,
      enum: ['Resources', 'Reviews', 'Q&A'],
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parentPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      default: null, // null = this is a top-level post; set = this is a comment/reply
    },
  },
  { timestamps: true }
);

postSchema.methods.toPostResponse = function () {
    return {
        id: this._id,
        title: this.title,
        content: this.content,
        channel: this.channel,
        course: this.course,
        author: this.author,
        parentPost: this.parentPost,
        createdAt: this.createdAt
    };
};

module.exports = mongoose.model('Post', postSchema);