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

var tabales = {};
tabales['users'] = [{
		id : 1,
		firstName : 'Kiryl',
		lastName : 'Parfiankou',
		email : 'Kiryl_Parfiankou@gmail.com'
	},
	{
		id : 2,
		firstName : 'Bob',
		lastName : 'Bobse',
		email : 'Bob_Bobse@email.com'
	},
	{
		id : 3,
		firstName : 'Test',
		lastName : 'Tests',
		email : 'Test_test@gmail.com'
	}
];

app.get('/api/:table', function(req, res) {
	res.json( tabales[req.params.table] );
});

app.post('/api/:table', function(req, res) {

});

app.get('/api/:table/:id', function(req, res) {
	var table = tabales[req.params.table];
	var id = req.params.id;
	for ( var i = 0 ; i < table.length; i++) {
		if ( table[i].id == id ) {
			res.json(table[i]);
			return;
		}
	}
	res.json(400, {error: 'Not Found'});
});

app.put('/api/:table/:id', function(req, res) {

});

app.delete('/api/:table/:id', function(req, res) {

});

app.listen(nconf.get('port'), function() {
	console.log('Server running at ' + nconf.get('port') + ' port');
});