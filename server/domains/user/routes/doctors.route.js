const express = require("express");
const router = express.Router();
const doctorsController = require("../controllers/doctors.controller");
const { DOCTOR } = require("../utils/userRoles"); // Assuming you have user roles defined

// Routes for Doctor model
router.route("/").get(doctorsController.getAllDoctors);

router.route("/register").post(doctorsController.registerDoctor);

router.route("/login").post(doctorsController.loginDoctor);

router.route("/forgotpassword").post(doctorsController.forgotpassword);

// Add other routes for Doctor model

module.exports = router;
