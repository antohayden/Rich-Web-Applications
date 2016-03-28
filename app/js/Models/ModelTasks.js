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

/*
 * Collection of tasks from a specific course
 * */
var TasksOfACourseCollection = Backbone.Collection.extend({

    model : BaseModel,

    initialize : function(courseId) {
        this.url = baseURL + "/tasks/course/" + courseId
    }
});

