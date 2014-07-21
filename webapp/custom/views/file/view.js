define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'async',
  'models/file',
  'collections/types',
  'text!custom/templates/file/fileView.html',
], function ($, _, Backbone, Events, Async, File, Types, contentTemplate) {
	var FileView = Backbone.View.extend({
		el : '.content',
		ui : {},
		template : contentTemplate,
		typeMap : null,

		initialize : function( src ) {
			this.el = src.el;
		},

		render : function ( src, callback ) {

			var view = this;
			var file = new File({id : src.id});

			Async.parallel([
				function loadTypes( finish ) {
					if ( view.typeMap ) {
						finish( null );
					} else {
						var types = new Types();
						types.fetch( {
							success : function( result ) {
								var typesVar = result.toJSON();
								view.typeMap = {};
								for ( var i = 0; i < typesVar.length; i++ ) {
									view.typeMap[typesVar[i].id] = typesVar[i];
								}

								finish( null );
							},
							error : function( err ){
								finish( err );
							}
						});
					}
				},
				function loadFile( finish ) {
					file.fetch({
						success : function( result ) {
							finish( null );
							
						},
						error : function( err ) {
							finish( err );
						}
					});
				}
			], function( err, result ) {
				if ( err ) throw err;
				$(view.el).html(_.template(contentTemplate, { file : file.toJSON(), types : view.typeMap }));
				if ( callback ) callback();
 			});
		}
	});
	return FileView;
});