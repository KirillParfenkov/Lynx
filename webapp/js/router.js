// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
	'vm'
], function ($, _, Backbone, Vm) {
  var AppRouter = Backbone.Router.extend({
    viewList : [],
    routes: {
      '/link1' : 'test1',
      '/link2' : 'this'
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
        for ( var i = 0; i < Views.length; i++ ) {
          router.viewList.push( new (Views[i])());
        }
      });
    },

    test1: function() {
      alert('test1');
    },
    test2: function() {
      alert('test2');
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
