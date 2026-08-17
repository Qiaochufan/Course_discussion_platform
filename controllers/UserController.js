const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
// @desc registration for a user
// @route POST /api/users
// @access Public
// @required fields {email, username, password}
// @return User
const registerUser = asyncHandler(async (req, res) => {
    const { user } = req.body;

    // confirm data
    if (!user || !user.email || !user.username || !user.password) {
        return res.status(400).json({message: "All fields are required"});
    }

    // hash password
    const hashedPwd = await bcrypt.hash(user.password, 10); 

    const userObject = {
        "username": user.username,
        "password": hashedPwd,
        "email": user.email
    };

    const createdUser = await User.create(userObject);

    if (createdUser) { 
        res.status(201).json({
            user: createdUser.toUserResponse()
        })
    } else {
        res.status(422).json({
            errors: {
                body: "Unable to register a user"
            }
        });
    }
});

// @desc get currently logged-in user
// @route GET /api/user
// @access Private
// @return User
const getCurrentUser = asyncHandler(async (req, res) => {
    const email = req.userEmail;

    const user = await User.findOne({ email }).exec();

    if (!user) {
        return res.status(404).json({message: "User Not Found"});
    }

    res.status(200).json({
        user: user.toUserResponse()
    })

});

// @desc login for a user
// @route POST /api/users/login
// @access Public
// @required fields {email, password}
// @return User
const userLogin = asyncHandler(async (req, res) => {
    const { user } = req.body;

    // confirm data
    if (!user || !user.email || !user.password) {
        return res.status(400).json({message: "All fields are required"});
    }

    const DUMMY_HASH = "$2b$10$CwTycUXWue0Thq9StjUM0uJ8vSKFRZOIf2NCVFqZQxUb9V1qWjgLK";
    const loginUser = await User.findOne({ email: user.email }).exec();

    const match = await bcrypt.compare(
        user.password,
        loginUser ? loginUser.password : DUMMY_HASH
    );
    // make sure attacker does not know if the email or username exists

    if (!loginUser || !match) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    //  access token (short-lived)
    const accessToken = jwt.sign(
        { id: loginUser._id,email: loginUser.email, roles: loginUser.roles },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );

    // create refresh token (long-lived)
    const refreshToken = jwt.sign(
        { email: loginUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );


    loginUser.refreshToken = refreshToken;
    await loginUser.save();

    // send refresh token as an httpOnly cookie
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: false, // set to true once you deploy with HTTPS
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
    });

    res.status(200).json({
        accessToken,
        user: loginUser.toUserResponse()
    });
});

// @desc update currently logged-in user
// Warning: if password or email is updated, client-side must update the token
// @route PUT /api/user
// @access Private
// @return User
const updateUser = asyncHandler(async (req, res) => {
    const { user } = req.body;

    // confirm data
    if (!user) {
        return res.status(400).json({message: "Required a User object"});
    }

    const email = req.userEmail;

    const target = await User.findOne({ email }).exec();

     if (!target) {
        return res.status(404).json({message: "User Not Found"});
    }

    if (user.email) {
         const existingUser = await User.findOne({ email: user.email }).exec();
            if (existingUser && existingUser._id.toString() !== target._id.toString()) {
                return res.status(409).json({ message: "This email has already been used" });
            }
        target.email = user.email;
    }

    if (user.username) {
         const existingName = await User.findOne({ username: user.username }).exec();
            if (existingName && existingName._id.toString() !== target._id.toString()) {
                return res.status(409).json({ message: "This username has already been used" });
            }
        target.username = user.username;
    }

    if (user.password) {
        const hashedPwd = await bcrypt.hash(user.password, 10);
        target.password = hashedPwd;
    }
    await target.save();

    return res.status(200).json({
        user: target.toUserResponse()
    });

});


// @desc delete currently logged-in user's own account permanently
// @route DELETE /api/user
// @access Private
// @return message
const deleteUser = asyncHandler(async (req, res) => {
    const email = req.userEmail;

    const target = await User.findOne({ email }).exec();

    if (!target) {
        return res.status(404).json({ message: "User Not Found" });
    }

    // TODO: once Post/Comment models exist, cascade-delete this user's
    // posts and comments here before removing the user, e.g.:
    // await Post.deleteMany({ author: target._id });
    // await Comment.deleteMany({ author: target._id });

    await target.deleteOne();

    res.status(200).json({ message: "Account deleted successfully" });
});

module.exports = {
    registerUser,
    getCurrentUser,
    userLogin,
    updateUser,
    deleteUser
}
