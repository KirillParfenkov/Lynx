var express = require('express');
var connect = require('connect');
var nconf = require('nconf');
var mysql = require('mysql');
var session = require('cookie-session')
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var crypto = require('crypto');
var mc = require('mc');
var DataLoader = require('./modules/data-loader');

var dataLoader = new DataLoader('./config.json');

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

var client = new mc.Client('localhost', mc.Adapter.json);
client.connect( function( err ) {
	console.log('memchashed! port 11211');
});

var tabales = {};
tabales['users'] = [{
		id : 0,
		firstName : 'Kiryl',
		lastName : 'Parfiankou',
		email : 'Kiryl_Parfiankou@gmail.com',
		profile : 0
	},
	{
		id : 1,
		firstName : 'Bob',
		lastName : 'Bobse',
		email : 'Bob_Bobse@email.com',
		profile : 1
	},
	{
		id : 2,
		firstName : 'Test',
		lastName : 'Tests',
		email : 'Test_test@gmail.com',
		profile : 3
	}
];

tabales['tabs'] = [
	{
		id : 0,
		name : 'home', 
    	label : 'Home', 
        link: '#/tab/home', 
        view: 'custom/views/home.js'
    },
    {	
    	id : 1,
    	name : 'test1', 
        label : 'Test 1', 
        link: '#/tab/test1',
        view: 'custom/views/view1.js'
    }
];

tabales['profiles'] = [
	{
		id : 0,
		name : 'SystemAdministrator',
		label : 'System Administrator',
		admin : true,
		tabs : [ 0, 1 ]
    },
    {	
    	id : 1,
    	name : 'User',
    	label : 'User',
    	admin : false,
    	tabs : [ 0 ]
    },
        {	
    	id : 2,
    	name : 'Profile1', 
    	label : 'Profile 1',
    	admin : false,
    	tabs : [ 0 ]
    },
    {	
    	id : 3,
    	name : 'Profile2',
    	label : 'Profile 2',
    	admin : true,
    	tabs : [ 0, 1 ]
    }
];

var sessions = [];

var app = express();
var publicUrls = [
	'/login'
];

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
app.use(bodyParser.json());
app.use(serveStatic('public'));
app.use(checkSession);
app.use(serveStatic('webapp'));

app.post('/login', function (req, res) {

	var creds = req.body;
	var loginEmail = req.body.email;
	var len = 256;
	var isCredNotReady = true;
	var sessionKey;
	var users = tabales['users'];
	var loginUser;

	for ( var i = 0; i < users.length; ++i ) {
		if ( users[i].email == loginEmail ) {
			loginUser = users[i];
			break;
		}
	}

	if ( loginUser ) {
		while ( isCredNotReady ) {
		sessionKey = crypto.randomBytes(len).toString('hex');
		if ( sessions.indexOf(sessionKey) == -1 ) {
			isCredNotReady = false;
		}
	}
		sessions.push({id : sessionKey, userId: loginUser.id});
		req.session.sessionKey = sessionKey;
		res.redirect( 302, '/');
	} else {
		res.redirect( 302, '/login.html');
	} 
});

app.get('/logout', function(req, res) {
	var sessionKey = req.session.sessionKey;
	for( var i = 0; i < sessions.length; ++i ) {
		if ( sessions[i].id == req.session.sessionKey ) {
			sessions.splice(i, 1);
			break;
		}
	}
	res.redirect( 302, '/');
});

app.get('/visibleTabs', function(req, res) {

	var tabs = tabales['tabs'];
	var users = tabales['users'];
	var profiles = tabales['profiles'];
	var sessionKey = req.session.sessionKey;
	var userId;
	var user;
	var profile;

	for ( var i = 0; i < sessions.length; ++i ) {
		if ( sessions[i].id == sessionKey ) {
			userId = sessions[i].userId;
			break;
		}
	}

	//serch user

	for( var i = 0; i < users.length; ++i ) {
		if ( users[i].id == userId ) {
			user = users[i];
			break;
		}
	}

	for( var i = 0; i < profiles.length; ++i) {
		if ( profiles[i].id == user.profile) {
			profile = profiles[i];
			break;
		}
	}

	var tabsForView = [];

	for ( i = 0; i < tabs.length; ++i) {
		if ( profile.tabs.indexOf(tabs[i].id) != -1) {
			tabsForView.push( tabs[i] );
		}
	}

	res.send( 200, tabsForView );
});

app.get('/api/:table', function(req, res) {
	res.json( tabales[req.params.table] );
});

app.post('/api/:table', function(req, res) {
	var table =  tabales[req.params.table];
	var item = req.body;
	item.id = table.length;
	table.push( item );
	res.json(200, item);
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
	var table = tabales[req.params.table];
	var id = req.params.id;
	for ( var i = 0 ; i < table.length; i++) {
		if ( table[i].id == id ) {
			table[i] = req.body;
			res.json(200, table[i]);
			return;
		}
	}
	res.json(400, {error: 'Not Found'});

});

app.delete('/api/:table/:id', function(req, res) {

});

app.listen(nconf.get('port'), function() {
	console.log('Server running at ' + nconf.get('port') + ' port');
});