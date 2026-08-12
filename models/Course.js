const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    coursename: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { timestamps: true }
);

courseSchema.methods.toCourseResponse = function () {
    return {
        id: this._id,
        coursename: this.coursename,
        description: this.description
    };
};

module.exports = mongoose.model('Course', courseSchema);