/*
* Auth Routes - Routes used for authentication
*/
const express = require('express'),
	router = express.Router(),
	passport = require('passport');
require('../passport')(passport);

//Nothing important for this route
router.get('/', function(req, res)
{
	res.render('index',{title:"The Login Page"});
});

//Authenticate using Google. Passport handles the logistics of it!
router.get('/google',
	passport.authenticate('google', { scope : ['profile', 'email']})
);

// the callback after google has authenticated the user
router.get('/google/callback',
	//First use the passport authentication checks...
	passport.authenticate('google',{failureRedirect : '/'}),
	//And then redirect to the saved redirection endpoint or the default profile
	function(req, res)
	{
		res.redirect(req.session.redirectTo || '/profile');
		delete req.session.redirectTo;
	}
);

router.get('/logout',function(req,res)
{
	req.logout();
	req.flash('success','You have been logged out');
	res.redirect('/');
});

module.exports = router;