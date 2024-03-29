const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const appError = require('../utils/appError');
const { USER } = require('../utils/userRoles');
const multer  = require('multer');

const diskStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads');
        },
        filename: function(req, file, cb) {
            const ext = file.mimetype.split('/')[1];
            const fileName = `user-${Date.now()}.${ext}`;
            cb(null, fileName);
        }
    })
    
    const fileFilter = (req, file, cb) => {
        const imageType = file.mimetype.split('/')[0];
        
        if(imageType === 'image') {
            return cb(null, true)
        } else {
            return cb(appError.create('file must be an image', 400), false)
        }
    }
    
    const upload = multer({ 
        storage: diskStorage,
        fileFilter
    });

router.route('/register')
            .post(upload.single('avatar'),usersController.register);
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
router.route("/evaluatedoctor")
        .patch(usersController.StarEvaluation);

module.exports = router;

