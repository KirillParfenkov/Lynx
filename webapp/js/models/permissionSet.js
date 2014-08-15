define([
		'backbone'
], function( Backbone ) {

	var PermissionSet = Backbone.Model.extend({
		urlRoot : '/system/permissionSets'
	});

	return PermissionSet;
});