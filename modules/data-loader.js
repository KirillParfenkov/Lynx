var nconf = require('nconf');
var mysql = require('mysql');

module.exports = function( configFile ) {

	nconf.argv()
		.env()
		.file({file: configFile});

	this.pool = mysql.createPool({
		connectionLimit : nconf.get('database:connectionLimit'),
		host : nconf.get('database:uri'),
		database: nconf.get('database:name'),
		user: nconf.get('database:user'),
		password: nconf.get('database:password')
	});
}