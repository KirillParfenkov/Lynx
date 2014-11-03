var nconf = require('nconf'),
    fs = require('fs');

var FileService = function( configFile ) {

	this.rootDir = 'content/files';

	/*nconf.argv()
		.env()
		.file({file: configFile});*/

	//nconf.get('file:sender'),

	this.getFiles = function( path, done ) {
		var service = this;
		var path = path;
		var filelist = [];
		var parentId = path;

		if ( '#' === path ) {
			path = '';
		}

		var stat = fs.statSync( service.rootDir + path); 

		if ( stat.isDirectory() ) {
			var fileStat;
			var icon;
			var file;
			// TODO make asynchronous
			fs.readdir( service.rootDir + path, function( err, files ) {
				if ( !err ) {
					for( var i = 0; i < files.length; i++ ) {

						file = {
							text : files[i],
							id : path + '/' + files[i],
							parent : parentId
						};
						fileStat = fs.statSync( service.rootDir + path + '/' + files[i] );
						if ( fileStat.isFile() ) {
							file.icon = 'glyphicon glyphicon-leaf';
						}

						filelist.push( file );
					}
				}
				done( err, filelist );
			});	
		} else {
			done( null, filelist );
		}
	}
}

module.exports = FileService;