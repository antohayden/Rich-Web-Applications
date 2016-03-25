/*
 * Backbone Models and Collections for Tasks
 * */

/*
 * Tasks Collection
 * */
var TasksCollection = Backbone.Collection.extend({

    model : BaseModel,

    initialize : function() {
        this.url = baseURL + "/tasks/"
    }
});

