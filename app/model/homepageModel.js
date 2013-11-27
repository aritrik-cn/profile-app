/*
* Home Page Model\
*/
var mongoose 	= require('mongoose');
var dbConn 		= require (process.cwd() + '/config/db_config');

/**** Home Page Model *****/
exports.home = function (uname) {
	return returnHomeData (uname);
}

var returnHomeData = function (uname, callback) {
	var returnData;
	mongoose.connection.close();
	mongoose.connect('mongodb://localhost/myapp');
	var userModel 	= ('users', dbConn.addUser);
	/*var getData 	= userModel.find({'uname': uname}, function (err, data) {
		returnData = data;
	});
	//console.log("get Data : " + getData);
	return getData;
	/*var getdata = userModel.find({'uname': uname}, function (err, data) {
		console.log("user Details : " + data);
		returnData = data;
		return returnData;
	});*/
	var userData = userModel.find({'uname': uname}).exec(function (err, data){ 
	 	this.returnData = data;
	 	console.log("userModel : " + returnData);
	 	return returnData;
	});
	console.log("returnData : " + returnData);
	return returnData;
}

