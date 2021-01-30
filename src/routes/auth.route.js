const express = require('express');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const authValidation = require('../validations/auth.validation');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.get('/me', auth, validate(authValidation.me), authController.me);
router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', auth, validate(authValidation.logout), authController.logout);

module.exports = router;
