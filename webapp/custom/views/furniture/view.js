define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/furniture',
  'text!custom/templates/furniture/furnitureView.html' 
], function ($, _, Backbone, Events, Queue, Furniture, contentTemplate) {
	var ContentView = Backbone.View.extend({
		el : '.content',
		template : contentTemplate,
		render : function ( src, callback ) {
			var view = this;
			var furniture = new Furniture( {id: src.id} );
			furniture.fetch({
				success : function() {
					$(view.el).html(_.template(contentTemplate, {furniture: furniture.toJSON()}));
				},
				error : function() {
					console.log('error!');
				}
			});
		},
	});
	return ContentView;
});