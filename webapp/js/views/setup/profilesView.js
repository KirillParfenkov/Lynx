define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/profile',
  'collections/profiles',
  'text!templates/setup/profilesView.html'
], function ($, _, Backbone, Events, Queue, Profile, Profiles, profilesViewTemplate) {
	var ProfilesView = Backbone.View.extend({
		render : function ( src, callback ) {
            var view = this;
            var profiles = null;
            var queue = new Queue([
            function(queue) {
                profiles = new Profiles();
                profiles.fetch({
                    success : function () {
                        queue.next();
                    },
                    error : function() {
                        console.log('error!');
                        queue.next();
                    }
                });
            },
            function(queue) {
                console.log( profiles.toJSON() );
                $(view.el).html(_.template(profilesViewTemplate, {profiles: profiles.toJSON()}));
                if ( callback ) {
                    callback();
                }
            }]);
            queue.start();
		},

        hasPermission : function( systemPermissionSet ) {
            if ( systemPermissionSet && systemPermissionSet.allowEditProfile ) {
                if ( systemPermissionSet.allowEditProfile.indexOf('read') == -1 ) {
                    return false;
                }
            } else {
                return false;
            }
            return true;
        }
	});
	return ProfilesView;
});