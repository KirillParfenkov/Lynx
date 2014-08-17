define([
		'backbone'
], function( Backbone ) {

	var PermissionSet = Backbone.Model.extend({
		urlRoot : '/system/profiles'
	});

	return PermissionSet;
});