define([
  'jquery',
  'underscore',
  'backbone',
  'models/picture'
], function( $, _, Backbone, Picture ) {
	 var Pictures = Backbone.Collection.extend({
	 	models: Picture,
	 	url : 'http://localhost:8080/api/files'
	 });
	 return Pictures;
});