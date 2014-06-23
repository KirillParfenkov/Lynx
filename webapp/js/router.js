// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
	'vm'
], function ($, _, Backbone, Vm) {
  var AppRouter = Backbone.Router.extend({
    viewList : [],
    tabViewMap : {},
    routes: {
      'tab/:tabName' : 'selectTab'
    },

    initialize : function (options) {
      var router = this;
      var tabs = options.tabs;
      var views =[];
      for ( var i = 0; i < tabs.length; i++) {
        views.push( tabs[i].view );
      }

      require( views , function() {
        console.log('views');
        console.log(arguments);

        var Views = arguments;
        var view;
        for ( var i = 0; i < Views.length; i++ ) {
          view = new (Views[i])();
          router.viewList.push( view );
          router.tabViewMap[tabs[i].name] = view;
        }
      });
    },

    selectTab: function( tabName ) {
      this.tabViewMap[tabName].render();
    }
  }); 

  var initialize = function(options){
		var appView = options.appView;
    var router = new AppRouter(options);    
  };
  return {
    initialize: initialize
  };
});
