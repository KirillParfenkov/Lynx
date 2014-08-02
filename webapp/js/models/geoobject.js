define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var Geoobject = Backbone.Model.extend({
		urlRoot : 'http://localhost:8080/api/geoObjects'
	});
	return Geoobject;
});