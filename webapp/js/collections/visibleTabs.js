define([
  'jquery',
  'underscore',
  'backbone',
  'models/tab'
], function( $, _, Backbone, Tab ) {
	 var Tabs = Backbone.Collection.extend({
	 	models: Tab,
	 	url : 'http://localhost:8080/visibleTabs'
	 });
	 return Tabs;
});