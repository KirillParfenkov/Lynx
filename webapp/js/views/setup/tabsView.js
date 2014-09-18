define([
    'jquery',
    'underscore',
    'backbone',
    'events',
    'libs/queue/queue',
    'models/tab',
    'collections/tabs',
    'text!templates/setup/tab/list/list.html',
    'less!templates/setup/tab/list/list.less'
], function ($, _, Backbone, Events, Queue, Tab, Tabs, template) {
	var TabsView = Backbone.View.extend({
		render : function ( src, callback ) {
            var view = this;
            var tabs = null;
            var queue = new Queue([
                function(queue) {
                    tabs = new Tabs();
                    tabs.fetch({
                        success : function () {
                            queue.next();
                        },
                         error : function( err ) {
                            console.log( err );
                            queue.next();
                        }
                    });
                },
                function(queue) {
                    $(view.el).html(_.template( underi18n.template(template, view.i18n), {tabs: tabs.toJSON()}));
                    if ( callback ) {
                        callback();
                    }
                }]);
            queue.start();
		},

        hasPermission : function( systemPermissionSet ) {
            if ( systemPermissionSet && systemPermissionSet.allowEditTabs ) {
                if ( systemPermissionSet.allowEditTabs.indexOf('read') == -1 ) {
                    return false;
                }
            } else {
                return false;
            }
            return true;
        },

        loadI18n : function ( i18n, done ) {
            var path = '/templates/setup/tab/list/';
            var view = this;
            $.get( path + i18n + '.json', function( data ) {
                view.i18n = underi18n.MessageFactory( data );
                done( null, view.i18n );
            }).fail( function( err ) {
                done( err );
            });
        }
    });
	return TabsView;
});