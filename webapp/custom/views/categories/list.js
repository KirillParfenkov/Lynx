define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'async',
  'models/category',
  'collections/categories',
  'text!custom/templates/categories/categoriesList.html',
], function ($, _, Backbone, Events, Async, Category, Categories, contentTemplate) {
	var ContentView = Backbone.View.extend({
		el : '.content',
		ui : {},
		template : contentTemplate,
		render : function ( src, callback ) {

			var view = this,
				categoryTree,
				categories = new Categories();

			Async.waterfall([
				function loadCategories( next ) {
					categories.fetch( {
						success : function( result ) {
							next( null, result.toJSON());
						},
						error : function( err ) {
							next( err );
						}
					});
					
				},
				function bieldCategoryTree( categories, next ) {
					var categoryTree = [],
					    categoryTreeMap = {};

					for( var i = 0; i < categories.length; i++  ) {
						categoryTreeMap[ categories[i].id ] = {
							id: categories[i].id,
							value : categories[i].name,
							data : []
						};
					}

					for( var i = 0; i < categories.length; i++  ) {
						var item;
						if ( !categories[i].parentId ) {
							categoryTree.push( categoryTreeMap[categories[i].id] );

						} else {
							categoryTreeMap[ categories[i].parentId ].data.push( categoryTreeMap[categories[i].id] );
						}
					}
					next( null, categoryTree );
				},
				function renderView ( categoryTree, next ) {
					$(view.el).html(_.template(contentTemplate));

					view.ui.tree = new webix.ui({
						container : "categoriesTree",
						view : "tree",
						id : "categoriesTree",
						select : true,
						data : categoryTree,
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
						master : $$('categoriesTree'),
						on : {
							"onItemClick" : function(id) {

								var context = this.getContext();
								var tree = context.obj;
								var treeId = context.id;
								var item = this.getItem( id ).value;

								if ( item == 'Add' ) {
									$$( 'addCategoryWin' ).context = context;
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
						context : null,
						view : "window",
						position : "center",
						move : true,
						id : "addCategoryWin",
						head : "Add Categoty",
						body : {
							view : "form",
							id : "addCategoryForm",
							elements : [
								{ view : "text", label : "Name", name : "name" },
								{ margin : 5, cols : [
									{
										view : "button", 
										value : "Add", 
										type : 'form',
										click : function () {
											var parentId = $$('addCategoryWin').context.id;
											var category = new Category();
											category.save(	{ 
																parentId: parentId,
																name : $$('addCategoryForm').getValues().name
														  	},
														  	{
																success : function ( result ) {
																	var category = result.toJSON();
																	webix.message( 'Added category "' + $$('addCategoryForm').getValues().name + '"' );
																	$$('addCategoryWin').hide();
																	$$('categoriesTree').add({
																		id : category.id,
																		value : category.name
																	}, 0, parentId);
																},
																error : function () {
																	webix.message( 'Error' );
																}
															});
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

					next( null );
				}
			], function( err ) {
				if ( err ) throw err;
			});
		}
	});
	return ContentView;
});