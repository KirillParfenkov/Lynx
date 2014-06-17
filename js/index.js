$(function () {

    var Controller = Backbone.Router.extend({
        routes: {
            "": "start",
            "!/": "start",
            "!/success": "success",
            "!/error": "error"
        },
        start: function() {
            console.log('start');
        },
        success: function () {
            console.log('success');
        },
        error: function() {
            console.log('error');
        }
    });

    var controller = new Controller();

    var user = new User({id: 1});
    user.fetch({
        success : function ( user ) {
            alert(user.toJSON());
        }
    });

    Backbone.history.start();
});
