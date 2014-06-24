define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/session',
  'models/tab',
  'text!templates/setup/tab/tabView.html'
], function ($, _, Backbone, Events, Queue, Session, Tab, tabViewTemplate) {
  var TabView = Backbone.View.extend({
    el : '.content',
    tab : null,
    render : function ( src, callback ) {
      var view = this;
      var tab = new Tab( {id: src.id} );
      tab.fetch( {
        success: function ( tab ) {
          $(view.el).html(_.template(tabViewTemplate, {tab: tab.toJSON()}));
        },
        error: function () {
        }
      });
    }
  });
  return TabView;
});