const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

const authLogic = require('../controllers/auth');

router.get('/register', authLogic.registerForm);
router.post('/register', catchAsync(authLogic.registerUser));
router.get('/login', authLogic.loginForm);
router.post(
	'/login',
	passport.authenticate('local', {
		failureFlash: true,
		failureRedirect: '/login'
	}),
	catchAsync(authLogic.loginUser)
);
router.get('/logout', authLogic.logoutUser);

module.exports = router;
