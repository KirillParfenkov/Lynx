define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var geoobjectType = Backbone.Model.extend({
		urlRoot : 'http://localhost:8080/api/geoObjectTypes'
	});
	return geoobjectType;
});