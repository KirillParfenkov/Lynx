define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/session',
  'models/profile',
  'collections/tabs',
  'text!templates/setup/profile/profileView.html'
], function ($, _, Backbone, Events, Queue, Session, Profile, Tabs, profileViewTemplate) {
  var ProfileView = Backbone.View.extend({
    el : '.content',
    profile : null,
    render : function ( src, callback ) {
      var view = this;
      var profile = new Profile( {id: src.id} );
      var tabs = new Tabs();
      var tabList = [];
      var queue = new Queue([
        function ( queue ) {
          profile.fetch( {
            success: function ( profile ) {
              console.log('2:');
              console.log( profile.toJSON() );
              queue.next();
            },
            error: function () {
              queue.next();
            }
          });
        },
        function ( queue ) {
          tabs.fetch({
            success: function ( tabs ) {
              var prof = profile.toJSON();
              _.each(tabs.toJSON(), function(tab) {
                if ( typeof (_.find( prof.tabs, function( profTab ) {
                  return (profTab == tab.id);
                })) != 'undefined') {
                  tabList.push({ id : tab.id, label: tab.label, visible: true});
                } else {
                  tabList.push({ id : tab.id, label: tab.label, visible: false});
                }
              }); 
              queue.next();
            },
            error: function () {
              queue.next();
            }
          });
        },
        function ( queue ) {
          $(view.el).html(_.template(profileViewTemplate, {profile: profile.toJSON(), tabList: tabList}));
        }
      ]);
      queue.start();
    }
  });
  return ProfileView;
});