define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var User = Backbone.Model.extend({
		urlRoot : 'http://localhost:8080/api/users',
		initialize: function(){
    	}
	});

	return User;
});