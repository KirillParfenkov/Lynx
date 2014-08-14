var nconf = require('nconf'),
	mysql = require('mysql'),
	async = require('async'),
	passwordHash = require('password-hash'),
	fs = require('fs');

var ProfileDao = function ( configFile, permissionSetsDir, casher ) {
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

	this.permissionSetsPath = __dirname + '/../' + permissionSetsDir;

	this.getProfileById = function( id, done ) {
		var permissionSetsPath = this.permissionSetsPath;
		this.pool.query('SELECT id, name, admin FROM profiles WHERE id = ?', [id], function(err, rows, fields) {
			if ( err ) {
				done( err );
			} else {
				var profile = rows[0];
				if ( !profile ) {
					return done( null, false );
				} else {
					fs.readFile( permissionSetsPath + '/' + profile.name + '.json', 'utf-8', function(err, data) {
						if (err) {
							return done( null, profile );
						} else {
							profile.permissionSet = JSON.parse( data );
							return done( null, profile );
						}
					});
				}
			}
		});
	};
}

module.exports = ProfileDao;