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

var client = new mc.Client('localhost', mc.Adapter.json);
client.connect( function( err ) {
	console.log('memchashed! port 11211');
});

var tabales = {};
tabales['users'] = [{
		id : 1,
		firstName : 'Kiryl',
		lastName : 'Parfiankou',
		email : 'Kiryl_Parfiankou@gmail.com',
		profile : 1
	},
	{
		id : 2,
		firstName : 'Bob',
		lastName : 'Bobse',
		email : 'Bob_Bobse@email.com',
		profile : 2
	},
	{
		id : 3,
		firstName : 'Test',
		lastName : 'Tests',
		email : 'Test_test@gmail.com',
		profile : 4
	}
];

tabales['tabs'] = [
	{
		id : 1,
		name : 'home', 
    	label : 'Home', 
        link: '#/tab/home', 
        view: 'custom/views/home.js'
    },
    {	
    	id : 2,
    	name : 'test1', 
        label : 'Test 1', 
        link: '#/tab/test1',
        view: 'custom/views/view1.js'
    }
];

tabales['profiles'] = [
	{
		id : 1,
		name : 'SystemAdministrator',
		label : 'System Administrator',
		admin : true,
		tabs : [ 1, 2 ]
    },
    {	
    	id : 2,
    	name : 'User',
    	label : 'User',
    	admin : false,
    	tabs : [ 1 ]
    },
        {	
    	id : 3,
    	name : 'Profile1', 
    	label : 'Profile 1',
    	admin : false,
    	tabs : [ 1 ]
    },
    {	
    	id : 4,
    	name : 'Profile2',
    	label : 'Profile 2',
    	admin : true,
    	tabs : [ 1, 2 ]
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
	dataLoader.getObjects( req.params.table, function( err, rows) {
		if (err) {
			res.json( 400, { error: 'SQL error' });
		} else {
			res.json( 200, rows );
		}
	});
});

app.post('/api/:table', function(req, res) {
	var row = req.body;
	dataLoader.postObject( req.params.table, req.body, function( err, result ) {
		if (err) {
			res.json(400, {error: 'SQL error'});
		} else {
			//will be changed
			row.id = result.insertId;
			res.json( 200, row );
		}
	});
});

app.get('/api/:table/:id', function(req, res) {
	dataLoader.getObject( req.params.table, req.params.id, function( err, row, fields) {
		if (err) {
			res.json( 400, { error: 'SQL error' });
		} else {
			res.json( 200, row);
		}
	});
});

app.put('/api/:table/:id', function(req, res) {
	dataLoader.putObject( req.params.table, req.body, req.params.id, function( err, row ) {
		if ( err ) {
			res.json( 400, {error: 'SQL error'} );
		} else {
			res.json( 200, row );
		}
	});
});

app.delete('/api/:table/:id', function(req, res) {

});

app.listen(nconf.get('port'), function() {
	console.log('Server running at ' + nconf.get('port') + ' port');
});