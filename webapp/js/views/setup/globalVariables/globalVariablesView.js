define([
  'jquery',
  'underscore',
  'backbone',
  'async',
  'messager',
  'collections/globalVariables',
  'text!templates/setup/globalVariables/globalVariablesView.html',
  'text!templates/error.html',
  'less!templates/setup/globalVariables/globalVariablesView.less'
], function ($, _, Backbone, async, Messager, GlobalVariables, template, errorTemplate ) {
  var GlobalVariablesView = Backbone.View.extend({

    el : '.content',
    initialize: function () {
      this.el = '.content';
    },
    user : null,
    messager : new Messager( $('.page .main-message-box') ),

    render : function ( src, callback ) {
      var view = this;

      var globalVariables = new GlobalVariables();
      globalVariables.fetch({
        success : function( variables ) {
          $(view.el).html(_.template(template, { variables : variables.toJSON() }));          
        },
        error : function( err ) {
          view.messager.danger('Резурс не доступен =(');
        }
      });
    },

    hasPermission : function( systemPermissionSet ) {
      if ( systemPermissionSet && systemPermissionSet.allowEditСonfiguration ) {
        if ( systemPermissionSet.allowEditСonfiguration.indexOf('read') == -1 ) {
          return false;
        }
      } else {
        return false;
      }
      return true;
    }
  });
  return GlobalVariablesView;
});