$(function () {

    var Controller = Backbone.Router.extend({
        routes: {
            "": "start",
            "!/": "start",
            "!/success": "success",
            "!/error": "error"
        },
        start: function() {
            appState.set({state: "start"});
        },
        success: function () {
            appState.set({state: "success"});
        },
        error: function() {
            appState.set({ state: "error" });
        }
    });

    var controller = new Controller();

    var Start = Backbone.View.extend({
        el: $("#start"),
        events: {
            "click input:button": "check"
        },
        check: function () {
            if (this.el.find("input:text").val() == "test") {
                controller.navigate("!/success", true);
            } else {
                controller.navigate("!/error", true);
            }
        }
    });

    var start = new Start();

    var AppState = Backbone.Model.extend({
        defaults: {
            username: "",
            state: "start"
        }
    });

    var appState = new AppState();
    appState.bind("change:state", function() {
        var state = this.get("state");
        if(state == "start") {
            controller.navigate("!/", false);
        } else {
            controller.navigate("!/" + state, false);
        }
    });

    var Family = ["Саша", "Петя", "Коля"];

    var Block = Backbone.View.extend({
        el: $("#block"),

        templates: {
            "start": _.template($("#start").html()),
            "success": _.template($("#success").html()),
            "error": _.template($("#error").html())
        },

        events: {
            "click input:button": "check"
        },

        check: function () {
            var username = this.el.find("input:text").val();
            var find = (_.detect(Family, function(elem){ return elem == username}));
            appState.set({
                "state": find ? "success" : "error",
                "username": username
            });
        },

        render: function () {
            var state = this.model.get("state");

            $(this.el).html(this.templates[state](this.model.toJSON()));
        },

        initialize: function() {
            this.model.bind('change', this.render, this);
        }
    });

    var block = new Block({ model: appState });
    appState.trigger("change");

    Backbone.history.start();
});
