define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/profile',
  'text!templates/setup/profile/profileEdit.html'
], function ($, _, Backbone, Events, Queue, Profile, profileEditTemplate) {
	var ProfileView = Backbone.View.extend({
		el : '.content',
    events: {
      'click .profileSaveButton' : 'save'
    },
    profile : null,
		render : function ( src, callback ) {
      var view = this;
      var profile;
      if ( src.id != -1) {
        profile = new Profile( {id: src.id} );
        profile.fetch( {
          success: function ( tab ) {
            view.profile = profile;
            $(view.el).html(_.template(profileEditTemplate, {profile: profile.toJSON()}));
          },
          error: function () {
          }
        });
      } else {
        view.profile = new Profile();
        $(view.el).html(_.template(profileEditTemplate, {profile: view.profile.toJSON()}));
      }
		},

    save : function () {
      var profile = this.profile;
      profile.save({  
      }, 
      {
        success: function (tab) {
          window.location.hash = '/setup/profilesView';
        }
      });
    }
	});
	return ProfileView;
});