// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
	'vm',
  'views/setup/setupSideBar',
  'views/setup/usersView',
  'views/setup/profilesView',
  'views/setup/tabsView',
  'views/setup/user/userEdit',
  'views/setup/user/userView'
], function ($, _, Backbone, Vm, SetupSideBar, UsersView, ProfilesView, TabsView, UserEdit, UserView) {
  var AppRouter = Backbone.Router.extend({
    viewList : [],
    tabViewMap : {},
    sideBar : {},
    setupViews : [],
    routes: {
      'tab/:tabName' : 'selectTab',
      'setup' : 'selectSetup',
      'setup/:itemName' : 'selectSetupView',
      'setup/:itemName/:id' : 'selectSetupViewItem'
    },

    initialize : function (options, callback) {
      var router = this;
      var tabs = options.tabs;
      var views =[];
      for ( var i = 0; i < tabs.length; i++) {
        views.push( tabs[i].view );
      }

      router.sideBar = new SetupSideBar();
      this.setupViews['usersView'] = new UsersView();
      this.setupViews['profilesView'] = new ProfilesView();
      this.setupViews['tabsView'] = new TabsView();
      this.setupViews['userEdit'] = new UserEdit();
      this.setupViews['userView'] = new UserView();

      require( views , function() {
        var Views = arguments;
        var view;
        for ( var i = 0; i < Views.length; i++ ) {
          view = new (Views[i])();
          router.viewList.push( view );
          router.tabViewMap[tabs[i].name] = view;
        }
        if ( callback ) {
          callback();
        }
      });
    },

    selectTab: function( tabName ) {
      this.clearSetupSideBar();
      this.tabViewMap[tabName].render();
    },

    selectSetup: function() {
      this.sideBar.render();
    },

    selectSetupView: function( view ) {
      this.setupViews[view].render();
    },

    selectSetupViewItem: function( view, id) {
      this.setupViews[view].render( {id: id} );
    },

    clearSetupSideBar: function() {
      $('.sideBar').html('');
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
