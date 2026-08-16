const Course = require('../models/Course');
const asyncHandler = require('express-async-handler');

// @desc create a new course
// @route POST /api/courses
// @access Private (Admin only)
// @required fields {coursename}
// @return Course
const createCourse = asyncHandler(async (req, res) => {
    const { course } = req.body;

    if (!course || !course.coursename) {
        return res.status(400).json({ message: "Course name is required" });
    }

    const courseObject = {
        coursename: course.coursename,
        description: course.description || ''
    };

    const createdCourse = await Course.create(courseObject);

    if (createdCourse) {
        res.status(201).json({
            course: createdCourse.toCourseResponse()
        });
    } else {
        res.status(422).json({
            errors: { body: "Unable to create course" }
        });
    }
});

module.exports = {
    createCourse
};