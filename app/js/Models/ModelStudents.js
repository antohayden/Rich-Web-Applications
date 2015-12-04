/*
* Backbone Models and Collections for students
* */

/*
 * Students Collection
 * */
var StudentsCollection = Backbone.Collection.extend({

    model : BaseModel,

    initialize : function() {
        this.url = baseURL + "/students/"
    }
});

/*
* Collection of Nationalities that the Students are from
* */
var StudentNationalitiesCollection = Backbone.Collection.extend({
    model : BaseModel,

    initialize : function() {
        this.url = baseURL + "/students/nationality/"
    }
});

/*
* Collection of Students from a specified Nationality
* */
var StudentsOfANationalityCollection = Backbone.Collection.extend({

    model : BaseModel,

    initialize : function(nationality) {
        this.url = baseURL + "/students/nationality/" + nationality
    }
});
