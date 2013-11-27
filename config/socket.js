module.exports = function (app) {
	var io = require('socket.io').listen(app);
	io.sockets.on('connection', function(socket) {
		socket.on('add_user', function (data) {
			console.log("io called : " + data);
		});
	});
}