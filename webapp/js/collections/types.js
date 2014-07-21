define([
  'jquery',
  'underscore',
  'backbone',
  'models/type'
], function( $, _, Backbone, Type ) {
	 var Types = Backbone.Collection.extend({
	 	models: Type,
	 	url : 'http://localhost:8080/api/types'
	 });
	 return Types;
});