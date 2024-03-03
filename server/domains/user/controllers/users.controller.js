const asyncWrapper = require("../middleware/asyncWrapper");
const User = require('../models/user.model');
const Rendezvous = require('../models/rendezvous.model');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const moment = require("moment");


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


const rendezvous = async (req, res, next) => {
    try {
      req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
      req.body.time = moment(req.body.time, "HH:mm").toISOString();
      req.body.status = "pending";
  
      const rendezvousModel = new Rendezvous(req.body); // Assuming Rendezvous is your Mongoose model
  
      await rendezvousModel.save();
      
      res.json({ status: httpStatusText.SUCCESS, data: {} });
    } catch (error) {
      console.error('Error while saving rendezvous:', error);
  
      const errorMessage = 'Error saving rendezvous';
      const status = 500; // Internal Server Error
      const appErrorInstance = appError.create(errorMessage, status, httpStatusText.FAIL);
      return next(appErrorInstance);
    }
  };

  
  const StatusRDVuser = async (req, res, next) => {
    try {
        const { _id, status } = req.body; // Corrected the variable name from _Id to _id
        const RDV = await Rendezvous.findByIdAndUpdate(
            _id,
            { status },
            { new: true } // Added this option to return the updated document
        );

        if (!RDV) {
            const error = appError.create('Rendezvous not found', 404, httpStatusText.FAIL);
            return next(error);
        }

        res.json({ status: httpStatusText.SUCCESS, data: {} });
    } catch (error) {
        console.error('Error updating status:', error);

        const errorMessage = 'Error updating status';
        const status = 500; // Internal Server Error
        const appErrorInstance = appError.create(errorMessage, status, httpStatusText.FAIL);
        return next(appErrorInstance);
    }
};

  const getAllDoctorsRendezvous = asyncWrapper(async (req, res, next) => {
    try {
      const userId = req.body._id;
  
      // Fetch all doctors with their rendezvous for a specific userId
      const doctorsRendezvous = await Rendezvous.find({ userId: userId })
      .select('doctorId date status time'); ;
  
      res.json({ status: httpStatusText.SUCCESS, data: {doctorsRendezvous} });
    } catch (error) {
      console.error('Error while fetching doctors with rendezvous:', error);
  
      const errorMessage = 'Error fetching doctors with rendezvous';
      const status = 500; // Internal Server Error
      const appErrorInstance = appError.create(errorMessage, status, httpStatusText.FAIL);
      return next(appErrorInstance);
    }
  });
  
  
  const deleteRDV = asyncWrapper(async (req, res, next) => {
    const { userId, doctorId } = req.body;

    if (!userId || !doctorId) {
        const error = appError.create('userId and doctorId are required', 400, httpStatusText.FAIL);
        return next(error);
    }

    try {
        // Use findOne instead of find to get a single document
        const RDV = await Rendezvous.findOne({ userId: userId, doctorId: doctorId });

        if (!RDV) {
            const error = appError.create('Rendezvous not found', 404, httpStatusText.FAIL);
            return next(error);
        }

        // Ensure that RDV.toObject() returns a Mongoose document
        const rdvDocument = RDV.toObject();
        await RDV.deleteOne({ _id: rdvDocument._id });
        res.json({ status: httpStatusText.SUCCESS, message: 'Rendezvous deleted successfully', data: {} });
    } catch (error) {
        console.error('Error during RDV deletion:', error);
        const errorMessage = 'Error deleting RDV';
        const status = error.name === 'CastError' ? 400 : 500; // Handle invalid ID as Bad Request
        const appErrorInstance = appError.create(errorMessage, status, httpStatusText.FAIL);
        return next(appErrorInstance);
    }
});

  
  
  
module.exports = {
    register,
    login,
    forgotpassword,
    rendezvous,
    getAllDoctorsRendezvous,
    deleteRDV,
    StatusRDVuser
};
