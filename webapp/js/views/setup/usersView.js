define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/user',
  'collections/users',
  'text!templates/setup/usersView.html' 
], function ($, _, Backbone, Events, Queue, User, Usres, usersViewTemplate) {
	var UsersView = Backbone.View.extend({
		elem : '.content',
    users : null,
    initialize: function () {
      this.users = new Usres();
    },
		render : function ( src, callback ) {
			var view = this;
      var queue = new Queue([
        function(queue) {
          if ( view.users ) {
            view.users = new Usres();
            view.users.fetch({
              success : function () {
                queue.next();
              },
              error : function() {
                console.log('error!');
                queue.next();
              }
            });
          }
        },
        function(queue) {
          $(view.elem).html(_.template(usersViewTemplate, {users: view.users.toJSON()}));
          if ( callback ) {
            callback();
          }
        }]);
      queue.start();
		}
	});
	return UsersView;
});