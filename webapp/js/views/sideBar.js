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
	var SideBarView = Backbone.View.extend({
		el : '.sideBar',
		render : function ( src, template, callback ) {
			var view = this;
		}
	});
	return SideBarView;
});