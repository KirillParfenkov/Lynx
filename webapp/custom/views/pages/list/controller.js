define([
  'module',
  'jquery',
  'underscore',
  'backbone',
  'underi18n',
  'async',
  'messager',
  'collections/contents',
  'text!./template/page-list.html',
  'text!templates/error.html',
  'less!./css/page-list.less',
  'tinymce'
], function ( module, $, _, Backbone, underi18n, async, Messager, Contents, template, errorTemplate ) {
  var PageEdit = Backbone.View.extend({
    el : '.content',
    contents : null,
    messager : new Messager(),

    render : function ( src, callback ) {
      var view = this;
      view.contents = new Contents();
      view.contents.fetch( {
        success : function( contents ) {
          $(view.el).html(_.template(underi18n.template( template, view.i18n ), { contents: contents.toJSON() }));
        },
        error : function() {
          console.log( err );
        }
      });
    },

    loadI18n : function ( i18n, done ) {
      var path = module.id + '/../i18n/';
      var view = this;
      $.get( path + i18n + '.json', function( data ) {
          view.i18n = underi18n.MessageFactory( data );
          done( null, view.i18n );
      }).fail( function( err ) {
          done( err );
      });
    }
  });
  return PageEdit;
});