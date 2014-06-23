// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  paths: {
    // Major libraries
    jquery: 'libs/jquery/jquery-2.1.1',
    underscore: 'libs/underscore/underscore', // https://github.com/amdjs
    backbone: 'libs/backbone/backbone', // https://github.com/amdjs
    sinon: 'libs/sinon/sinon.js',

    // Require.js plugins
    text: 'libs/require/text',
    order: 'libs/require/order',

    // Just a short cut so we can put our html outside the js dir
    // When you have HTML/CSS designers this aids in keeping them out of the js directory
    templates: '../templates',
    custom: '../custom'
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
  'libs/queue/queue'
], function($, AppView, Router, Vm, User, Queue){
  var appView;
  var tab;
  var queue = new Queue([
    function(queue) {
       tabs = [{ name : 'home', 
                label : 'Home', 
                link: '#/tab/home', 
                view: 'custom/views/home.js'},
              { name : 'test1', 
                label : 'Test 1', 
                link: '#/tab/test1',
                view: 'custom/views/view1.js'}];
      queue.next();
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
