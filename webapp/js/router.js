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
  'views/setup/profile/profileEdit',
  'views/setup/profile/profileView'
], function ($, _, Backbone, Async, viewLoader, context, SetupMenu, UsersView, ProfilesView, TabsView, UserEdit, UserView, UserAdd, TabEdit, TabView, ProfileEdit, ProfileView) {
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

          doneSetuoViews( null, router.setupViews );
        },

        context : function( doneLoadContext ) {

          Async.parallel( {

            currentUser : function( done ) {
              context.getCurrentUser( function( err, user ) {
                if ( err ) done( err );
                done( null, user );
              });
            },

            currentProfile : function( done ) {
              context.getCurrentProfile( function( err, profile ) {
                if ( err ) done( err );
                done( null, profile );
              });
            }

          }, function( err, results ) {

            if ( err ) done( err );

            doneLoadContext( null, {
              currentUser    : results.currentUser,
              currentProfile : results.currentProfile,
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
      this.setupMenu.render();
    },

    selectSetupItem: function( view ) {
      this.setupViews[view].render( { context: this.context } );
      this.clearHeaderMenu();
    },

    selectSetupItemWithId: function( view, id) {
      this.setupViews[view].render( {id: id, context: this.context} );
    },

    clearHeaderMenu: function() {
      $('.header-menu-container').html('');
    },

    selectView: function( name, id ) {
      var router = this;
      viewLoader.load( name, function( view ) {
        var src = { context: router.context };
        if ( id ) {
          src.id = id;
        }
        view.render( src );
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
