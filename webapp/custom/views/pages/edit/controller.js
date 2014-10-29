define([
  'jquery',
  'underscore',
  'backbone',
  'async',
  'messager',
  'text!./template/page-edit.html',
  'text!templates/error.html',
  'less!./css/page-edit.less',
  'tinymce'
], function ($, _, Backbone, async, Messager, template, errorTemplate ) {
  var PageEdit = Backbone.View.extend({

    el : '.content',
    user : null,
    messager : new Messager(),

    render : function ( src, callback ) {
      $(this.el).html(_.template(template));
      console.log($('.page-editor'));
      tinymce.init({
        selector: 'textarea',
        language: 'ru',
        plugins: [
         "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
         "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
         "save table contextmenu directionality emoticons template paste textcolor"]
      });
    }  
  });
  return PageEdit;
});