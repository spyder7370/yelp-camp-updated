const User = require('../models/user');

module.exports.registerForm = (req, res) => {
	res.render('users/register');
};

module.exports.registerUser = async (req, res, next) => {
	try {
		const { email, username, password } = req.body;
		const user = await new User({ email, username });
		const registeredUser = await User.register(user, password);
		console.log(registeredUser);
		req.login(registeredUser, (err) => {
			if (err) return next(err);
			req.flash('success', 'register successful');
			res.redirect('/campgrounds');
		});
	} catch (err) {
		req.flash('error', err.message);
		res.redirect('/register');
	}
};

module.exports.loginForm = (req, res) => {
	res.render('users/login');
};

module.exports.loginUser = async (req, res) => {
	req.flash('success', 'welcome');
	const redirectUrl = req.session.returnTo || '/campgrounds';
	delete req.session.returnTo;
	res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
	req.logout();
	req.flash('success', 'Logged you out');
	res.redirect('/campgrounds');
};
