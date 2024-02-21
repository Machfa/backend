const asyncWrapper = require("../middleware/asyncWrapper");
const User = require('../models/user.model');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');
const bcrypt = require('bcryptjs');

const getAllUsers = asyncWrapper(async (req, res) => {
    // Get all users from DB using User Model
    const users = await User.find({}, { password: 0, __v: 0 }); // Exclude password and __v fields

    res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

const register = asyncWrapper(async (req, res, next) => {
    const { firstName, lastName, email, password, role } = req.body;

    const oldUser = await User.findOne({ email: email });

    if (oldUser) {
        const error = appError.create('user already exists', 400, httpStatusText.FAIL);
        return next(error);
    }

    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
    });

    await newUser.save();

    res.status(201).json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
});

const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const error = appError.create('email and password are required', 400, httpStatusText.FAIL);
        return next(error);
    }

    const user = await User.findOne({ email: email });

    if (!user) {
        const error = appError.create('user not found', 400, httpStatusText.FAIL);
        return next(error);
    }

    const matchedPassword = await bcrypt.compare(password, user.password);

    if (matchedPassword) {
        // Logged in successfully
        return res.json({ status: httpStatusText.SUCCESS, data: {} });
    } else {
        const error = appError.create('incorrect password', 401, httpStatusText.FAIL);
        return next(error);
    }
});


const forgotpassword = asyncWrapper(async (req, res, next) => {
    const { email, newpassword } = req.body;

    if (!email) {
        const error = appError.create('email is required', 400, httpStatusText.FAIL);
        return next(error);
    }

    const user = await User.findOne({ email: email });

    if (!user) {
        const error = appError.create('user not found', 400, httpStatusText.FAIL);
        return next(error);
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);
    user.password = hashedPassword;

    // Save the updated user with the new hashed password
    await user.save();

    res.json({ status: httpStatusText.SUCCESS, data: {} });
});

module.exports = {
    getAllUsers,
    register,
    login,
    forgotpassword
};
