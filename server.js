var express = require('express');
var connect = require('connect');
var nconf = require('nconf');
var mysql = require('mysql');
var session = require('cookie-session')
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');

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
app.use(session({
	keys : ['secret1', 'secret2']
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(serveStatic('webapp'));


app.listen(nconf.get('port'), function() {
	console.log('Server running at ' + nconf.get('port') + 'port');
});