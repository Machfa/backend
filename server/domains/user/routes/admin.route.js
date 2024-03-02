const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { ADMIN } = require("../utils/userRoles"); // Assuming you have user roles defined

// Routes for Doctor model
router.route("/users").get(adminController.getAllUsers);
router.route("/doctors").get(adminController.getAllDoctors);

module.exports = router;

