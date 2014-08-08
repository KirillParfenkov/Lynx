define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/session',
  'models/user',
  'text!templates/setup/setupMenu.html' 
], function ($, _, Backbone, Events, Queue, Session, User, sideBarTemplate) {
	var SetupSideBarView = Backbone.View.extend({
		el : '.header-menu-container',
		render : function ( src, callback ) {
			var view = this;
      $(view.el).html(_.template(sideBarTemplate), {});
		}
	});
	return SetupSideBarView;
});