var express = require('express'),
	connect = require('connect'),
	nconf = require('nconf'),
	mysql = require('mysql'),
	session = require('cookie-session'),
	bodyParser = require('body-parser'),
	serveStatic = require('serve-static'),
	crypto = require('crypto'),
	mc = require('mc'),
	UserDao = require('./modules/user-dao'),
	GlobalVariablesDao = require('./modules/globalVariables-dao-tmp'),
	ContentDao = require('./modules/content-dao'),
	DataLoader = require('./modules/data-loader'),
	ProfileDao = require('./modules/profile-dao'),
	EmailService = require('./services/email-service');
	url = require('url'),
	formidable = require('formidable'),
	multiparty = require('connect-multiparty'),
	fs = require('fs'),
	mkpath = require('mkpath'),
	path = require('path'),
	async = require('async'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;


/*var emailService = new EmailService('./config.json');

emailService.sendMail({
	to : 'Kirill.Parfenkov@gmail.com',
	subject : "Server started",
	text : "server started",
	html : "<h1>Server started!</h1>"
}, function( err, info ) {
	if ( err ){
		console.log( err );	
	} else {
		console.log( 'Email service work!' );
		console.log( info );
	}
});*/

var dataLoader = new DataLoader('./config.json');
dataLoader.initialize(function( err ) {
	console.log('dataLoader is ready!');
});

var userDao = new UserDao('./config.json');
var globalVariablesDao = new GlobalVariablesDao( './config.json' );
var contentDao = new ContentDao( './config.json' );
var profileDao = new ProfileDao( './config.json', 'content/permissionSets', false );
profileDao.initialize(function( err ) {
	if ( !err ) {
		console.log( 'profile-dao is ready!');
	} else {
		console.err( err );
	}
});

nconf.argv()
	.env()
	.file({file: './config.json'});

var client = new mc.Client('localhost', mc.Adapter.json);
client.connect( function( err ) {
	console.log('memchashed! port 11211');
});

var tabales = {};

var sessions = [];
var app = express();

function ensureAuthenticated( req, res, next ) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect( 302, '/login.html');
}

passport.use( new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	},
	function( email, password, done ) {

		var len = 256;
		var isCredNotReady = true;
		var sessionKey;

		userDao.authorize( email, password, function( err, loginUser ) {

			if ( err ) {
				return done( err );
			}

			if ( !loginUser ) {
				return done( null, false, { message: 'Incorrect credationls!' } );
			}

			return done( null, loginUser );
		});
	}
));

passport.serializeUser( function( user, done ) {

	var len = 256;
	var isCredNotReady = true;
	var sessionKey;

	while ( isCredNotReady ) {
		sessionKey = crypto.randomBytes(len).toString('hex');
		if ( sessions.indexOf(sessionKey) == -1 ) {
			isCredNotReady = false;
		}
	}

	sessions.push({id : sessionKey, user: user});

	done( null, sessionKey );
});

passport.deserializeUser( function( sessionKey, done ) {

	var sessionExist = false;
	var user;
	if ( sessionKey ) {
		for (var i = 0; i < sessions.length; i++) {
			if ( sessions[i].id == sessionKey ) {
				sessionExist = true;
				user = sessions[i].user;
				break;
			}
		}
	}

	if ( !sessionExist ) {
		done( null, false, { message: 'Incorrect credationls!' } );
	} else {
		done( null, user );
	}
});

