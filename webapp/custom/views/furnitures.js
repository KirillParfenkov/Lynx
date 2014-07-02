define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'text!custom/templates/furnitures.html' 
], function ($, _, Backbone, Events, Queue, contentTemplate) {
	var ContentView = Backbone.View.extend({
		el : '.content',
		template : contentTemplate,
		render : function ( src, callback ) {
			var urlParser = this.getUrlParser( window.location.href );
			//console.log( urlParser.search );
			console.log( urlParser.search );
			var view = this;
			$(this.el).html(_.template(contentTemplate));
		},

		getUrlParser : function( url ) {
			var parser = document.createElement('a');
			parser.href = url;
			return parser;
		}

	});
	return ContentView;
});