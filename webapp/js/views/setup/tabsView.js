define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/session',
  'models/tab',
  'collections/tabs',
  'text!templates/setup/tabsView.html' 
], function ($, _, Backbone, Events, Queue, Session, Tab, Tabs, tabsViewTemplate) {
	var TabsView = Backbone.View.extend({
		elem : '.content',
    initialize: function () {
      //this.el = '.sideBar';
    },
		render : function ( src, callback ) {
      var view = this;
      var tabs = null;
      var queue = new Queue([
        function(queue) {
            tabs = new Tabs();
            tabs.fetch({
              success : function () {
                queue.next();
              },
              error : function() {
                console.log('error!');
                queue.next();
              }
            });
        },
        function(queue) {
          $(view.elem).html(_.template(tabsViewTemplate, {tabs: tabs.toJSON()}));
          if ( callback ) {
            callback();
          }
        }]);
      queue.start();
		}
	});
	return TabsView;
});