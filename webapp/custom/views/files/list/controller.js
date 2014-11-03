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
  'text!./template/image.html',
  'text!./template/upload.html',
  'text!templates/error.html',
  'less!./css/files-list.less'
], function ( module, $, jstree, _, Backbone, underi18n, async, Messager, Contents, template, imageTemplate, uploadTemplate, errorTemplate ) {
  var FilesList = Backbone.View.extend({
    el : '.content',
    imageEl : '.content .image-box',
    uploadEl : '.content .upload-box',
    contents : null,
    messager : new Messager(),

    render : function ( src, callback ) {
      var view = this;
      $(view.el).html(_.template( template ));
      $(view.uploadEl).html(_.template( uploadTemplate ));

      var explorer = $('#file-explorer');
      explorer.jstree({
        plugins : [ 'contextmenu' ],
        core : {
          animation : 0,
          check_callback : true,
          data : {
            url : function( node ) {
              return '/files';
            },
            data : function( node ) {
              return { 'id' : node.id };
            }
          }
        },
        contextmenu : {
          items : function( node ) {
            return {
              createDir : {
                label : 'Создать Коталог'
              },
              renameItem : {
                label : 'Переименовать'
              },
              deleteItem : {
                label : 'Удалить'
              }
            }
          }
        }
      }).bind('before_open.jstree', function( e, data ) {
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
      }).bind('select_node.jstree', function( e, data) {
        var node = data.node;
        if ( node.original.isFile ) {
          view.showImage( node.id );
        }
      });;
    },
    showImage : function( id ) {
      $(this.imageEl).html(_.template( imageTemplate, { path : id } ));
    }
  });
  return FilesList;
});
