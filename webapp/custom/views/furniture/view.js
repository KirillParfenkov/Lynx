define([
  'jquery',
  'underscore',
  'backbone',
  'async',
  'events',
  'libs/queue/queue',
  'models/furniture',
  'models/picture',
  'text!custom/templates/furniture/furnitureView.html' 
], function ($, _, Backbone, async, Events, Queue, Furniture, Picture, contentTemplate) {
	var ContentView = Backbone.View.extend({
		el : '.content',
		template : contentTemplate,
		furniture : null,
		render : function ( src, callback ) {
			var view = this;

			if ( src.id != -1 ) {
				view.furniture = new Furniture( {id: src.id} );
				view.furniture.fetch({
					success : function( result ) {
						view.furniture = result;
						var furnitureVar = result.toJSON();
						var picturesForLoad = [];
                  		var picturesForView = [];
                  		var callList = [];
                  		for ( var i = 0; i < furnitureVar.pictures.length; ++i ) {
		                   	var picture = new Picture({id : furnitureVar.pictures[i]});
		                    picturesForLoad.push( picture );
		                    callList.push( function( back ) {
		                    	var picVar = picturesForLoad.pop();
		                    	picVar.fetch({
		                        	success : function( result ) {
		                        		//picturesForView.push( result.toJSON() );
		                        		back( null, result.toJSON() );
		                        	},
		                        	error : function( err ) {
		                          		back( err );
		                        	}
		                    	});
		                	});
		                }
		                async.parallel( callList, function( err, results ) {
		                	if (err) throw err;
		                	$(view.el).html(_.template(contentTemplate, {furniture: furnitureVar, pictures: results}));
		                });	
					},
					error : function() {
						console.log('error!');
					}
				});
			}
		},
	});
	return ContentView;
});