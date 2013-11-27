var fs 	= require('fs');
var url = require('url');

// Database Connection (MongoDB)
var mongoose = require( 'mongoose' );
var dbconn	 = require(process.cwd() + '/config/db_config');
//console.log("db conn : " + dbconn);

exports.index = function (req, res) {
	console.log("Signup controller (get)");
	res.render("signup",{ title: 'Signup', msg: "" });
};
// Post Email for new user
exports.addEmail = function (req, res) {
	var email = req.body.email;
	sendEmail (email);
	res.render("signup",{ title: email, msg: "Email has been sent to " + email + ". Please Check to complete Registration." });
};
//Render New User Registration Page
exports.addUser = function (req,res) {
	var parseUrl 	= url.parse(req.url).query;
	console.log("parseUrl : " + parseUrl);
	if (parseUrl) {
		var pUrl 	= parseUrl.split(":");
		var urlData = pUrl[1].split("___");
		var email 	= urlData[0];
		var eid 	= urlData[1];
		//Check for link valid
		mongoose.connection.close();
		mongoose.connect('mongodb://localhost/myapp');
		var chkEmailModel = mongoose.model('email', dbconn.addEmail);
		chkEmailModel.find({'email': email},function (err, data) {
			console.log("get data : " + data);
			if (data != "" ) {
				var getEmail = data[0].email;
				console.log("email : " + getEmail);
				if (email === getEmail) {
					res.render("add_user", {title: "Add New User", data: data, msg: ""});
				} else {
					res.redirect("/login",{ title: 'Signup', msg: "No Valid Email Found." });
				}
			} else {
				res.send('invalid email');

			}
			//console.log("gemail : " + getEmail);
			//console.log("registration " + email);
		});
		//mongoose.connection.close();
	} else {
		res.render("signup",{ title: 'Signup', msg: "Please Provide your email to complete registration." });
	}
}
//POST new user data
exports.submitUser = function (req, res) {

	mongoose.connection.close();
	mongoose.connect('mongodb://localhost/myapp');
	var userModel = mongoose.model('users', dbconn.addUser);

	var addData = new userModel ({
		email: req.body.email,
		uname: req.body.uname,
		pass: req.body.pass
	});
	addData.save(function(err){
		if (!err) {
			console.log("New User Added Successfully");
		} else {
			console.log(err);
		}
	});
	mongoose.connection.close();
	res.send("New User Added Successfully");
	//console.log("New User Data : " + email + uname + pass);
}

// Send Email to complete Registration

var sendEmail = function (email) {
	var uniqueId = Math.random().toString().split(".");
	if (process.env.NODE_ENV == 'dev') {

		mongoose.connection.close();
		mongoose.connect('mongodb://localhost/myapp');
		var emailModel = mongoose.model('email', dbconn.addEmail);

		emailModel.count({'email' : email}, function (err, data) {
			if (data === 0 ) {
				var addData = new emailModel({
					uniqueId: uniqueId,
					email: email
				});
				addData.save(function (err) {
					if (!err) {
						console.log("created");
					} else {
						console.log(err);
					}
				});
				//mongoose.connection.close();

				var writeData = "Please Click on following link. \n" + "http://localhost:3000/adduser/?eid:" + email + "___" + uniqueId[1];
				fs.writeFile("/var/www/js_test/node/myapp/public/email/" + email + ".txt", writeData, function (err) {
					if (err) {
						console.log("Failed To Write File");
					} else {
						console.log("Please open following link to complete registration : /var/www/js_test/node/myapp/public/email/" + email);
					}
				});
				return true;
			} else {
				return false;
			}
		});
	}
}