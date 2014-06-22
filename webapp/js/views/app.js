define([
  'jquery',
  'underscore',
  'backbone',
  'vm',
	'events',
  'libs/queue/queue',
  'models/session',
  'models/user',
  'text!templates/layout.html' 
], function($, _, Backbone, Vm, Events, Queue, Session, User, layoutTemplate){
  var AppView = Backbone.View.extend({
    el: '.container',
    template: layoutTemplate,
    tabs : [],
    initialize: function () {
      //var that = this;
      this.tabs = [{ name : 'home', label : 'Home', link: '#/link1'},
            { name : 'test1', label : 'Test 1', link: '#/link2' },
            { name : 'test2', label : 'Test 2', link: '#/link3'}];
      this.on('loadData', function(){
        this.renderWithData();
      });
      this.on('render', function() {
        this.loadData();
      });
    },
    render: function () {
      var queue = new Queue([
        function(queue) {
          console.log('f1!');
          queue.next();
        },
        function(queue) {
          console.log('f2!');
        }]);
      queue.start();
			//var that = this;
      this.trigger('render');

		},

    loadData : function () {
      this.trigger('loadData');
    },

    renderWithData : function () {

      $(this.el).html(_.template(layoutTemplate, {tabs : this.tabs}));
      this.trigger('finishRender');
    }
	});
  return AppView;
});
