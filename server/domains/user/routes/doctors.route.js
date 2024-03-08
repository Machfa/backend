const express = require("express");
const router = express.Router();
const doctorsController = require("../controllers/doctors.controller");
const { DOCTOR } = require("../utils/userRoles"); // Assuming you have user roles defined
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
router.route("/register").post(upload.single('avatar'),doctorsController.registerDoctor);

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
