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
		elem : '.content',
    initialize: function () {
      //this.el = '.sideBar';
    },
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
          $(view.elem).html(_.template(profilesViewTemplate, {profiles: profiles.toJSON()}));
          if ( callback ) {
            callback();
          }
        }]);
      queue.start();
		}
	});
	return ProfilesView;
});