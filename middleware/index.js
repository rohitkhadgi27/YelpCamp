var middlewareObj ={},
	Campground  = require('../models/campground'),
	Comment  = require('../models/comment');

//=================CheckIsLoggedIn============================
middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
	   return next();
	   }else{
			req.flash('error', "You need to be logged in to do that!");
		   	res.redirect('/login');
	}
}

//=================CheckCampgroundOwnership======================
middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, campground){
			if(err || !campground){
				req.flash('error', "Campground not found!");
				res.redirect('back');
			}else{
				if(campground.author.id.equals(req.user._id)){
					next();
				}else{
				   	req.flash('error', "You donot have permission to do that!");
					res.redirect('back');
				}			
			}
		});
	}else{
		req.flash('error', "You need to be logged in to do that!");
		res.redirect('back');
	}
}

//=================CheckCommentOwnership========================
middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, campground){
			if(err || !campground){
				req.flash('error', "Campground not found!");
				res.redirect('back');
			}else{
				Comment.findById(req.params.comment_id, function(err, comment){
					if(err || !comment){
						req.flash('error', "Comment not found!");
						res.redirect('back');
					}else{
						if(comment.author.id.equals(req.user.id)){
							next();
						}else{
							res.send("You donot have permission to do that!");
							res.redirect('back');
						}			
					}
				});
			}
		});		
	}else{
		req.flash('error', "You need to be logged in to do that!");
		res.redirect('back');
	}
}

module.exports = middlewareObj;