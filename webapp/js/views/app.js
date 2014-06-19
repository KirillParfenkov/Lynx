define([
  'jquery',
  'underscore',
  'backbone',
  'vm',
	'events',
  'models/session',
  'models/user',
  'text!templates/layout.html' 
], function($, _, Backbone, Vm, Events, Session, User, layoutTemplate){
  var AppView = Backbone.View.extend({
    el: '.container',
    initialize: function () {
      
    },
    render: function () {
			var that = this;
      $(this.el).html(layoutTemplate);
		} 
	});
  return AppView;
});
