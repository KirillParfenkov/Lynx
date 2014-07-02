define([
  'jquery',
  'underscore',
  'backbone',
  'models/furniture'
], function( $, _, Backbone, Furniture ) {
	 var Furnitures = Backbone.Collection.extend({
	 	models: Furniture,
	 	url : 'http://localhost:8080/api/furnitures'
	 });
	 return Furnitures;
});