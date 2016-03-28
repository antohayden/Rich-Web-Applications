/*
 * Courses Collection
 * */
var CoursesCollection = Backbone.Collection.extend({

    model : BaseModel,

    initialize : function() {
        this.url = baseURL + "/course/"
    }
});

var CourseModel = Backbone.Model.extend({
    model : BaseModel,
    baseURL : this.baseURL,
    initialize : function(options) {
        this.url = this.baseURL + "/course/" + options.id;
    }
});


