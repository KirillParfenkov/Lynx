define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/user',
  'collections/users',
  'text!templates/setup/user/userAdd.html',
  'less!templates/setup/user/userAdd.less'
], function ($, _, Backbone, Events, Queue, User, Usres, template) {
	var UserAdd = Backbone.View.extend({
		el : '.content',
    events: {
      'click .userSaveButton' : 'save'
    },
    user : null,

		render : function ( src, callback ) {
      var view = this;
      var user = new User();
      $(view.el).html(_.template(template, {user: user.toJSON()}));
		},
	});
	return UserAdd;
});