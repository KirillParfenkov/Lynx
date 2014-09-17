// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
	'async',
  'moduls/view-loader',
  'moduls/context',
  'views/setup/setupMenu',
  'views/setup/usersView',
  'views/setup/profilesView',
  'views/setup/tabsView',
  'views/setup/user/userEdit',
  'views/setup/user/userView',
  'views/setup/user/userAdd',
  'views/setup/tab/tabEdit',
  'views/setup/tab/tabView',
  'views/setup/globalVariables/globalVariablesView',
  'views/setup/globalVariables/globalVariablesEdit',
  'views/setup/profile/profileEdit',
  'views/setup/profile/profileView',
  'views/setup/self/view/view',
  'text!templates/error.html',
], function ($, _, Backbone, Async, viewLoader, context, SetupMenu, UsersView, ProfilesView, 
             TabsView, UserEdit, UserView, UserAdd, TabEdit, TabView, GlobalVariablesView, 
             GlobalVariablesEdit, ProfileEdit, ProfileView, SelfView, errorTemplate) {
  var AppRouter = Backbone.Router.extend({
    viewList : [],
    tabViewMap : {},
    setupMenu : {},
    setupViews : [],
    context : {},
    routes: {
      'tab/:tabName' : 'selectTab',
      'setup' : 'selectSetup',
      'setup/:itemName' : 'selectSetupItem',
      'setup/:itemName/:id' : 'selectSetupItemWithId',
      'view/:name' : 'selectView',
      'view/:name/:id' : 'selectView'
    },

    initialize : function (options, doneInit) {
      var router = this;
      var tabs = options.tabs;
      this.appView = options.appView;
      var views =[];
      for ( var i = 0; i < tabs.length; i++) {
        views.push( tabs[i].view );
      }

      Async.parallel({

        setupViews : function( doneSetuoViews ) {

          router.setupMenu = new SetupMenu();
          router.setupViews['usersView'] = new UsersView();
          router.setupViews['profilesView'] = new ProfilesView();
          router.setupViews['tabsView'] = new TabsView();
          router.setupViews['userEdit'] = new UserEdit();
          router.setupViews['userView'] = new UserView();
          router.setupViews['userAdd'] = new UserAdd();
          router.setupViews['tabEdit'] = new TabEdit();
          router.setupViews['tabView'] = new TabView();
          router.setupViews['profileEdit'] = new ProfileEdit();
          router.setupViews['profileView'] = new ProfileView();
          router.setupViews['globalVariablesEdit'] = new GlobalVariablesEdit();
          router.setupViews['globalVariablesView'] = new GlobalVariablesView();
          router.setupViews['selfView'] = new SelfView();

          doneSetuoViews( null, router.setupViews );
        },

        context : function( doneLoadContext ) {

          Async.parallel( {

            currentUser : function( done ) {
              context.getCurrentUser( function( err, user ) {
                if ( err ) {
                  done( err );
                } else {
                  done( null, user );
                }
              });
            },

            currentProfile : function( done ) {
              context.getCurrentProfile( function( err, profile ) {
                if ( err ) {
                  done( err );
                } else {
                  done( null, profile );
                }
              });
            },

            globalVariables : function( done ) {
              context.getGlobalVeriables( function( err, globalVariables) {
                console.log('inside: ');
                console.log( globalVariables );
                if ( err ) {
                  done( err );
                } else {
                  done( null, globalVariables );
                }
              });
            }

          }, function( err, results ) {

            if ( err ) {
              console.log( err ); 
              return;
            }

            console.log('Setup Views:');
            for( var index in router.setupViews ) {
                router.setupViews[index].setElement('.content');
            }
            router.setupMenu.setElement('.header-menu-container');

            doneLoadContext( null, {
              currentUser    : results.currentUser,
              currentProfile : results.currentProfile,
              globalVariables : results.globalVariables
            });
          });
        }

      }, function( err, results ) {
        console.log( err );
        router.context = results.context;
        doneInit( err );
      });
    },

    selectSetup: function() {
      var view = this;
      var context = this.context;
      var i18nVar = $.grep(context.globalVariables, function( e ) { return e.name == 'i18n'; })[0];
      view.setupMenu.loadI18n( i18nVar.value, function( err ) {
        view.setupMenu.render( { context: context } );
      });
    },

    selectSetupItem: function( view ) {
      
      var router = this;
      var context = this.context;

      var handler = function() {
        var i18nVar = $.grep(context.globalVariables, function( e ) { return e.name == 'i18n'; })[0];
        if ( router.setupViews[view].loadI18n ) {
          router.setupViews[view].loadI18n( i18nVar.value, function( err ) {
            router.setupViews[view].render( { context: context } );
            router.appView.cleanSelectTab();
          });
        } else {
          router.setupViews[view].render( { context: context } );
          router.appView.cleanSelectTab();
        }
      };


      if ( this.setupViews[view].hasPermission ) {
        var systemPermissionSet = this.context.currentProfile.permissionSet.system;
        if ( this.setupViews[view].hasPermission( systemPermissionSet ) ) {
          handler();
        } else {
          $(this.setupViews[view].el).html(_.template( errorTemplate ));
        }
      } else {
        handler();
      }
      this.clearHeaderMenu();
    },

    selectSetupItemWithId: function( view, id ) {
      if ( this.setupViews[view].hasPermission ) {
        var systemPermissionSet = this.context.currentProfile.permissionSet.system;
        if ( this.setupViews[view].hasPermission( systemPermissionSet ) ) {
          this.setupViews[view].render( {id: id, context: this.context} );
        } else {
          $(this.setupViews[view].el).html(_.template( errorTemplate ));
        }
      } else {
        this.setupViews[view].render( {id: id, context: this.context} );
      }
    },

    clearHeaderMenu: function() {
      $('.header-menu-container').html('');
    },

    selectView: function( name, id ) {
      var router = this;
      viewLoader.load( name, function( view ) {

        var src = { context: router.context, id: id };

        if ( view.hasPermission ) {
          var systemPermissionSet = this.context.currentProfile.permissionSet.system;
          if ( this.setupViews[view].hasPermission( systemPermissionSet ) ) {
            view.render( {id: id, context: this.context} );
          } else {
            $(view.el).html(_.template( errorTemplate ));
          }
        } else {
          view.render( {id: id, context: this.context} );
        }
      });
    }
  }); 

  var initialize = function(options, callback){
		var appView = options.appView;
    var router = new AppRouter(options, callback);    
  };
  return {
    initialize: initialize
  };
});
