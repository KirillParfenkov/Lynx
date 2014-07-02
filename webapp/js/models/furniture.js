define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var User = Backbone.Model.extend({
		urlRoot : 'http://localhost:8080/api/furnitures',
		initialize: function(){
    	}
	});

	return User;
});