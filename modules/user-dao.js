var nconf = require('nconf');
var mysql = require('mysql');
var async = require('async');
var passwordHash = require('password-hash')

var UserDao = function ( configFile ) {

	nconf.argv()
		.env()
		.file({file: configFile});

	this.pool = mysql.createPool({
		connectionLimit : nconf.get('database:connectionLimit'),
		host : nconf.get('database:uri'),
		port : nconf.get('database:port'),
		database: nconf.get('database:name'),
		user: nconf.get('database:user'),
		password: nconf.get('database:password')
	});

	this.authorize = function( email, password, done ) {
		// passwordHash
		this.pool.query('SELECT id, firstName, lastName, email, password, profile FROM users WHERE email = ?', [email], function(err, rows, fields) {
			if ( err ) {
				done( err );
			} else {
				var user = rows[0];
				var userPassword;
				if ( !user ) {
					return done( null, false );
				} else {

					userPassword = user.password;
					delete user.password;

					if ( passwordHash.verify( password, userPassword ) ) {
						return done( null, user );
					}

					return done( null, false );
				}
			}
		});

	}

}

module.exports = UserDao;