define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/tab',
  'collections/tabs',
  'text!templates/setup/tabsView.html' 
], function ($, _, Backbone, Events, Queue, Tab, Tabs, tabsViewTemplate) {
	var TabsView = Backbone.View.extend({
		el : '.content',    
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
          $(view.el).html(_.template(tabsViewTemplate, {tabs: tabs.toJSON()}));
          if ( callback ) {
            callback();
          }
        }]);
      queue.start();
		},

    hasPermission : function( systemPermissionSet ) {
      if ( systemPermissionSet && systemPermissionSet.allowEditTabs ) {
        if ( systemPermissionSet.allowEditTabs.indexOf('read') == -1 ) {
          return false;
        }
      } else {
        return false;
      }
      return true;
    }
	});
	return TabsView;
});