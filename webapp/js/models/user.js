define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var User = Backbone.Model.extend({
		urlRoot : 'http://localhost:1337/api/users',
		initialize: function(){
    	}
	});

	return User;
});