var express 			= require('express'),
	app 				= express(),
	bodyParser 			= require('body-parser'),
	mongoose			= require('mongoose'),
	flash				= require('connect-flash');
	passport			= require('passport'),
	localStrategy 		= require('passport-local'),
	expressSession 		= require('express-session'),
	methodOverride		= require('method-override'),
	Campground			= require('./models/campground'),
	Comment				= require('./models/comment'),
	seedDB				= require('./seeds'),
	User				= require('./models/user'),
	indexRoutes 		= require('./routes/index'),
	campgroundRoutes 	= require('./routes/campgrounds'),
	commentRoutes 		= require('./routes/comments');
	
//seedDB();

//=========Flash Message Configuration==============
app.use(flash());	

//========Passport Configuration=======================
app.use(expressSession({
	secret: "This is my first login with express",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');	
	next();
});

//'mongodb+srv://rohitkhadgi27:Guit@r1649@cluster0-1cela.mongodb.net/test?retryWrites=true&w=majority'
//============Connection to MongoDB Atlas Or Local Database=========================
var url = process.env.DATABASEURL || 'mongodb://localhost/yelp_camp';
mongoose.connect(url, { 
	useNewUrlParser: true, 
	useUnifiedTopology: true,
});


//==============Express Configurations=======================
app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

//==============Routes Configurations=======================
app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

//=========Conncetion TO Server============================================
app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("Server Started");
});