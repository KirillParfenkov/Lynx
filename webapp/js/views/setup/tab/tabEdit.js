define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/tab',
  'text!templates/setup/tab/tabEdit.html'
], function ($, _, Backbone, Events, Queue, Tab, tabEditTemplate) {
	var TabView = Backbone.View.extend({
		el : '.content',
    events: {
      'click .tabSaveButton' : 'save'
    },
    tab : null,
		render : function ( src, callback ) {
      var view = this;
      var tab;
      if ( src.id != -1) {
        tab = new Tab( {id: src.id} );
        tab.fetch( {
          success: function ( tab ) {
            view.tab = tab;
            $(view.el).html(_.template(tabEditTemplate, {tab: tab.toJSON()}));
          },
          error: function () {
          }
        });
      } else {
        view.tab = new Tab();
        $(view.el).html(_.template(tabEditTemplate, {tab: view.tab.toJSON()}));
      }
		},

    save : function () {
      var tab = this.tab;
      tab.save({  
        name : $('#tabName').val(),
        label : $('#tabLabel').val(),
        link : $('#tabLink').val(),
        view : $('#tabView').val()
      }, 
      {
        success: function (tab) {
          window.location.hash = '/setup/tabsView';
        }
      });
    },

    hasPermission : function( systemPermissionSet ) {
      if ( systemPermissionSet && systemPermissionSet.allowEditTabs ) {
        if ( systemPermissionSet.allowEditTabs.indexOf('edit') == -1 ) {
          return false;
        }
      } else {
        return false;
      }
      return true;
    }
	});
	return TabView;
});