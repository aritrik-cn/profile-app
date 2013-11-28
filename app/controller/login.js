// Database Connection (MongoDB)
var mongoose 	= require( 'mongoose' );
var dbconn	 	= require(process.cwd() + '/config/db_config');
var recaptcha	= require('simple-recaptcha');
var fs 			= require('fs');

exports.index = function (req, res) {
	console.log("Post login data");
	var uname 	= req.body.uname;
	var pass 	= req.body.pass;
	var remembr = req.body.remembr;
	mongoose.connection.close();
	mongoose.connect('mongodb://localhost/myapp');
	//console.log("rem : " + req.cookies.remembr);
	var chkLoginModel = mongoose.model('users', dbconn.addUser);
	chkLoginModel.count({'uname': uname, 'pass': pass},function (err, data) {
		console.log("fetch data : " + data);
		if (data > 0) {
			req.session.user = uname;
			if ( remembr == 'on') res.cookie('remembr', uname, { maxAge: 500000, httpOnly: false});
			res.redirect('/home');
		} else {
			console.log("login failed");
			res.render('login', {title: "User Login", msg: "Please Check User Name or Password"});
		}
	});
}

// Logout User
exports.logout = function (req, res) {
	res.clearCookie('remembr');
	req.session.destroy();
	res.redirect('/login');
}

exports.forgotpass = function (req,res) {
	var privateKey 	= '6Lcs4-kSAAAAAN9MjUNMvgPgOkDr1oez282i_9VW'; // your private key here
	var ip 			= req.ip;
	var challenge 	= req.body.recaptcha_challenge_field;
	var response 	= req.body.recaptcha_response_field;
	var email 		= req.body.email;
	recaptcha(privateKey, ip, challenge, response, function(err) {
		if (err) {
			res.render('forgotpass',{title: "Forgot Password", msg: err.message, login: ''});
		} else {
			mongoose.connection.close();
			mongoose.connect('mongodb://localhost/myapp');
			var userModel = mongoose.model('users', dbconn.addUser);
			userModel.count({'email':email}, userModelCallback);
			function userModelCallback (err, getData) {
				console.log("forgot data : " + getData);
				if (getData > 0) {
					writePassword(email,res);
				} else {
					res.render('forgotpass',{title: "Forgot Password", msg: "Provide Valid Email.", login: ''});
				}
			}
			/*userModel.find({'email': email}, function (err, data) {
				if (data !== null || data !== '') {
					console.log("get data : " + data);
					res.render('forgotpass',{title: "Forgot Password", msg: "Password Sent."});
				} else {
					res.render('forgotpass',{title: "Forgot Password", msg: "<span style='color:red'>Provide Valid Email.</span>"});
				}
			});*/
		}
	});
};

var writePassword = function (email, res) {
	var userModel = mongoose.model('users', dbconn.addUser);
	userModel.find({'email':email}, function (err, data) {
		var writeData = 'Your Password : ' + data[0].pass;
		fs.writeFile('/var/www/js_test/node/myapp/public/pass/' + email + '.txt', writeData, function (err) {
			if (err) {
				console.log("Failed To Write File");
				res.render('forgotpass',{title: "Forgot Password", msg: "Please Try Again.", login: ''});
			} else {
				console.log("Please open following link to complete registration : /var/www/js_test/node/myapp/public/email/" + email);
				res.render('forgotpass',{title: "Forgot Password", msg: "Password Sent To " + email + ".", login: ''});
			}
		});
	});
}
/*exports.home = function (req,res) {
	console.log("Home Controller Called : user : " + req.session.user);

	if (req.session.user) {
		res.render("home", {title: "Home", uname: req.session.user});
	} else {
    	res.redirect('/login');
		//res.redirect("/login", {title: "Home", msg: "Please Login To access This Page"});
	}
	userModel.find({'email':email}, userModelCallback);
			function userModelCallback (err, getData) {
				//console.log("forgot data : " + getData);
			}
}*/