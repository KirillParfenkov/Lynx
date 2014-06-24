define([
  'jquery',
  'underscore',
  'backbone',
  'models/profile'
], function( $, _, Backbone, Profile ) {
	 var Profiles = Backbone.Collection.extend({
	 	models: Profile,
	 	url : 'http://localhost:8080/api/profiles'
	 });
	 return Profiles;
});