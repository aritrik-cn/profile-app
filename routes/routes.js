module.exports = function (app) {

	app.get('/', function (req, res) {
		if (req.cookies.remembr != undefined) {
			req.session.user = req.cookies.remembr;
			res.redirect('/home');
		} else {
			res.render('index', { title: 'Express'});
		}
	});

	//Load sign up page
	var signUp	= require ("../app/controller/signup");
	app.get('/signup',signUp.index);

	//Post Signup Page
	app.post('/signup', signUp.addEmail);

	// Add New User
	app.get('/adduser', signUp.addUser);
	//Post New Registration 
	app.post('/adduser',signUp.submitUser);

	// Sign up with GOOGLE
	app.get('/signup/google', signUp.google);

	//User Login
	var login = require("../app/controller/login");
	app.get('/login', function (req, res) {
		if (req.cookies.remembr != undefined) {
			req.session.user = req.cookies.remembr;
			res.redirect('/home');
		} else {
			res.render("login", {title: "User Login", msg: ""});
		}
	});

	// Post Login Data
	app.post('/login', login.index);

	//Logout User
	app.get('/logout', login.logout);

	//User Home
	home = require('../app/controller/home');
	app.get('/home', home.index);

	//Render Update User page
	app.get('/update', home.renderUpdate);

	// Post User Update
	app.post('/update', home.postUpdate);

	//Render Forgot Password Page
	app.get('/forgotpass', function (req, res) {
		res.render('forgotpass', {title: "Forgot Password", msg: "", login: ''})
	});

	// POST Forgot password Data
	app.post('/forgotpass', login.forgotpass);


}