app.use(session({
	keys : ['secret1', 'secret2']
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(serveStatic('public'));

app.use(passport.initialize());
app.use(passport.session());
app.post('/login', passport.authenticate( 'local', { successRedirect: '/', failureRedirect: '/login.html' }));

app.use(ensureAuthenticated);
app.use(serveStatic('webapp'));
app.use(serveStatic('content/files'));


app.get( '/system/currentUser', function(req, res) {
	res.json( 200, req.user );
});

app.get( '/system/currentProfile', function(req, res) {
	profileDao.getProfileById( req.user.profile, function( err, profile ) {
		if ( err ) {
			res.json( 400, { error: err } );
		}
		res.json( 200, profile );
	});
	
});

app.get( '/system/permissionScheme', function( req, res ) {
	profileDao.getProfileScheme( function( err, scheme ) {
		if ( err ) {
			res.json( 400, { error: err } );
		}
		res.json( 200, scheme );
	});
});

app.get( '/system/getPermissionSets/:id', function( req, res) {
	profileDao.getPermissionSet( req.params.id, function( err, permissionSet ) {
		if ( err ) {
			res.json( 400, { error: err } );
		}
		res.json( 200, permissionSet );
	});
});

app.get( '/system/profiles/:id', function( req, res ) {
	profileDao.getProfileById( req.params.id, function( err, profile ) {
		if ( err ) {
			res.json( 400, { error: err } );
		}
		res.json( 200, profile );
	});
});

app.post('/system/profiles', function( req, res ) {
	profileDao.saveProfile( req.body, function( err, profile ) {
		if ( err ) {
			res.json( 400, {error: 'error'});
		} else {
			res.json( 200, profile );
		}
	});
});

app.get('/system/profiles', function( req, res ) {
	profileDao.getProfileList( function( err, profiles ) {
		if ( err ) {
			res.json( 400, {error: 'error'});
		} else {
			res.json( 200, profiles );
		}
	});
});

app.put('/system/profiles/:id', function( req, res ) {
	profileDao.saveProfile( req.body, function( err, profile ) {
		if ( err ) {
			res.json( 400, {error: 'error'} );
		} else {
			res.json( 200, profile );
		}
	});
});

app.post('/system/users', function( req, res ) {
	userDao.createUser({
		email : req.body.email,
		firstName : req.body.firstName,
		lastName : req.body.lastName,
		password : req.body.password,
		repPassword : req.body.repPassword,
		profile : req.body.profile
	}, function(err, user) {
		if (err) {
			res.json( 400, err );
		} else {
			res.json( 200, user );
		}
	});
});

app.post('/system/password', function( req, res ) {
    userDao.changePassword({
        id : req.body.id,
        password : req.body.password,
        repPassword : req.body.repPassword
    }, function( err ) {
        if ( err ) {
            res.json( 400, err );
        } else {
            res.json( 200, {} );
        }
    });
});

app.get( '/system/globalVariables', function( req, res ) {
	globalVariablesDao.getList( function( err, variables ) {
		if ( err ) {
			res.json( 400, err );
		} else {
			res.json( 200, variables );
		}
	});
});


app.route('/service/content')
  .get('/:id', function( req, res ) {
	contentDao.get( req.params.id, function( err, content ) {
		if ( err || !content) {
			res.json( 400, err ? err : { error : 'ContentNotExist' } );
		} else {
			res.json( 200, content );
		}
	});
}).post( function( req, res ) {
	contentDao.create( req.body, function( err, content ) {
		if ( err || !content) {
			res.json( 400, err ? err : { error : 'ContentNotExist' } );
		} else {
			res.json( 200, content );
		}
	});
}).put( '/:id', function( req, res ) {
	contentDao.create( req.body, function( err, content ) {
		if ( err || !content) {
			res.json( 400 );
		} else {
			res.json( 200, content );
		}
	});
}).delete( '/:id', function( req, res) {
	contentDao.delete( req.params.id, function( err ) {
		if ( err ) {
			res.json( 400, err );
		} else {
			res.json( 200, {});
		}
	});
});

app.get( '/system/globalVariables/:id', function( req, res) {
	globalVariablesDao.get( req.params.id, function( err, variable ) {
		if ( err || !variable ) {
			res.json( 400, err ? err : { error : 'VariableNotExist' } );
		} else {
			res.json( 200, variable );
		}
	});
});

app.post( '/system/globalVariables', function( req, res ) {
	globalVariablesDao.create( req.body, function( err, variable ) {
		if ( err ) {
			res.json( 400, err ? err : { error : 'VariableNotExist' } );
		} else {
			res.json( 200, variable );
		}
	});
});

app.put( '/system/globalVariables/:id', function( req, res) {
	globalVariablesDao.update( req.body, function( err, variable ) {
		if ( err ) {
			res.json( 400, err );
		} else {
			res.json( 200, variable );
		}
	});
});

app.delete( '/system/globalVariables/:id', function( req, res ) {
	globalVariablesDao.delete( req.params.id, function( err ) {
		if ( err ) {
			res.json( 400, err );
		} else {
			res.json( 200, {});
		}
	});
});

app.get('/logout', function(req, res) {

	var user = req.user;
	for( var i = 0; i < sessions.length; ++i ) {
		if ( sessions[i].user.id == user.id ) {
			sessions.splice(i, 1);
			break;
		}
	}
	res.redirect( 302, '/');
});

app.get('/visibleTabs', function(req, res) {

	var user = req.user;

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
		var newPath = __dirname + "content/files/" + table + '/' + id;
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