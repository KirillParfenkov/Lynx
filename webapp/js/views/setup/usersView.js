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
		el : '.content',
    users : new Usres(),
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
          $(view.el).html(_.template(usersViewTemplate, {users: view.users.toJSON()}));
          if ( callback ) {
            callback();
          }
        }]);
      queue.start();
		},

    hasPermission : function( systemPermissionSet ) {
      if ( systemPermissionSet && systemPermissionSet.allowEditUsers ) {
        if ( systemPermissionSet.allowEditUsers.indexOf('read') == -1 ) {
          return false;
        }
      } else {
        return false;
      }
      return true;
    }
	});
	return UsersView;
});