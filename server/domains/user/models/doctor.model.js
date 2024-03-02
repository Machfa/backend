const mongoose = require('mongoose');
const validator = require('validator');
const userRoles = require('../utils/userRoles');

const doctorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'field must be a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [userRoles.USER, userRoles.ADMIN, userRoles.DOCTOR],
        default: userRoles.DOCTOR,
    },
    address: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    numberConsultationInDay: {
        type: Number,
        required: [true, "fee is required"],
    },
    timings: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
