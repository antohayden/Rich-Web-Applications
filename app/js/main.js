// Needed to allow CROSS-domain requests
$.ajaxSetup({
	crossDomain : true,
	cache : false,
	contentType : "application/json",
	dataType : "json"
});

$.ajaxSetup({'cache':true});

// Base Url
var baseURL = "http://localhost:3000/statistics";

//base model
var BaseModel = Backbone.Model.extend();

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

var simpleCollection = Backbone.Collection.extend({});

// Router
var AppRouter = Backbone.Router.extend({

	routes : {
		'' : 'home',
		"questionnaires" : "questionnaires"
	},
	
	home : function(){
		$('article').hide(300);
	},
	
	questionnaires : function(){
	
		$("article").hide(300);
		$("#task_1_content").show(300);

		var questionnairesCount = new QuestionnairesCountByTaskCollection();
		var questionnairesByTaskCount = new simpleCollection();

		var questionnairesListView = new QuestionnairesListView({
			collection: questionnairesByTaskCount
		});

		var total_duration = 0;
		var total_intrusiveness = 0;

		questionnairesCount.fetch({
			success: function(){
				_.each(questionnairesCount.models, function (model){

					if(model.get('task_number')){
						var questionnairesCollectionByTaskId = new QuestionnairesCollectionByTaskId(model.get('task_number'));

						questionnairesCollectionByTaskId.fetch({
							success: function(){

								_.each(questionnairesCollectionByTaskId.models, function (model){

									total_duration += getMilliSecondsBetweenTime(model.get('time_1'), model.get('time_2'));
									total_intrusiveness += parseInt(model.get('intrusiveness'));

								});

								total_duration /= questionnairesCollectionByTaskId.length;
								total_intrusiveness /= questionnairesCollectionByTaskId.length;

								questionnairesByTaskCount.add({
									'task_number' : parseInt(model.get('task_number')),
									'num_questionnaires' : questionnairesCollectionByTaskId.length,
									'average_duration' : convertMilliSecondsToMinutesString(total_duration),
									'average_intrusiveness': Math.round(total_intrusiveness).toString() + '%'
								});

								questionnairesByTaskCount.comparator = function(model){
									return model.get('task_number');
								};

								questionnairesByTaskCount.sort();

								questionnairesListView.flush();
								questionnairesListView.render();
							}
						});
					}

				})
			}

		});
	}

});

//View

var QuestionnairesListView = Backbone.View.extend({
	el: '#task_1_table_body',

	render: function () {
		var that = this;
		
		_.each(this.collection.models, function(model) {

			var questionnairesListItemView = new QuestionnairesListItemView({
				model : model
			});

			that.$el.append(questionnairesListItemView.$el);
			questionnairesListItemView.render();
		});
	},
	
	flush : function() {
		this.$el.empty(); // jquery method
	}
});

var QuestionnairesListItemView = Backbone.View.extend({

	tagName : "tr",

	template : _.template($('#questionnaires-list-template').html()),

	render : function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}

});

var router = new AppRouter();
Backbone.history.start();

