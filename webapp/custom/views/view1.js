define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'text!custom/templates/template1.html' 
], function ($, _, Backbone, Events, Queue, contentTemplate) {
	var ContentView = Backbone.View.extend({
		elem : '.content',
		template : contentTemplate,
		render : function ( src, callback ) {
			var view = this;
			$(this.elem).html(_.template(contentTemplate));
		}
	});
	return ContentView;
});