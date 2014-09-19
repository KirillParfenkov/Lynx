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
        messager : new Messager( $('.page .main-message-box') ),
        events : {
            'click .global-variable-list .variables .action .edit' : 'edit',
            'click .global-variable-list .variables .action .save' : 'save',
            'click .global-variable-list .variables .action .delete ' : 'delete',
            'click .global-variable-list .variables .action .cancel ' : 'cancel'
        },

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
        },

        edit : function( event ) {

            var row = $(event.currentTarget).parents('tr'),
                viewVar = row.find('.view-value'),
                editVar = row.find('.edit-value'),
                saveLink = row.find('.action .save'),
                cancelLink = row.find('.action .cancel'),
                deleteLink = row.find('.action .delete'),
                editLink = row.find('.action .edit');

            viewVar.hide();
            deleteLink.hide();
            editLink.hide();
            editVar.show();
            saveLink.show();
            cancelLink.show();
        },

        save : function( event ) {
            console.log('Save');
            this.finishEdit( event );
        },

        delete : function( event ) {
            console.log('Delete');
        },

        cancel : function( event ) {
            this.finishEdit( event );
        },

        finishEdit : function( event ) {
            var view = this,
                row = $(event.currentTarget).parents('tr'),
                viewVar = row.find('.view-value'),
                editVar = row.find('.edit-value'),
                saveLink = row.find('.action .save'),
                cancelLink = row.find('.action .cancel'),
                deleteLink = row.find('.action .delete'),
                editLink = row.find('.action .edit');

            viewVar.show();
            deleteLink.show();
            editLink.show();
            editVar.hide();
            saveLink.hide();
            cancelLink.hide();
        }
    });
    return GlobalVariablesView;
});