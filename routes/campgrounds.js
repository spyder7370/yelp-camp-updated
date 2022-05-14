const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { campgroundSchema } = require('../schemas');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary/config');
const upload = multer({ storage });

const campgrounds = require('../controllers/campgrounds');

router.get('/campgrounds', catchAsync(campgrounds.index));
router.get('/campgrounds/new', isLoggedIn, campgrounds.newForm);
router.post(
	'/campgrounds',
	isLoggedIn,
	upload.array('image'),
	validateCampground,
	catchAsync(campgrounds.createCampground)
);
router.get('/campgrounds/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editForm));
router.get('/campgrounds/:id', catchAsync(campgrounds.showCampground));
router.put(
	'/campgrounds/:id',
	isLoggedIn,
	isAuthor,
	upload.array('image'),
	validateCampground,
	catchAsync(campgrounds.updateCampground)
);
router.delete('/campgrounds/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.destroyCampground));

module.exports = router;
