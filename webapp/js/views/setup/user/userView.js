define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/session',
  'models/user',
  'collections/users',
  'text!templates/setup/user/userView.html'
], function ($, _, Backbone, Events, Queue, Session, User, Usres, userViewTemplate) {
	var UserView = Backbone.View.extend({
		el : '.content',
    user : null,
    initialize: function () {
      this.users = new Usres();
    },
		render : function ( src, callback ) {
      var view = this;
      var user = new User( {id: src.id} );
      user.fetch( {
        success: function ( user ) {
          $(view.el).html(_.template(userViewTemplate, {user: user.toJSON()}));
        },
        error: function () {
          console.log('error!');
        }
      });
		}
	});
	return UserView;
});