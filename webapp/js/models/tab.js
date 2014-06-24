define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var Tab = Backbone.Model.extend({
		urlRoot : 'http://localhost:8080/api/tabs'
	});
	return Tab;
});