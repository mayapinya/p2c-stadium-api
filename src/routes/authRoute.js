const express = require('express');

const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/login-admin', authController.loginAdmin);
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;
