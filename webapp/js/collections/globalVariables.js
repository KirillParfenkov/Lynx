define([
  'jquery',
  'underscore',
  'backbone',
  'models/globalVariable'
], function( $, _, Backbone, GlobalVariable ) {
	 var GlobalVariables = Backbone.Collection.extend({
	 	models: GlobalVariable,
	 	url : '/system/GlobalVariables'
	 });
	 return GlobalVariables;
});