define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/furniture',
  'models/picture',
  'text!custom/templates/furniture/furnitureEdit.html' 
], function ($, _, Backbone, Events, Queue, Furniture, Picture, contentTemplate) {
	var ContentView = Backbone.View.extend({
		el : '.content',
		template : contentTemplate,
		events: {
      		'click .furnitureSaveButton' : 'save'
    	},
    furniture : null,
    ui : null,
		render : function ( src, callback ) {
      		var view = this;
      		var furniture;
          //var picture
      		if ( src.id != -1) {
        		furniture = new Furniture( {id: src.id} );
        		furniture.fetch( {
          			success: function ( result ) {
            			view.furniture = result;
                  $(view.el).html(_.template(contentTemplate, {furniture: result.toJSON()}));
                  view.initUiComponents( src, callback );
          			},
          			error: function () {
          				console.log('error!');
          			}
        		});
      		} else {
        		view.furniture = new Furniture();
        		$(view.el).html(_.template(contentTemplate, {furniture: view.furniture.toJSON()}));
            view.initUiComponents( src, callback );
      		}
		},

    initUiComponents : function ( src,  callback ) {
      var view = this;

      view.ui.categoryTree = new webix.ui({
        view : "datatable",
      });

      view.ui.categoryTreeWen = new webix.ui({
        view : "window",
        position : "center",
        move : true,
        id : "addCategoryTreeWen",
        head : "Add Category",
        body : {
          template : "Save text"
        },
        modal : true
      });



      if ( callback ) {
        callback();
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