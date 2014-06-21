var express = require('express');
var connect = require('connect');
var nconf = require('nconf');
var mysql = require('mysql');
var session = require('cookie-session')
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var crypto = require('crypto');

nconf.argv()
	.env()
	.file({file: './config.json'});

var pool = mysql.createPool({
	connectionLimit : nconf.get('database:connectionLimit'),
	host : nconf.get('database:uri'),
	database: nconf.get('database:name'),
	user: nconf.get('database:user'),
	password: nconf.get('database:password')
});

var app = express();
var publicUrls = [
	'/login'
];

var sessions = [];

var checkSession = function( req, res, next ) {
	var sessionExist = false;
	if (req.session.sessionKey) {
		for (var i = 0; i < sessions.length; i++) {
			if ( sessions[i].id == req.session.sessionKey ) {
				sessionExist = true;
				break;
			}
		}
	}

	if ( !sessionExist && (publicUrls.indexOf(req.url) == -1) ) {
		req.session.sessionKey = null;
		res.redirect( 302, '/login.html');
	} else {
		next();
	}
}

app.use(session({
	keys : ['secret1', 'secret2']
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(serveStatic('public'));
app.use(checkSession);
app.use(serveStatic('webapp'));


app.listen(nconf.get('port'), function() {
	console.log('Server running at ' + nconf.get('port') + ' port');
});

app.post('/login', function (req, res) {
	var creds = req.body;
	var len = 256;
	var isCredNotReady = true;
	var sessionKey;
	while ( isCredNotReady ) {
		sessionKey = crypto.randomBytes(len).toString('hex');
		if ( sessions.indexOf(sessionKey) == -1 ) {
			isCredNotReady = false;
		}
	}
	sessions.push({id : sessionKey});
	req.session.sessionKey = sessionKey;
	res.redirect( 302, '/');
});