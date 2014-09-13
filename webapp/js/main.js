// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  paths: {
    // Major libraries
    jquery: 'libs/jquery/jquery-2.1.1',
    underscore: 'libs/underscore/underscore', // https://github.com/amdjs
    backbone: 'libs/backbone/backbone', // https://github.com/amdjs
    async: 'libs/async/async',
    webix: 'libs/webix/webix',

    // Require.js plugins
    text: 'libs/require/text',
    css: 'libs/require/css',
    less: 'libs/require/require-less/less',
    lessc: 'libs/require/require-less/lessc',
    normalize : 'libs/require/require-less/normalize',
    order: 'libs/require/order',

    // Just a short cut so we can put our html outside the js dir
    // When you have HTML/CSS designers this aids in keeping them out of the js directory
    templates: '../templates',
    custom: '../custom',
    system: './moduls/system',
    messager: './moduls/messager/messager'
  },
  map : {
    '*': {
      'less': 'libs/require/require-less' // path to less
    }
  },
	urlArgs: "bust=" +  (new Date()).getTime()

});

// Let's kick off the application

require([
  'jquery',
  'views/app',
  'router',
  'vm',
  'models/user',
  'libs/queue/queue',
  'libs/webix/webix',
  'collections/visibleTabs'
], function($, AppView, Router, Vm, User, Queue, Webix, VisibleTabs){
  var appView;
  var tab;
  var queue = new Queue([
    function(queue) {
      tabs = new VisibleTabs();
      tabs.fetch({
        success : function() {
          tabs = tabs.toJSON();
          queue.next();
        }
      });
    },
    function(queue) {
      appView = new AppView();
      appView.render(tabs);
      queue.next();
    },
    function(queue) {
      Router.initialize({appView: appView, tabs: tabs},
        function() {
          queue.next();
        });
    },
    function(queue) {
      Backbone.history.start();
    }]);
  queue.start();
});