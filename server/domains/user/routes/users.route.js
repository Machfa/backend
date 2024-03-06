const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const appError = require('../utils/appError');
const { USER } = require('../utils/userRoles');

router.route('/register')
            .post( usersController.register);
router.route('/login')
            .post(usersController.login);
 router.route('/forgotpassword')
            .patch(usersController.forgotpassword);
router.route('/rendezvous')
            .post(usersController.rendezvous);
router.route('/mydoctorrendezvous')
            .post(usersController.getAllDoctorsRendezvous);
router.route('/deleterendezvous')
            .delete(usersController.deleteRDV);
router.route('/STSrendezvousUser')
            .patch(usersController.StatusRDVuser);
router.route("/searchdoctor")
            .post(usersController.searchDoctors);
router.route("/rendezvoushoursdisponible")
        .post(usersController.getAvailableTime);

module.exports = router;

