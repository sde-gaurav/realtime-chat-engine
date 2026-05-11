const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/auth');
const { registerSchema, loginSchema } = require('../utils/validators');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login',    validate(loginSchema),    authController.login);
router.post('/refresh',                            authController.refresh);
router.post('/logout',   authenticate,             authController.logout);

module.exports = router;
