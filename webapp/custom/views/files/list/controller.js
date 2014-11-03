define([
  'module',
  'jquery',
  'jstree',
  'underscore',
  'backbone',
  'underi18n',
  'async',
  'messager',
  'collections/contents',
  'text!./template/files-list.html',
  'text!templates/error.html',
  'less!./css/files-list.less'
], function ( module, $, jstree, _, Backbone, underi18n, async, Messager, Contents, template, errorTemplate ) {
  var FilesList = Backbone.View.extend({
    el : '.content',
    contents : null,
    messager : new Messager(),

    render : function ( src, callback ) {
      var view = this;
      $(view.el).html(_.template( template ));
      var explorer = $('#file-explorer');
      explorer.jstree({
        plugins : [ 'contextmenu' ],
        core : {
          animation : 0,
          check_callback : true,
          data : {
            url : function( node ) {
              console.log('url');
              console.log( node );
              return '/files';
            },
            data : function( node ) {
              console.log('data');
              console.log( node.load_node );
              console.log( 'jstree.load_node: ' );
              //console.log( jstree.load_node );
              return { 'id' : node.id };
            }
          }
        }
      }).bind('before_open.jstree', function( e, data ) {
        console.log( 'before_open.jstree' );
        var childrens = data.node.children;
        for ( var i = 0; i < childrens.length; i++ ) {
          explorer.jstree('load_node', childrens[i] );
        }
      }).bind('loaded.jstree', function( e, data ) {
        explorer.jstree('load_all');
        var root = $('#file-explorer').jstree( 'get_node', '#' );
        for ( var i = 0; i < root.children.length; i++ ) {
          explorer.jstree('load_node', root.children[i] );
        }
      });
    }
  });
  return FilesList;
});
