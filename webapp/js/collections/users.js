define([
  'jquery',
  'underscore',
  'backbone',
  'models/user'
], function( $, _, Backbone, User ) {
	 var Users = Backbone.Collection.extend({
	 	models: User,
	 	url : 'http://localhost:8080/api/users'
	 });
	 return Users;
});