define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/session',
  'models/user',
  'text!templates/setup/setupSideBar.html' 
], function ($, _, Backbone, Events, Queue, Session, User, sideBarTemplate) {
	var SetupSideBarView = Backbone.View.extend({
		elem : '.sideBar',
    initialize: function () {
      //this.el = '.sideBar';
    },
		render : function ( src, callback ) {
			var view = this;
      $(view.elem).html(_.template(sideBarTemplate), {});
		}
	});
	return SetupSideBarView;
});