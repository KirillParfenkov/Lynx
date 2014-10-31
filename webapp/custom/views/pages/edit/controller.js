define([
  'jquery',
  'underscore',
  'backbone',
  'async',
  'messager',
  'models/content',
  'text!./template/page-edit.html',
  'text!templates/error.html',
  'less!./css/page-edit.less',
  'tinymce'
], function ($, _, Backbone, async, Messager, Content, template, errorTemplate ) {
  var PageEdit = Backbone.View.extend({

    el : '.content',
    content : null,
    messager : new Messager(),

    render : function ( src, callback ) {
      var view = this;
      console.log( 'src.id: ' + src.id );
      view.content = new Content( { _id : src.id });
      view.content.fetch({
        success : function( content ) {
          $(view.el).html(_.template(template, { content: content.toJSON() }));
          tinymce.init({
            selector: 'textarea.page-editor',
            language: 'ru',
            plugins: [
             "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
             "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
             "save table contextmenu directionality emoticons template paste textcolor"]
          });
        },
        error : function() {
          console.log( err );
        }
      });
    }  
  });
  return PageEdit;
});