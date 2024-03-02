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
            .post(usersController.forgotpassword);

module.exports = router;