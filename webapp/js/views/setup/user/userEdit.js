define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/user',
  'collections/users',
  'text!templates/setup/user/userEdit.html',
  'text!templates/error.html',
  'less!templates/setup/user/userEdit.less'
], function ($, _, Backbone, Events, Queue, User, Usres, userEditTemplate) {
	var UserEdit = Backbone.View.extend({
		el : '.content',
    initialize: function () {
      this.el = '.content';
    },
    events: {
      'click .user-edit .userSaveButton' : 'save'
    },
    user : null,
    initialize: function () {
    },
		render : function ( src, callback ) {
      var view = this;

      var view = this;
      var systemPermissionSet = src.context.currentProfile.permissionSet.system;
      if ( !this.hasPermission( systemPermissionSet ) ) {
        $(view.el).html(_.template( errorTemplate ));
        return;
      }

      var user = new User( {id: src.id} );
      user.fetch( {
        success: function ( user ) {
          view.user = user;
          $(view.el).html(_.template(userEditTemplate, {user: user.toJSON()}));
        },
        error: function () {
        }
      });
		},

    save : function () {
      var user = this.user;
      user.save({
        email : $('#userEmail').val(),
        firstName : $('#userFirstName').val(),
        lastName : $('#userLastName').val()
      }, 
      {
        success: function (user) {
          window.location.hash = '/setup/usersView';
        }
      });
    },

    hasPermission : function( systemPermissionSet ) {
      if ( systemPermissionSet && systemPermissionSet.allowEditUsers ) {
        if ( systemPermissionSet.allowEditUsers.indexOf('edit') == -1 ) {
          return false;
        }
      } else {
        return false;
      }
      return true;
    }
	});
	return UserEdit;
});