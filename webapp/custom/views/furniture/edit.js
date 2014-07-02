define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/furniture',
  'text!custom/templates/furniture/furnitureEdit.html' 
], function ($, _, Backbone, Events, Queue, Furniture, contentTemplate) {
	var ContentView = Backbone.View.extend({
		el : '.content',
		template : contentTemplate,
		events: {
      		'click .furnitureSaveButton' : 'save'
    	},
    	furniture : null,
		render : function ( src, callback ) {
      		var view = this;
      		var furniture;
      		if ( src.id != -1) {
        		furniture = new Furniture( {id: src.id} );
        		furniture.fetch( {
          			success: function ( furniture ) {
            			view.furniture = furniture;
            			$(view.el).html(_.template(contentTemplate, {furniture: furniture.toJSON()}));
          			},
          			error: function () {
          				console.log('error!');
          			}
        		});
      		} else {
        		view.furniture = new Furniture();
        		$(view.el).html(_.template(contentTemplate, {furniture: view.furniture.toJSON()}));
      		}
		},

		save : function () {
      		var furniture = this.furniture;
      		furniture.save({  
        		label : $('#furnitureLabel').val(),
      		}, 
      		{
        		success: function ( furniture ) {
          			window.location.hash = '/view/furniture.list';
        		}
      		});
    	}
	});
	return ContentView;
});