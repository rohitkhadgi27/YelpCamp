var express 	= require('express'),
	router  	= express.Router(),
	Campground  = require('../models/campground'),
	Comment  	= require('../models/comment'),
	passport 	= require('passport'),
	User		= require('../models/user');

//===========Root Route========================================
router.get('/', function(req, res){
	res.render('landing.ejs');
});

//=========Auth Routes==================================================

	//======Register Form======================	
router.get('/register', function(req, res){
	res.render('register.ejs');
});

	//=====Register New Users To Database============
router.post('/register', function(req, res){
	var newUser  = new User({username: req.body.username}),
		password = req.body.password;
	User.register(newUser, password, function(err, user){
		if(err){
			req.flash('error', err.message);
			console.log(err);
			res.redirect('back');
		}else{
			passport.authenticate('local')(req, res, function(){
			req.flash('success', "Welcome to YelpCamp " + user.username);	
			res.redirect('/campgrounds');
			});
		}
	});
});

	//======Log In Form======================	
router.get('/login', function(req, res){
	res.render('login.ejs');
});

	//=====Handle Sign Up================
router.post('/login', passport.authenticate('local', {
	successRedirect: '/campgrounds',
	failureRedirect: '/login'
	}), function(req, res){
});	

	//=========Logout Handle================
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', "Logged Out!");
	res.redirect('/campgrounds');
});

module.exports = router;
