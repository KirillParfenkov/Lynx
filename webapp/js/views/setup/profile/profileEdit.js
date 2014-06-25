define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/profile',
  'collections/tabs',
  'text!templates/setup/profile/profileEdit.html'
], function ($, _, Backbone, Events, Queue, Profile, Tabs, profileEditTemplate) {
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
        this.renderEditProfile( src, callback );
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
    },

    renderEditProfile : function( src, callback ) {
      var view = this;
      var profile = new Profile( {id: src.id} );
      var tabs = new Tabs();
      var tabList = [];
      var queue = new Queue ([
        function ( queue ) {
          profile.fetch( {
            success: function ( tab ) {
              view.profile = profile;
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
                  tabList.push({ id : tab.id, name: tab.name, label: tab.label, visible: true});
                } else {
                  tabList.push({ id : tab.id, name: tab.name, label: tab.label, visible: false});
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
          $(view.el).html(_.template(profileEditTemplate, {profile: profile.toJSON(),  tabList: tabList} ));
        }
      ]);

      queue.start();
    },

    save : function () {
      var profile = this.profile;
      var tabs = [];
      $('input:checkbox[name=tabs]:checked').each(function( ) {
        tabs.push($(this).val());
      });
      profile.save({
        tabs : tabs
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