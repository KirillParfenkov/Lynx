define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var Picture = Backbone.Model.extend({
		urlRoot : 'http://localhost:8080/api/files',
		initialize: function(){
    	}
	});

	return Picture;
});