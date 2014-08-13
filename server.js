var express = require('express'),
	connect = require('connect'),
	nconf = require('nconf'),
	mysql = require('mysql'),
	session = require('cookie-session'),
	bodyParser = require('body-parser'),
	serveStatic = require('serve-static'),
	crypto = require('crypto'),
	mc = require('mc'),
	DataLoader = require('./modules/data-loader'),
	url = require('url'),
	formidable = require('formidable'),
	multiparty = require('connect-multiparty'),
	fs = require('fs'),
	mkpath = require('mkpath'),
	path = require('path'),
	async = require('async'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

var dataLoader = new DataLoader('./config.json');
dataLoader.initialize(function( err ) {
	console.log('dataLoader is ready!');
});

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

passport.use( new LocalStrategy(
	function( username, password, done ) {

		console.log( 'username: ' + username );
		console.log( 'password: ' + password );

		if ( !(username == 'admin') ) {
			return done( null, false, { message: 'Incorrect username!' } );
		} else if ( !(password == 'admin') ) {
			return done( null, false, { message: 'Incorrect password!' } );
		}

		return done( null, { id : 1 } );
	}
));

app.use(session({
	keys : ['secret1', 'secret2']
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(serveStatic('public'));
app.use(checkSession);
app.use(serveStatic('webapp'));
app.use(serveStatic('files'));

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
		sessions.push({id : sessionKey, user: loginUser});
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

	var sessionKey = req.session.sessionKey;
	var user;

	//serch user
	for ( var i = 0; i < sessions.length; ++i ) {
		if ( sessions[i].id == sessionKey ) {
			user = sessions[i].user;
			break;
		}
	}

	dataLoader.getVisibleTabs( user.profile, function( err, tabs ) {
		if ( err ) {
			res.json( 400, { error: 'SQL error' } );
		} else {
			res.json( 200, tabs );
		}
	});
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
			res.json( 200, result );
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
	dataLoader.deleteObject( req.params.table, req.params.id, function( err, result ) {
		if ( err ) {
			res.json( 400, {error: 'SQL error'} );
		} else {
			res.json( 200, result );
		}
	});
});

app.post('/file/:table/:id', multiparty(), function(req, res) {

	var table = req.params.table;
	var id = req.params.id;
	var fileName = req.files.image.originalFilename;
	var ref = req.query.ref;

	fs.readFile( req.files.image.path, function( err,  loadData) {

		if (err) throw err;
		var newPath = __dirname + "/files/" + table + '/' + id;
		mkpath( newPath, function( err ) {
			var file = {
				name : fileName
			}

			dataLoader.postObject( 'files', file, function( err, result ) {
				if (err) {
					res.json( 400, {error: 'SQL error'});
				} else {
					file.id = result.id;
					file.path = table + '/' + id + '/' + result.id;
					async.parallel([
						function( back ) {
							dataLoader.putObject( 'files', file, result.id, function( err, result ) {
								if (err) throw err;
								back();
							});
						},
						function( back ) {
							fs.writeFile( newPath + '/' + result.id, loadData, function( err ){
								if (err) throw err;
								back();
							});
						}
					], function( err, results ) {
						if (err) throw err;
						if ( ref ) {
							res.redirect( 302, ref );
							return;
						}
						res.send( 200, file );
					});
				}
			});

			if (err) throw err;

		});
	});
});

app.listen(nconf.get('port'), function() {
	console.log('Server running at ' + nconf.get('port') + ' port');
});