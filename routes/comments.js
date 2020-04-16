var express 	= require('express'),
	router  	= express.Router({mergeParams: true}),
	Campground  = require('../models/campground'),
	Comment  	= require('../models/comment'),
	middleware  = require('../middleware');

//============Takes To Add New Comment=====================================================
router.get('/new', middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			req.flash('error', "Something went wrong!");
			console.log(err);
			res.redirect('back');		
		}else{
			res.render('comments/new.ejs', {campground: campground});
		}
	});
});

//============Create Comment=====================================================
router.post('/', middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			req.flash('error', "Something went wrong!");
			console.log(err);
			res.redirect('back');			
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash('error', "Something went wrong!");
					console.log(err);
					res.redirect('back');					
				}else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					//console.log("Author name is " + req.user.username);
					campground.comments.push(comment);
					campground.save();
					req.flash('success', "Successfully added comment!");
					res.redirect('/campgrounds/' + campground._id);
				}
			});		
		}
	});
});

//=============Edit Comment Page===================================
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			req.flash('error', "Something went wrong!");
			console.log(err);
			return res.redirect('back');			
		}else{
			Comment.findById(req.params.comment_id, function(err, foundComment){
				if(err){
					req.flash('error', "Something went wrong!");
					console.log(err);
					res.redirect('back');
				}else{
					res.render('comments/edit.ejs', {campground: campground ,comment: foundComment});   
				}
			});	
		}	
	});	
});

//=============Update Comment ===================================
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComments){
		if(err){
			req.flash('error', "Something went wrong!");
			console.log(err);
			res.redirect('back');
		}else{
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

//=============Delete Comment ===================================
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			req.flash('error', "Something went wrong!");
			console.log(err);
			res.redirect('back');
		}else{
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

module.exports = router;