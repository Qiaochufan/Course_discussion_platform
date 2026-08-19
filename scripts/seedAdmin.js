require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const connectDB = require('../config/dbConnect');

const seedAdmin = async () => {
    await connectDB();

    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL }).exec();
    if (existingAdmin) {
        console.log('Admin already exists.');
        process.exit(0);
    }

    const hashedPwd = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await User.create({
        username: 'admin',
        email: process.env.ADMIN_EMAIL,
        password: hashedPwd,
        roles: ['Admin']
    });

    console.log('Admin created successfully.');
    process.exit(0);
};

seedAdmin();