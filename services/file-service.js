var nconf = require('nconf'),
    fs = require('fs');

var FileService = function( configFile ) {

	this.rootDir = 'content/files';

	/*nconf.argv()
		.env()
		.file({file: configFile});*/

	//nconf.get('file:sender'),

	this.getFiles = function( path, done ) {
		console.log( 'Get Files:');
		console.log( 'path', path );
		var service = this;
		var path = path;
		var filelist = [];
		var parentId = path;

		if ( '#' === path ) {
			path = '';
		}

		fs.readdir( service.rootDir + path, function( err, files ) {
			if ( !err ) {
				for( var i = 0; ( i < files.length ) && ( i < 10 ); i++ ) {
					filelist.push( {
						text : files[i],
						id : path + '/' + files[i],
						parent : parentId
					});
				}
			}
			console.log( filelist );
			done( err, filelist );
		});
	}
}

module.exports = FileService;