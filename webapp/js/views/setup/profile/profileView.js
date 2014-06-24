define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/session',
  'models/profile',
  'text!templates/setup/profile/profileView.html'
], function ($, _, Backbone, Events, Queue, Session, Profile, profileViewTemplate) {
  var ProfileView = Backbone.View.extend({
    el : '.content',
    profile : null,
    render : function ( src, callback ) {
      var view = this;
      var profile = new Profile( {id: src.id} );
      profile.fetch( {
        success: function ( profile ) {
          $(view.el).html(_.template(profileViewTemplate, {profile: profile.toJSON()}));
        },
        error: function () {
        }
      });
    }
  });
  return ProfileView;
});