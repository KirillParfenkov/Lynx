define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/session',
  'models/user',
  'text!templates/layout.html' 
], function ($, _, Backbone, Events, Queue, Session, User, contentTemplate) {
	var ContentView = Backbone.View.extend({
		el : '.content',
		render : function ( src, template, callback ) {
			var view = this;
			
		}
	});
	return ContentView;
});