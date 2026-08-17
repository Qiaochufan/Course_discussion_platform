const Post = require('../models/Post');
const Course = require('../models/Course');
const asyncHandler = require('express-async-handler');

// @desc create a new top-level post
// @route POST /api/posts
// @access Private
// @required fields {title, content, channel, course}
// @return Post
const createPost = asyncHandler(async (req, res) => {
    const { post } = req.body;

    if (!post || !post.content || !post.channel || !post.course) {
        return res.status(400).json({ message: "Content, channel, and course are required" });
    }

    const courseExists = await Course.findById(post.course).exec();
    if (!courseExists) {
        return res.status(404).json({ message: "Course not found" });
    }

    const postObject = {
        title: post.title || '',
        content: post.content,
        channel: post.channel,
        course: post.course,
        author: req.userId
    };

    const createdPost = await Post.create(postObject);

    if (createdPost) {
        res.status(201).json({
            post: createdPost.toPostResponse()
        });
    } else {
        res.status(422).json({
            errors: { body: "Unable to create post" }
        });
    }
});

module.exports = {
    createPost
};