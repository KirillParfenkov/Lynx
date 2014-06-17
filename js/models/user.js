User = Backbone.Model.extend({
	initialize: function () {
		console.log('User is created!');
	},
	urlRoot : 'http://localhost:1337/api/users'
});