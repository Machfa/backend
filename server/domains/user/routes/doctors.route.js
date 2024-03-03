const express = require("express");
const router = express.Router();
const doctorsController = require("../controllers/doctors.controller");
const { DOCTOR } = require("../utils/userRoles"); // Assuming you have user roles defined

router.route("/register").post(doctorsController.registerDoctor);

router.route("/login").post(doctorsController.loginDoctor);

router.route("/forgotpassword").post(doctorsController.forgotpassword);

router.route("/searchdoctor").post(doctorsController.searchDoctors);

router.route("/myrendezvouspatient").post(doctorsController.getAllRendezvousWithMypatient);

router.route("/statusRDV").post(doctorsController.StatusRDV);

// Add other routes for Doctor model

module.exports = router;
