define([
  'jquery',
  'underscore',
  'backbone',
  'models/geoobjectType'
], function( $, _, Backbone, GeoobjectType ) {
	 var GeoobjectTypes = Backbone.Collection.extend({
	 	models: GeoobjectType,
	 	url : 'http://localhost:8080/api/geoObjectTypes'
	 });
	 return GeoobjectTypes;
});