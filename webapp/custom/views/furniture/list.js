define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/furniture',
  'collections/furnitures',
  'text!custom/templates/furniture/furnitureList.html',
], function ($, _, Backbone, Events, Queue, Furniture, Furnitures, contentTemplate) {
	var ContentView = Backbone.View.extend({
		el : '.content',
		template : contentTemplate,
		render : function ( src, callback ) {
			var view = this;
			furnitures = new Furnitures();

			var queue = new Queue([
				function(queue) {
					furnitures.fetch({
						success : function () {
							queue.next();
						},
						error : function () {
							queue.next();
						}
					});
				},
				function(queue) {
					$(view.el).html(_.template(contentTemplate, { furnitures: furnitures.toJSON()}));
				}
			]);
			queue.start();
		}

	});
	return ContentView;
});