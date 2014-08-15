define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/user',
  'text!templates/setup/setupMenu.html' 
], function ($, _, Backbone, Events, Queue, User, sideBarTemplate) {
	var SetupSideBarView = Backbone.View.extend({
		el : '.header-menu-container',
		render : function ( src, callback ) {
			var view = this;
      $(view.el).html(_.template(sideBarTemplate), {});
		}
	});
	return SetupSideBarView;
});