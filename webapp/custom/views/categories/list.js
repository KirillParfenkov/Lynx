define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'models/furniture',
  'collections/furnitures',
  'text!custom/templates/categories/categoriesList.html',
], function ($, _, Backbone, Events, Furniture, Furnitures, contentTemplate) {
	var ContentView = Backbone.View.extend({
		el : '.content',
		ui : {},
		template : contentTemplate,
		render : function ( src, callback ) {

			var view = this;
			$(view.el).html(_.template(contentTemplate));

			view.ui.tree = new webix.ui({
				container : "categoriesTree",
				view : "tree",
				id : "catTree",
				select : true,
				data : [
					{ 
						id : "root",
					  	value : "Cars",
					  	open: true,
					  	data:[
					  		{
					  			id : 1,
					  			value : "Toyota",
					  			data : [
					  				{ id:"1.1", value:"Avalon" },
									{ id:"1.2", value:"Corolla" },
									{ id:"1.3", value:"Camry" }
					  			]
					  		}
						]
					}
				],
				onContext : {}
			});

			view.ui.treeContext = new webix.ui({
				view : "contextmenu",
				id : "categoryMenu",
				data : [
					{
						value : "Add"
					},
					{
						value : "Info"
					},
					{
						value : "Edit"
					},
					{
						value : "Delete"
					}
				],
				master : $$('catTree'),
				on : {
					"onItemClick" : function(id) {

						var context = this.getContext();
						var tree = context.obj;
						var treeId = context.id;
						var item = this.getItem( id ).value;

						if ( item == 'Add' ) {
							$$( 'addCategoryWin' ).show();
						} else if ( item == 'Info' ){
							$$( 'infoCategoryWin' ).show();
						} else if ( item == 'Edit' ) {
							$$('editCategoryWin').show();
						}

					}
				}
			});

			view.ui.addCategoryWin = new webix.ui({
				view : "window",
				position : "center",
				move : true,
				id : "addCategoryWin",
				head : "Add Categoty",
				body : {
					view : "form",
					id : "addCategoryForm",
					elements : [
						{ view : "text", label : "Name" },
						{ margin : 5, cols : [
							{
								view : "button", 
								value : "Add", 
								type : 'form',
								click : function () {
									webix.message('Added Category!');
									$$('addCategoryWin').hide();
								}
							},
							{
								view : "button", 
								value : "Cancel",
								click : function () {
									$$('addCategoryWin').hide();
								}
							}
						]}
					]
				},
				modal : true
			});

			view.ui.infoCategoryWin = new webix.ui({
				view : "window",
				position : "center",
				move : true,
				id : "infoCategoryWin",
				head : "Info Category",
				body : {
					template : "Save text"
				},
				modal : true
			});

			view.ui.editCategoryWin = new webix.ui({
				view : "window",
				position : "center",
				move : true,
				id : "editCategoryWin",
				head : "Edit Category",
				body : {
					template : "Save text"
				},
				modal : true
			});
		}
	});
	return ContentView;
});