define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'async',
  'libs/queue/queue',
  'models/furniture',
  'models/picture',
  'models/category',
  'text!custom/templates/furniture/furnitureEdit.html' 
], function ($, _, Backbone, Events, async, Queue, Furniture, Picture, Category, contentTemplate) {
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
                  var categoryIdList = result.toJSON().categories;
                  var callList = [];

                  for ( var i = 0; i < categoryIdList.length; i++ ) {
                    callList.push( function( next ) {
                      var categoryId = categoryIdList.pop();
                      var category = new Category( {id : categoryId});
                      category.fetch({
                        success : function( result ) {
                          next( null, result.toJSON() );
                        },
                        error : function( err ) {
                          console.log( err );
                          next( err );
                        }
                      });
                    });
                  }

                  async.parallel( callList, function( err, categories ){
                    if (err) throw err;
                    console.log('categories');
                    console.log(categories);
                    $(view.el).html(_.template(contentTemplate, {furniture : result.toJSON(), categories : categories}));
                    view.initUiComponents( src, callback );
                  });
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
          template : "Same text"
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