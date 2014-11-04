var nconf = require('nconf'),
    fs = require('fs'),
    mkpath = require('mkpath');

var FileService = function( configFile ) {

	this.rootDir = 'content/files';

	/*nconf.argv()
		.env()
		.file({file: configFile});*/

	//nconf.get('file:sender'),

	this.loadFile = function( src, done ) {
		// TODO make asynchronous
		var dirPath = src.dirPath;
		var filePath = src.filePath;
		var fileName = src.fileName;
		var dirForUpload = "content/files" + dirPath;

		fs.readFile( filePath, function( err,  loadData ) {
			if ( err ) {
				done( err );
			} else {
				mkpath( dirForUpload, function( err ) {
					if ( !err ) {
						fs.writeFile( dirForUpload + '/' + fileName, loadData, function( err ){
							done( err );
						});	
					} else {
						done( err );
					}
					
				});
			}
		});

	}

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
							file.isFile = true;
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