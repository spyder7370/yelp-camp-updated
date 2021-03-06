if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const Campground = require('./models/campground');
const Review = require('./models/review');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const { campgroundSchema, reviewSchema } = require('./schemas');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const authRoutes = require('./routes/auth');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

mongoose
	.connect('mongodb://localhost:27017/yelpcamp')
	.then(() => console.log('DB working!'))
	.catch((error) => console.log(error));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(
	express.urlencoded({
		extended: true
	})
);

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
	session({
		secret: 'secret key for yelpcamp',
		resave: false,
		saveUninitialized: true,
		cookie: {
			httpOnly: true,
			// secure: true,
			expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
			maxAge: 1000 * 60 * 60 * 24 * 7
		}
	})
);
app.use(mongoSanitize());
app.use(flash());

app.use(helmet());

const scriptSrcUrls = [
	'https://stackpath.bootstrapcdn.com/',
	'https://api.tiles.mapbox.com/',
	'https://api.mapbox.com/',
	'https://kit.fontawesome.com/',
	'https://cdnjs.cloudflare.com/',
	'https://cdn.jsdelivr.net'
];
const styleSrcUrls = [
	'https://kit-free.fontawesome.com/',
	'https://stackpath.bootstrapcdn.com/',
	'https://api.mapbox.com/',
	'https://api.tiles.mapbox.com/',
	'https://fonts.googleapis.com/',
	'https://use.fontawesome.com/'
];
const connectSrcUrls = [
	'https://api.mapbox.com/',
	'https://a.tiles.mapbox.com/',
	'https://b.tiles.mapbox.com/',
	'https://events.mapbox.com/'
];
const fontSrcUrls = [];
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: [],
			connectSrc: [ "'self'", ...connectSrcUrls ],
			scriptSrc: [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
			styleSrc: [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
			workerSrc: [ "'self'", 'blob:' ],
			objectSrc: [],
			imgSrc: [
				"'self'",
				'blob:',
				'data:',
				'https://res.cloudinary.com/diabrsvd6/', //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
				'https://images.unsplash.com/'
			],
			fontSrc: [ "'self'", ...fontSrcUrls ]
		}
	})
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	res.locals.currentUser = req.user;
	next();
});

app.use(authRoutes);
app.use(campgroundRoutes);
app.use(reviewRoutes);
app.get('/', (req, res) => {
	res.render('home');
});

app.all('*', (req, res, next) => {
	next(new ExpressError('Page does not exists', 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = 'Something went wrong';
	res.status(statusCode).render('error', {
		err
	});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log('server started on port 3000');
});
