define([
  'jquery',
  'underscore',
  'backbone',
  'underi18n',
  'libs/queue/queue',
  'models/user',
  'text!templates/setup/setupMenu/setupMenu.html' 
], function ($, _, Backbone, underi18n, Queue, User, template) {
	var SetupMenu = Backbone.View.extend({
		el : '.header-menu-container',
    initialize: function () {
      this.el = '.header-menu-container';
    },

		render : function ( src, callback ) {
			var view = this;
      $(view.el).html(_.template( view.i18n ? underi18n.template(template, view.i18n) : template, {})); 
		},

    loadI18n : function ( i18n, done ) {
      var path = '/templates/setup/setupMenu/';
      var view = this;
      $.get( path + i18n + '.json', function( data ) {
        view.i18n = underi18n.MessageFactory( data );
        done( null, view.i18n );
      }).fail( function( err ) {
        done( err );
      });
    }
	});
	return SetupMenu;
});