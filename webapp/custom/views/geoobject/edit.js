define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'async',
  'models/geoobject',
  'text!custom/templates/geoobject/edit.html'
], function ($, _, Backbone, Events, Async, Geoobject, contentTemplate) {
	var ContentView = Backbone.View.extend({
		el : '.content',
		template : contentTemplate,
		render : function ( src, callback ) {
			var view = this;
			if ( src.id != -1 ) {
				var geoobject = new Geoobject({ id: src.id });
				geoobject.fetch({
					success: function ( result ) {
						var geoobjectVar = result.toJSON();
						$(view.el).html(_.template(contentTemplate, { geoobject : geoobjectVar }));	
					},
					error : function ( err ) {
						console.log( err );
					}
				});
			} else {
				$(view.el).html(_.template(contentTemplate, { geoobject : {} }));	
			}
		}
	});
	return ContentView;
});