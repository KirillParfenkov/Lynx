define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/session',
  'models/user',
  'collections/users',
  'text!templates/setup/user/userEdit.html'
], function ($, _, Backbone, Events, Queue, Session, User, Usres, userEditTemplate) {
	var UserEdit = Backbone.View.extend({
		el : '.content',
    events: {
      'click .userSaveButton' : 'save'
    },
    user : null,
    initialize: function () {
    },
		render : function ( src, callback ) {
      var view = this;
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
    }
	});
	return UserEdit;
});