define([
  'jquery',
  'underscore',
  'backbone',
  'models/geoobject'
], function( $, _, Backbone, Geoobject ) {
	 var Geoobjects = Backbone.Collection.extend({
	 	models: Geoobject,
	 	url : 'http://localhost:8080/api/geoObjects'
	 });
	 return Geoobjects;
});