
/**
 * Module dependencies.
 */
var express = require('express');
var app 	= express();
var http 	= require('http');
var path 	= require('path');

//Define Global Varriabls
GLOBAL.config = require(process.cwd() + '/config/config').index [process.env.NODE_ENV || "dev"];
//console.log("Config : " + JSON.stringify(GLOBAL.config, null, 4));


// all environments
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
//app.set('port', process.env.PORT || config.expressPort);

var port = process.env.PORT || config.expressPort;
//Calling Router
var routes = require('./routes/routes')(app);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Starting APP
http.createServer(app).listen(port, function(){
  console.log('Express server listening on port ' + port);
});


//socket io
/*var io = require('socket.io').listen(app);
io.sockets.on('connection', function(socket) {
	socket.on('add_user', function (data) {
		console.log("io called : " + data);
	});
});*/

