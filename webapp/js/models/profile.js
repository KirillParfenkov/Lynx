define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var Profile = Backbone.Model.extend({
		urlRoot : '/api/profiles'
	});
	return Profile;
});