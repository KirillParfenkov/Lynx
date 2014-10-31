define([
  'jquery',
  'underscore',
  'backbone',
  'async',
  'messager',
  'collections/contents',
  'text!./template/page-list.html',
  'text!templates/error.html',
  'less!./css/page-list.less',
  'tinymce'
], function ($, _, Backbone, async, Messager, Contents, template, errorTemplate ) {
  var PageEdit = Backbone.View.extend({
    el : '.content',
    contents : null,
    messager : new Messager(),

    render : function ( src, callback ) {
      var view = this;
      view.contents = new Contents();
      view.contents.fetch( {
        success : function( contents ) {
          $(view.el).html(_.template(template, { contents: contents.toJSON() }));
        },
        error : function() {
          console.log( err );
        }
      });
    }  
  });
  return PageEdit;
});