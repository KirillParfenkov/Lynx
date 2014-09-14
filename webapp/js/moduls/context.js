define([
  'jquery',
  'underscore',
  'backbone',
	'vm'
], function ($, _, Backbone, Vm) {

    var Context = {
      getCurrentUser : function( done ) {
        $.get('/system/currentUser', function( user ) {
          done( null, user );  
        }).fail( function() {
          done( { error: "error"} );
        });
      },

      getCurrentProfile : function( done ) {
        $.get('/system/currentProfile', function( profile ) {
          done( null, profile );  
        }).fail( function() {
          done( { error: "error"} );
        });
      },

      getGlobalVeriables : function( done ) {
        $.get('/system/globalVariables', function( globalVeriables ) {
          done( null, globalVeriables );
        }).fail( function(){
          done( { error: "error"} );
        });
      }
  }
  return Context;
});
