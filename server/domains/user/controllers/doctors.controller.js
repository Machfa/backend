const asyncWrapper = require("../middleware/asyncWrapper");
const Doctor = require('../models/doctor.model');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');
const bcrypt = require('bcryptjs');

const loginDoctor = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const error = appError.create('Email and password are required', 400, httpStatusText.FAIL);
        return next(error);
    }

    const doctor = await Doctor.findOne({ email: email });

    if (!doctor) {
        const error = appError.create('Doctor not found', 404, httpStatusText.FAIL);
        return next(error);
    }

    const matchedPassword = await bcrypt.compare(password, doctor.password);

    if (matchedPassword) {
        return res.json({ status: httpStatusText.SUCCESS, data: {} });
    } else {
        const error = appError.create('Incorrect password', 401, httpStatusText.FAIL);
        return next(error);
    }
});

const registerDoctor = asyncWrapper(async (req, res, next) => {
    const { firstName, lastName, phoneNumber, email, password, role, address, specialization, experience, numberConsultationInDay, timings } = req.body;

    const oldDoctor = await Doctor.findOne({ email: email });

    if (oldDoctor) {
        const error = appError.create('Doctor already exists', 400, httpStatusText.FAIL);
        return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoctor = new Doctor({
        firstName,
        lastName,
        phoneNumber,
        email,
        password: hashedPassword,
        role,
        address,
        specialization,
        experience,
        numberConsultationInDay,
        timings
    });

    await newDoctor.save();

    res.status(201).json({ status: httpStatusText.SUCCESS, data: { doctor: newDoctor } });
});

const forgotpassword = asyncWrapper(async (req, res, next) => {
    const { email, newpassword } = req.body;

    if (!email) {
        const error = appError.create('Email is required', 400, httpStatusText.FAIL);
        return next(error);
    }

    const doctor = await Doctor.findOne({ email: email });

    if (!doctor) {
        const error = appError.create('Doctor not found', 404, httpStatusText.FAIL);
        return next(error);
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);
    doctor.password = hashedPassword;

    await doctor.save();

    res.json({ status: httpStatusText.SUCCESS, data: {} });
});

const searchDoctors = asyncWrapper(async (req, res, next) => {
    const { searchQuery } = req.body;
console.log(searchQuery);
    if (!searchQuery) {
        const error = appError.create('Search query parameter is required', 400, httpStatusText.FAIL);
        return next(error);
    }

    const searchRegex = new RegExp(searchQuery, 'i');

    const doctors = await Doctor.find({
        $or: [
            { firstName: searchRegex },
            { lastName: searchRegex },
            { specialization: searchRegex }
        ]
    });

    if (doctors.length === 0) {
        return res.json({ status: httpStatusText.SUCCESS, message: 'No doctors found with the provided search query' });
    } else {
        res.json({ status: httpStatusText.SUCCESS, data: { doctors } });
    }
});


module.exports = {
    registerDoctor,
    forgotpassword,
    loginDoctor,
    searchDoctors
};
