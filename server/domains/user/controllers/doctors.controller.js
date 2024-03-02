const asyncWrapper = require("../middleware/asyncWrapper");
const Doctor = require('../models/doctor.model'); // Assurez-vous d'importer correctement le modèle Doctor
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');
const bcrypt = require('bcryptjs');


const loginDoctor = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const error = appError.create('email and password are required', 400, httpStatusText.FAIL);
        return next(error);
    }

    const doctor = await Doctor.findOne({ email: email });

    if (!doctor) {
        const error = appError.create('doctor not found', 400, httpStatusText.FAIL);
        return next(error);
    }

    const matchedPassword = await bcrypt.compare(password, doctor.password);

    if (matchedPassword) {
        // Logged in successfully
        return res.json({ status: httpStatusText.SUCCESS, data: {} });
    } else {
        const error = appError.create('incorrect password', 401, httpStatusText.FAIL);
        return next(error);
    }
});


const registerDoctor = asyncWrapper(async (req, res, next) => {
    const { firstName, lastName, email, password, role, address, specialization, experience, numberConsultationInDay, timings } = req.body;

    const oldDoctor = await Doctor.findOne({ email: email });

    if (oldDoctor) {
        const error = appError.create('doctor already exists', 400, httpStatusText.FAIL);
        return next(error);
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoctor = new Doctor({
        firstName,
        lastName,
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
        const error = appError.create('email is required', 400, httpStatusText.FAIL);
        return next(error);
    }

    const doctor = await Doctor.findOne({ email: email });

    if (!doctor) {
        const error = appError.create('doctor not found', 400, httpStatusText.FAIL);
        return next(error);
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newpassword, 10);
    doctor.password = hashedPassword;

    // Save the updated doctor with the new hashed password
    await doctor.save();

    res.json({ status: httpStatusText.SUCCESS, data: {} });
});

// Les autres fonctions restent généralement similaires

module.exports = {
    registerDoctor,
    forgotpassword,
    loginDoctor
    // Les autres fonctions (login, forgotpassword) restent inchangées
};
