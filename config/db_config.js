var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var addEmail = new Schema({
					uniqueId: "string",
					email: "string",
				});
var addUser	 = new Schema({
	email: 	"string",
	uname: 	"string",
	pass: 	"string"
});
exports.addEmail = mongoose.model( 'email', addEmail);
exports.addUser = mongoose.model( 'users', addUser);