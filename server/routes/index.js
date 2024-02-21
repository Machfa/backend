const express = require('express');
const router = express.Router();
const httpStatusText = require('../domains/user/utils/httpStatusText');

const userRouter = require('../domains/user');
const otpRouter = require('../domains/otp');
router.use('/user', userRouter);
router.use('/otp', otpRouter);

// Middleware global pour la gestion des erreurs
router.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        status: error.statusText || httpStatusText.ERROR ,
        message: error.message,
        code: error.statusCode || 500,
        data: null
    });
  });
  
  // Middleware global pour les routes non trouvées
  router.all('*', (req, res, next) => {
      return res.status(404).json({ status: httpStatusText.ERROR, message: 'This resource is not available' });
  });

module.exports = router;
