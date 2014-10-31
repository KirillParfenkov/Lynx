define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var Content = Backbone.Model.extend({
		idAttribute: "_id",
		urlRoot : '/service/content'
	});
	return Content;
});