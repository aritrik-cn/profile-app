var userModel 	= require(process.cwd() + '/app/model/homepageModel');
//var io			= require(process.cwd() + '/config/socket');
// DB connection
var mongoose 	= require('mongoose');
var dbconn		= require(process.cwd() + '/config/db_config');
exports.index = function (req,res) {

	//console.log("Home Controller Called : user : " + req.session.user);

	if (req.session.user) {
		var user = req.session.user;
		//var userModelData = userModel.home(user);
		//console.log("userModelData : " + JSON.stringify(userModelData));
		res.render("home", {title: "Home", uname: req.session.user});
	} else {
    	res.redirect('/login');
	}
};

exports.renderUpdate = function (req, res) {
	if (req.session.user) {
		mongoose.connection.close();
		mongoose.connect('mongodb://localhost/myapp');
		var userModel = mongoose.model ('users', dbconn.addUser);
		userModel.find({'uname': req.session.user}).exec(function (err, data) {
			console.log("user data : " + data);
			res.render("add_user", {title: "Update User", data: data, msg: ""});
		})
	} else {
		res.redirect('/login');
	}
};

exports.postUpdate = function (req, res) {
	if (req.session.user) {
		var uname = req.body.uname;
		var email = req.body.email;
		var pass  = req.body.pass;
		var conditions 	= {'email': email},
			updateData 	= {'pass': pass};
		console.log("new pass : " + pass);
		mongoose.connection.close();
		mongoose.connect('mongodb://localhost/myapp');
		updateModel = mongoose.model('users', dbconn.addUser);
		updateModel.update(conditions, updateData, callback);
		function callback (err, numAffected) {
  			console.log("numAffected : " + numAffected);
		}
		updateModel.find({'uname': uname}, findCallback);
		function findCallback (err, getData) {
			console.log("User Data : " + getData);
			res.render("add_user", {title: "Update User", data: getData, msg: "Password Hasbeen Updated."});
		}
		//res.send('User Data successfully Updated.' + data );
	
	} else {
		res.redirect('/login');
	}
}
