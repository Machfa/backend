const asyncWrapper = require("../middleware/asyncWrapper");
const Doctor = require('../models/doctor.model'); // Assurez-vous d'importer correctement le modèle Doctor
const User = require('../models/user.model');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');

const getAllDoctors = asyncWrapper(async (req, res) => {
    // Récupérer tous les docteurs depuis la base de données en utilisant le modèle Doctor
    const doctors = await Doctor.find({}, { password: 0, __v: 0 }); // Exclure les champs password et __v

    res.json({ status: httpStatusText.SUCCESS, data: { doctors } });
});


const getAllUsers = asyncWrapper(async (req, res) => {
    // Get all users from DB using User Model
    const users = await User.find({}, { password: 0, __v: 0 }); // Exclude password and __v fields

    res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

module.exports ={
    getAllDoctors,
    getAllUsers,
}