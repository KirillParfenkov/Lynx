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
	var UsersView = Backbone.View.extend({
		el : '.content',
    events: {
      'click .saveButton' : 'save'
    },
    user : null,
    initialize: function () {
      this.users = new Usres();
    },
		render : function ( src, callback ) {
      var view = this;
      var user = new User( {id: src.id} );
      console.log(this.el);
      console.log( $('.content'));
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
          console.log(user.toJSON());
          window.location.hash = '/setup/usersView';
        }
      });
    }
	});
	return UsersView;
});