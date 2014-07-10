define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var Category = Backbone.Model.extend({
		urlRoot : 'http://localhost:8080/api/categories',
		initialize: function(){
    	}
	});

	return Category;
});