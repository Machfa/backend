const express = require("express");
const router = express.Router();
const doctorsController = require("../controllers/doctors.controller");
const { DOCTOR } = require("../utils/userRoles"); // Assuming you have user roles defined

router.route("/register").post(doctorsController.registerDoctor);

router.route("/login").post(doctorsController.loginDoctor);

router.route("/forgotpassword").patch(doctorsController.forgotpassword);

router
  .route("/myrendezvouspatient")
  .post(doctorsController.getAllRendezvousWithMypatient);

router.route("/statusRDV").patch(doctorsController.StatusRDV);
router.route("/RDVdujour").post(doctorsController.SearchRDVdujour);

//router.route("/statusRDV/:id").put(doctorsController.StatusRDV);
//const { id } = req.params;
// Add other routes for Doctor model

module.exports = router;
