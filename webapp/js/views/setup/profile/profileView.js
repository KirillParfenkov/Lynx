define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'async',
  'moduls/context',
  'models/profile',
  'models/permissionSet',
  'collections/tabs',
  'text!templates/setup/profile/profileView.html'
], function ($, _, Backbone, Events, Queue, Async, Context, Profile, PermissionSet, Tabs, profileViewTemplate) {
  var ProfileView = Backbone.View.extend({

    el : '.content',
    profile : null,

    render : function ( src, callback ) {

      var view = this;
      var profile = new Profile( {id: src.id} );

      Async.waterfall([
        function loadProfile ( doneLoadProfile ) {
          profile.fetch( {
            success: function ( profile ) {
              doneLoadProfile( null, profile.toJSON() );
            },
            error: function ( err ) {
              doneLoadProfile( err );
            }
          });
        },
        function loadPermissionData ( profile, doneLoadData ) {

          Async.parallel({

            tabList : function ( done ) {

              var tabs = new Tabs();
              var tabList = [];

              tabs.fetch({
                success: function ( tabs ) {
                  _.each(tabs.toJSON(), function(tab) {
                    if ( typeof (_.find( profile.tabs, function( profTab ) {
                      return (profTab == tab.id);
                    })) != 'undefined') {
                      tabList.push({ id : tab.id, label: tab.label, visible: true});
                    } else {
                      tabList.push({ id : tab.id, label: tab.label, visible: false});
                    }
                  }); 
                  done( null, tabList );
                },
                error: function ( err ) {
                  done( err );
                }
              });
            },

            permissionSet : function ( done ) {

              var permissionSet = new PermissionSet({ id : profile.id });
              permissionSet.fetch({
                success : function ( permissionSet ) {
                  done( null, permissionSet.toJSON() );
                },
                error : function ( err ) {
                  done( err );
                }
              });
            }

          }, function( err, results ) {

            if ( err ) doneLoadData( err );

            doneLoadData( null, { 
              tabList : results.tabList,
              permissionSet : results.permissionSet
            });

          });
        }
      ], function( err, result ) {
        if ( err ) throw err;
        $(view.el).html(_.template( profileViewTemplate, {
          profile : profile.toJSON(), 
          tabList : result.tabList, 
          permissionSet : result.permissionSet
        }));
      });
    }
  });
  return ProfileView;
});