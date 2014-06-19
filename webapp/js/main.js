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
    templates: '../templates'
  },
	urlArgs: "bust=" +  (new Date()).getTime()

});

// Let's kick off the application

require([
  'jquery',
  'views/app',
  'router',
  'vm',
  'models/user'
], function($, AppView, Router, Vm, User){
  var appView = Vm.create({}, 'AppView', AppView);
  Router.initialize({appView: appView});
  appView.render();
  Backbone.history.start();
    var user = new User({ id: 4 });
    //var userDetail = { id: 1 };
    /*user.save({
      success: function ( user ) {
        console.log(user.toJSON());
      } 
    });*/
    /*user.fetch({
      success : function ( user ) {
        console.log(user.toJSON());
      },
      faile: function () {
        console.log('faile');
      }
    });*/

    user.destroy({
      success : function ( result ) {
        console.log( result.toJSON );
      }
    });
});
