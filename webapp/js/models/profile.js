define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var Profile = Backbone.Model.extend({
		urlRoot : 'http://localhost:8080/api/profiles'
	});
	return Profile;
});