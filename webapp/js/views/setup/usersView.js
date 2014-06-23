define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/session',
  'models/user',
  'text!templates/setup/usersView.html' 
], function ($, _, Backbone, Events, Queue, Session, User, usersViewTemplate) {
	var UsersView = Backbone.View.extend({
		elem : '.content',
    initialize: function () {
      //this.el = '.sideBar';
    },
		render : function ( src, callback ) {
			var view = this;
      $(view.elem).html(_.template(usersViewTemplate), {});
		}
	});
	return UsersView;
});