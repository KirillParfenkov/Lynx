define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'async',
  'collections/geoobjects',
  'text!custom/templates/geoobject/list.html'
], function ($, _, Backbone, Events, Async, Geoobjects, contentTemplate) {
	var ContentView = Backbone.View.extend({
		el : '.content',
		template : contentTemplate,
		render : function ( src, callback ) {
			var view = this;
			view.geoobjects = new Geoobjects();
			view.geoobjects.fetch({
				success : function( result ) {
					var geoobjectsVar = result.toJSON();
					$(view.el).html(_.template(contentTemplate, { geoobjects: geoobjectsVar }));
				},
				error : function( err ) {
					console.log( err );
				}
			});
		}
	});
	return ContentView;
});