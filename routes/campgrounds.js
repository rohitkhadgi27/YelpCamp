var express 	= require('express'),
	router  	= express.Router(),
	Campground  = require('../models/campground'),
	middleware  = require('../middleware');	

//=========Campground Gallery==========================================
router.get('/', function(req, res){
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			req.flash('error', "Something went wrong!");
			console.log(err);
			res.redirect('back');
		}else{
			res.render('campgrounds/index.ejs', {campgrounds: allCampgrounds, currentUser: req.user});
		}	   
	});
});

//=========Show to Add New Campground Page==========================================
router.get('/new', middleware.isLoggedIn, function(req ,res){
	res.render('campgrounds/new.ejs');
});

//=========Create New Campground In Database==========================================
router.post('/', middleware.isLoggedIn, function(req, res){
	var name 			= req.body.name,
		price			= req.body.price,
		image 			= req.body.image,
		description		= req.body.description,
		author			= {id: req.user._id, username: req.user.username},
		newCampground 	= {name: name, price: price, image: image, description: description, author: author};
	
	Campground.create(newCampground, function(err, campground){
		if(err){
			req.flash('error', "Something went wrong!");
			console.log(err);
			res.redirect('back');
		}else{
			res.redirect('/campgrounds');
		}
	});		
});

//=========Find The Campground With Provided Id===========================
router.get('/:id', function(req, res){	
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash('error', "Campground not found!");
			console.log(err);
			res.redirect('back');
		}else{
			res.render('campgrounds/show.ejs', {campground: foundCampground});
		}
	});
});

//=========Edit The Selected Campground===========================
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err || !campground){
			req.flash('error', "Campground not found!");
			console.log(err);
			res.redirect('back');	   
		}else{
		   	res.render('campgrounds/edit.ejs', {campground: campground});
		}		 
	});	 
});

//=========Update The Selected Campground===========================
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			req.flash('error', "Something went wrong!");
			console.log(err);
			res.redirect('back');
		}else{
			res.redirect('/campgrounds/' + req.params.id);	
		}
	});
});

//=========Delete The Selected Campground===========================
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
		   	req.flash('error', "Something went wrong!");
			console.log(err);
			res.redirect('back');
		}else{
		   	res.redirect('/campgrounds');
		}
	});
});

module.exports = router;