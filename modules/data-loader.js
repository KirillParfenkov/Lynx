var nconf = require('nconf');
var mysql = require('mysql');
var async = require('async');

var DataLoader = function( configFile ) {

	var getRequest = 'SELECT * FROM ??';
	var getByIdRequest = 'SELECT * FROM ?? WHERE id = ?'
	var postRequest = 'INSERT INTO ?? SET ?';
	var updateRequest = 'UPDATE ?? SET ? WHERE id = ?';
	var deleteRequest = 'DELETE FROM ?? WHERE id = ?';
	var selectRelationships = 'SELECT * FROM __relationships';
	var userTable = 'users';
	var relationships;
	var relationshipsMap = {};

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

	this.getRelateTables = function( table, callback ) {
			var callList = [];
			var relationshipList;
			var pool = this.pool;
				if ( relationshipsMap[table] ) {
					relationshipList = relationshipsMap[table].slice(0);
				}
				if ( relationshipsMap[table] ) {
					for( var i = 0; i < relationshipsMap[table].length; i++ ) {
						callList.push( function( callback, relatedTabales ) {
							var relationship = relationshipList.pop();
							
							if ( !relatedTabales ) { relatedTabales = {} }
							pool.query( getRequest, [relationship.linkingTable], function(err, rows, fields) {
								if ( err ) throw err;
								relatedTabales[ relationship.field ] = rows;
								callback( null, relatedTabales );
							});
						});
					}
					async.waterfall( callList, function( err, relatedTabales) {
						callback( err, relatedTabales );
					});
				} else {
					callback();
				}

	};

	this.initialize = function( callback ) {
		this.pool.query( selectRelationships, [], function(err, rows, fields) {
			if (err) {
				callback( err );
			} else {
				relationships = rows;
				for( var i = 0; i < relationships.length; i++) {
					if ( !(relationshipsMap[relationships[i].parent])) {
						relationshipsMap[relationships[i].parent] = [];
					}
					relationshipsMap[relationships[i].parent].push(relationships[i]);
				}
				callback( err );
			}
		});
	}

	this.getObjects = function ( table, mainCallback ) {
		var loader = this;
		async.waterfall([
			function loadRelatedTables( next ) {
				loader.getRelateTables( table, function( err, relatedTabales) {
					next( null, relatedTabales );
				});
			},
			function loadTable ( relatedTabales, next ) {
				var relationshipList = relationshipsMap[table];
				loader.pool.query( getRequest, [table], function( err, rows, fields ) {
					if ( err ) throw err;
					if ( relationshipList ) {
						for( var j = 0; j < relationshipList.length; ++j ) {
							var field = relationshipList[j].field;
							var parentIdField = relationshipList[j].parentIdField;
							var childrenIdField = relationshipList[j].childrenIdField;
							var relatedTabale = relatedTabales[field];
							var resultObjects = {};
							for ( var k = 0; k < relatedTabale.length; ++k ) {
								if ( !resultObjects[(relatedTabale[k])[parentIdField]] ) {
									resultObjects[(relatedTabale[k])[parentIdField]] = [];
								}
								resultObjects[(relatedTabale[k])[parentIdField]].push( (relatedTabale[k])[childrenIdField]);
							}
							for( var i = 0; i < rows.length; ++i ) {
								if ( resultObjects[rows[i].id] ) {
									rows[i][field] = resultObjects[rows[i].id];
								}
								//rows[field].
							}
						}
					}
					next( null, rows );
				});
			}
		], function finish ( err, rows ) {
			mainCallback( null, rows );
		});
	}

	this.getObject = function( table, id, callback ) {
		var loader = this;
		this.pool.query(getByIdRequest, [table, id], function(err, rows, fields) {
			if (err) {
				callback( err );
			} else {
				var result = rows[0];
				async.waterfall([
					function loadRelatedTables ( next ) {
						loader.getRelateTables( table, function( err, relatedTabales) {
							next( null, relatedTabales );
						});
					},
					function load ( relatedTabales, next ) {
						var relationshipList = relationshipsMap[table];
						if ( relationshipList ) {
							for( var j = 0; j < relationshipList.length; ++j ) {
								var field = relationshipList[j].field;
								var parentIdField = relationshipList[j].parentIdField;
								var childrenIdField = relationshipList[j].childrenIdField;
								var relatedTabale = relatedTabales[field];
								var resultObjects = {};
								for ( var k = 0; k < relatedTabale.length; ++k ) {
									if ( !resultObjects[(relatedTabale[k])[parentIdField]] ) {
										resultObjects[(relatedTabale[k])[parentIdField]] = [];
									}
									resultObjects[(relatedTabale[k])[parentIdField]].push( (relatedTabale[k])[childrenIdField]);
								}
								if ( resultObjects[result.id] ) {
									result[field] = resultObjects[result.id];
								}
							}
						}
						next( null, result );
					}
				],function( err, result) {
					callback( null, result );
				});
			}
		});
	}

	this.generateIdsMap = function( relatedTabale, relationship ) {
		if ( relationship ) {
			var field = relationship.field;
			var parentIdField = relationship.parentIdField;
			var childrenIdField = relationship.childrenIdField;
			var resultObjects = {};
			for ( var k = 0; k < relatedTabale.length; ++k ) {
				if ( !resultObjects[(relatedTabale[k])[parentIdField]] ) {
					resultObjects[(relatedTabale[k])[parentIdField]] = [];
				}
				resultObjects[(relatedTabale[k])[parentIdField]].push( (relatedTabale[k])[childrenIdField]);
			}
			return resultObjects;
		} else {
			return null;
		}
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

	this.putObject = function( table, object, id, mainCallback ) {

		var loader = this;
		var listForAdd = {};
		var listFroDel = {};
		console.log('putObject');

			async.waterfall([
				function loadRelatedTables ( next ) {
					loader.getRelateTables( table, function( err, relatedTabales) {
						var relatedIdsMap = {};
						var relationshipList = relationshipsMap[table];
						var field;
						if ( relationshipList ) {
							for( var j = 0; j < relationshipList.length; ++j ) {
								field = relationshipList[j].field;
								relatedIdsMap[field] = loader.generateIdsMap( relatedTabales[field], relationshipList[j]);
							}
						}
						
						next( null, relatedIdsMap );
					});
				},
				function comparer( relatedIdsMap, next ) {
					var relationshipList = relationshipsMap[table];
					if ( !relationshipList ) { 
						next( null, null, null );
						return;}
					for( var j = 0; j < relationshipList.length; ++j ) {
						var field = relationshipList[j].field;
						listForAdd[field] = object[field].slice(0);;
						listFroDel[field] = [];
						console.log('relIds[id]');
						console.log( relIds );
						var relIds = relatedIdsMap[field];
						if ( relIds[ id ] ) {
							for ( var i = 0; i < relIds[id].length; ++i ) {
								var index = object[field].indexOf( relIds[id][i] );
								console.log('index: ' + index);
								if (  index == -1 ) {
									listFroDel[field].push( relIds[id][i] );
								} else {
									listForAdd[field].splice( index, 1 );
								}
							}
						}
						console.log( listFroDel[field] );
						console.log( listForAdd[field] );
					}
					next( null, listFroDel, listForAdd );
				},
				function addRemove( listFroDel, listForAdd, next ) {
					var relationshipList = relationshipsMap[table];
					if ( !relationshipList ) {
						next( null );
						return;
					}
					callList = [];
					var fields = [];
					for( var j = 0; j < relationshipList.length; ++j ) {
						fields.push( { name : relationshipList[j].field,
						               r :  relationshipList[j] });

						callList.push( function( callback ) {
							var fieldObj = fields.pop();
							console.log('field: ');
							console.log( fieldObj );
							console.log('Fields: ');
							console.log( fields );
							async.waterfall([
								function remove ( nextStep ) {
									console.log('remove step');
									if ( listFroDel[fieldObj.name].length > 0 ) {
										loader.pool.query('DELETE FROM ?? WHERE ?? = ? AND ?? IN (?)', [ fieldObj.r.linkingTable, 
								                                                           			 fieldObj.r.parentIdField, 
								                                                           	 		 id, 
								                                                           			 fieldObj.r.childrenIdField, 
								                                                           			 listFroDel[fieldObj.name] ], 
										function( err, result ) {
											if (err) throw err;
											nextStep( null );
										});
									} else {
										nextStep( null );
									}
								},
								function add( nextStep ) {
									console.log('add step');
									console.log('field 2: ');
									console.log( fieldObj );
									if ( listForAdd[fieldObj.name].length > 0 ) {
										var relatedObjects = [];
										for ( var i = 0; i < listForAdd[fieldObj.name].length; ++i ) {
											var obj = {};
											obj[fieldObj.r.parentIdField] = id;
											obj[fieldObj.r.childrenIdField] = listForAdd[fieldObj.name][i];
											relatedObjects.push( obj );
										}
										console.log('query array:');
										var relatedObjectsArr = [];
										for ( var i = 0; i < relatedObjects.length; ++i) {
											var tmpArray = [];
											for ( var fieldName in relatedObjects[i] ) {
												tmpArray.push( relatedObjects[i][fieldName]);
											}
											relatedObjectsArr.push( tmpArray );
										}
										console.log( relatedObjectsArr );
										loader.pool.query('INSERT INTO ?? (??, ??) VALUES ? ', [ fieldObj.r.linkingTable, 
											                                                 fieldObj.r.parentIdField, 
											                                                 fieldObj.r.childrenIdField, 
											                                                 relatedObjectsArr ], 
										function( err, result ) {
											if (err) throw err;
											nextStep( null );
										});
									} else {
										console.log('add else');
										nextStep( null );
									}
								}
							], function( err, result ) {
								callback( null );
							});
						});
					}

					async.waterfall( callList, function ( err ) {
						console.log('final!');
						if (err) throw err;
						next( null );
					});
				},
				function( next ) {
					var objectForUpdate = {};
					for ( var fieldName in object ) {
						console.log('fieldName: ');
						console.log( fieldName );
						console.log( object[fieldName] );
						console.log( object[fieldName].length );
						console.log( !object[fieldName].length );
						if ( !object[fieldName].length ) {
							objectForUpdate[fieldName] = object[fieldName];
						}
					}
					loader.pool.query( updateRequest, [table, objectForUpdate, id], function( err, result ) {
						if (err) throw err;
						next( null );
					});
					
				}
			], function( err, result ) {
				if (err) throw err;
				console.log( object );
				mainCallback( err, object );
			});
	}

	this.deleteObject = function( table, id, callback ) {
		this.pool.query(deleteRequest, [table, id], function( err, result) {
			if ( err ) {
				callback( err );
			} else {
				console.log('result');
				console.log(result);
				callback( err, result );
			}
		});
	}

	this.getVisibleTabs = function ( profileId, callback ) {
		this.pool.query( 'SELECT tabs.id, tabs.name, tabs.link, tabs.label, tabs.view ' +
			              'FROM tabProfileLinks JOIN tabs ' +
			              'WHERE profileId = ? AND tabId = tabs.id', [profileId], function( err, results, fields) {
			if (err) {
				callback( err );
			} else {
				callback( err, results );
			}
		});
	}
}

module.exports = DataLoader;