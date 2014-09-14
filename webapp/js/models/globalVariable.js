define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var GlobalVariable = Backbone.Model.extend({
		urlRoot : '/system/globalVariable'
	});
	return GlobalVariable;
});