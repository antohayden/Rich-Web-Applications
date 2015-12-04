/*
* Backbone Models and Collections for Questionnaires
* */

/*
 * Questionnaires Collection
 * */
var QuestionnairesCollection = Backbone.Collection.extend({
    model : QuestionnaireModel
});

/*
 * A single questionnaire model
 * */
var QuestionnaireModel = Backbone.Model.extend({
    model : BaseModel,
    baseURL : this.baseURL,
    initialize : function(options) {
        this.url = this.baseURL + "/questionnaires/" + options.id;
    }
});

/*
 * A list of task ids and the number of questionnaires associated with them
 * */
var QuestionnairesCountByTaskCollection = Backbone.Collection.extend({
    model : BaseModel,
    baseURL : this.baseURL,

    defaults: {
        task_number: null,
        count: null
    },

    initialize : function() {
        this.url = this.baseURL + "/questionnaires/task"
    }
});

/*
 * A list of questionnaires associated with a task id
 * */
var QuestionnairesCollectionByTaskId= Backbone.Collection.extend({
    model : BaseModel,
    baseURL : this.baseURL,
    initialize : function(task_number) {
        this.url = this.baseURL + "/questionnaires/task/" + task_number
    }
});