var nconf = require('nconf');
var mysql = require('mysql');

var DataLoader = function( configFile ) {

	var getRequest = 'SELECT * FROM ??';
	var getByIdRequest = 'SELECT * FROM ?? WHERE id = ?'
	var postRequest = 'INSERT INTO ?? SET ?';
	var updateRequest = 'UPDATE ?? SET ? WHERE id = ?';
	var deleteRequest = 'DELETE FROM ?? WHERE id = ?';

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

	this.getObjects = function ( table, callback ) {
		this.pool.query(getRequest, [table], function(err, rows, fields) {
			if (err) {
				callback( err );
			} else {
				callback( err, rows );
			}
		});
	}

	this.getObject = function( table, id, callback ) {
		this.pool.query(getByIdRequest, [table, id], function(err, rows, fields) {
			if (err) {
				callback( err );
			} else {
				callback( err, rows[0], fields );
			}
		});
	}

	this.postOjbect = function( table, object, callback ) {
		this.pool.query(postRequest, [table, object], function (err, result) {
			if (err) {
				callback( err );
			} else {
				callback( err, result );
			}
		});
	}

	this.putObject = function( table, object, id, callback ) {
		this.pool.query(updateRequest, [table, object, id], function( err, result ) {
			if ( err ) {
				callback( err );
			} else {
				callback( err, result );
			}
		});
	}

	this.deleteObject = function( table, id, callback ) {
		this.pool.query(deleteRequest, [table, id], function( err, result) {
			if ( err ) {
				callback( err );
			} else {
				callback( err, result );
			}
		});
	}
} 

module.exports = DataLoader;