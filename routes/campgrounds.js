const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { campgroundSchema } = require('../schemas');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const campgrounds = require('../controllers/campgrounds');

router.get('/campgrounds', catchAsync(campgrounds.index));
router.get('/campgrounds/new', isLoggedIn, campgrounds.newForm);
router.post('/campgrounds', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));
router.get('/campgrounds/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editForm));
router.get('/campgrounds/:id', catchAsync(campgrounds.showCampground));
router.put('/campgrounds/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));
router.delete('/campgrounds/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.destroyCampground));

module.exports = router;
