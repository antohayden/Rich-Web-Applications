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

//questionnaire model
var QuestionnaireModel = Backbone.Model.extend({
	model : BaseModel,
    baseURL : this.baseURL,
    initialize : function(options) {
        this.url = this.baseURL + "/questionnaires/" + options.id;
    }
});

//questionnaires collection
var QuestionnairesCollection = Backbone.Collection.extend({
	model : BaseModel,
	url : this.baseURL + "/questionnaires"
});

//questionnaires averages Model
var QuestionnairesAveragesModel = Backbone.Model.extend({
	model : BaseModel
});

//questionnaires Details Collection
var QuestionnairesDetailsCollection = Backbone.Collection.extend({
	model : QuestionnaireModel
});

//Nationalities Collection
var NationalitiesCollection = Backbone.Collection.extend({
	model : BaseModel,
	url : this.baseUrl + "/nationalities"
});

//Students Collection
var StudentsOfANationalitieCollection = Backbone.Collection.extend({
	model : BaseModel,
	baseURL : this.baseUrl,
	initialize : function(models, options) {
		this.url = this.baseURL + "/students/nationality/" + options.id;
	}
});

//Tasks Collection
var TasksCollection = Backbone.Collection.extend({
	model : BaseModel,
	url : this.baseUrl + "/tasks"
});

//Questionnaires of a Task Collection
var QuestionnairesOfATask = Backbone.Collection.extend({
	model : BaseModel,
	baseURL : this.baseUrl,
	initialize : function(models, options) {
		this.url = this.baseURL + "/questionnaires/task/" + options.id;
	}
});

//model to store country and number of students
var NationalitiesCountModel = Backbone.Model.extend({
	model : BaseModel
});

//Collection to store count models
var NationalitiesCountCollection = Backbone.Collection.extend({
	model : NationalitiesCountModel
});

//Students Collection
var StudentsCollection = Backbone.Collection.extend({
	model : BaseModel,
	url : this.baseUrl + "/students"
});

//Questionnaires per Student
var QuestionnairesByAStudent = Backbone.Collection.extend({
	model : BaseModel,
	baseURL : this.baseUrl,
	initialize : function(models, options) {
		this.url = this.baseURL + "/questionnaires/student/" + options.id;
	}
});

//collection of students and number of questionnaires
var QuestionnairesByStudentsCount = Backbone.Collection.extend({});
//collection of tasks and number of questionnaires
var QuestionnairesByTaskCount = Backbone.Collection.extend({});

// Router
var AppRouter = Backbone.Router.extend({

	routes : {
		'' : 'home',
		"questionnaires" : "questionnaires",
		"nationalities" : "nationalities",
		"questionnairesPerStudent" : "questionnairesPerStudent",
		"questionnairesOfATask" : "questionnairesOfATask"
	},
	
	home : function(){
		$('article').hide(300);
	},
	
	questionnaires : function(){
	
		$("article").hide(300);
		$("#task_1_content").show(300);
		
		var questionnairesCollection = new QuestionnairesCollection();
		var questionnairesDetailsCollection = new QuestionnairesDetailsCollection();
		var questionnairesListView = 
		new QuestionnairesListView({ collection : questionnairesDetailsCollection});
		var questionnaireAveragesRowView = 
			new QuestionnaireAveragesRowView({ collection : questionnairesDetailsCollection});
			
		var counter = 0;
		
		//get collection of questionnaires
		questionnairesCollection.fetch({
            success: function () {

                //for each questionnaire get details and add to collection
                _.each(questionnairesCollection.models, function (model) {
                    counter++;
                    //calculate duration
                    model.set('duration', getMinutes(
                        model.get('time_1'),
                        model.get('time_2').toFixed(1)));

                    if (counter % 20 === 0 || counter === questionnairesCollection.length) {
                        questionnairesListView.flush();
                        questionnairesListView.render();
                    }

                    if (typeof RMSE_total === 'undefined') {
                        RMSE_total = model.attributes.get('rmse_value');
                    }
                    else {
                        RMSE_total += model.attributes.get('rmse_value');
                    }
                })
            }
        })
	},
	
	nationalities : function() {
		$("article").hide(300);
		$("#task_2_content").show(300);
		var nationalitiesCollection = new NationalitiesCollection();
		var nationalitiesCountCollection = new NationalitiesCountCollection();			
		var studentsOfANationalitieView = new
						StudentsOfANationalitieView({
							collection : nationalitiesCountCollection
						});
						
		nationalitiesCollection.fetch({
			success: function() {
				_.each(nationalitiesCollection.models, function(model){
				
				var studentsOfANationalitieCollection = 
					new StudentsOfANationalitieCollection([], {
						id : model.id
					});
								
					studentsOfANationalitieCollection.fetch({
						success : function(){
							var nationalitiesCountModel = new NationalitiesCountModel();
							nationalitiesCountModel.set('country', model.get('description'));
							nationalitiesCountModel.set('count', studentsOfANationalitieCollection.length);
							nationalitiesCountModel.set('color', generateColor());
							nationalitiesCountCollection.add(nationalitiesCountModel);
								
							studentsOfANationalitieView.flush();
							studentsOfANationalitieView.render();
						}
					});
				})
				
			}
		});
	},
	
	questionnairesPerStudent : function(){
		$("article").hide(300);
		$("#task_3_content").show(300);
		var studentsCollection = new StudentsCollection();
		var questionnairesByStudentsCount = new QuestionnairesByStudentsCount();
		var questionnairesByStudentsView = new 
					QuestionnairesByStudentsView({
						collection : questionnairesByStudentsCount
					});
		
		studentsCollection.fetch({
			success : function(){
				_.each(studentsCollection.models, function(model){
					var questionnairesByAStudent = new QuestionnairesByAStudent([],{id : model.id});
					
					questionnairesByAStudent.fetch({
						success : function(){
							questionnairesByStudentsCount.add({
								'student_number' : model.id,
								'num_questionnaires' : questionnairesByAStudent.length
							});
							questionnairesByStudentsView.flush();
							questionnairesByStudentsView.render();
						}
					});
					
				})
			}
		})
	},
	
	questionnairesOfATask : function(){
		$("article").hide(300);
		$("#task_5_content").show(300);
		var tasksCollection = new TasksCollection();
		var questionnairesByTaskCount = new QuestionnairesByTaskCount();
		var questionnairesByTaskView = new QuestionnairesByTaskView({
				collection : questionnairesByTaskCount
				});
				
		tasksCollection.fetch({
			success : function(){
				_.each(tasksCollection.models, function(model){
					var questionnairesOfATask = new QuestionnairesOfATask([], {id : model.get('task_id')});
					
					questionnairesOfATask.fetch({
						success : function(){
							questionnairesByTaskCount.add({
								'task_number' : model.get('task_id'),
								'num_questionnaires' : questionnairesOfATask.length
							});
							questionnairesByTaskView.flush();
							questionnairesByTaskView.render();
						}
					})
				
				})
			}
		});
	}
});

//View
var QuestionDeivationsView = Backbone.View.extend({
	el : "#std_dev_values",
	template :  _.template($('#questionnaires-dev-template').html()),
	tagName : "tr",
	
	render : function(stdModel){
		this.$el.append(this.template(stdModel.toJSON()));
	},
	
	flush : function() {
		this.$el.empty(); // jquery method
	}
}); 

var QuestionnaireAveragesRowView = Backbone.View.extend({
	el: "#avg_values",
	template : _.template($('#questionnaires-averages-template').html()),
	tagName : "tr",
	
	render : function(){
		var RMSE_total, MWL_total, Questionnaire_Value_Total, Duration_Total, Intrusiveness_Total;
		var RMSE
		var that = this;
		var avgModel = new QuestionnairesAveragesModel();
		var stdModel = new QuestionnairesAveragesModel();
		var questionDeivationsView = new QuestionDeivationsView();
		
		_.each(this.collection.models, function(model){
			//rmse
			if( typeof RMSE_total === 'undefined'){
					RMSE_total = Number(model.get('details').rmse_value)}
				else{
					RMSE_total += Number(model.get('details').rmse_value)};
			
			//mwl
			if( typeof MWL_total === 'undefined'){
					MWL_total = Number(model.get('details').mwl_value)}
				else{
					MWL_total += Number(model.get('details').mwl_value)};
					
			//Questionnaire Value
			if( typeof Questionnaire_Value_Total === 'undefined'){
					Questionnaire_Value_Total = Number(model.get('questionnaireValue'))}
				else{
					Questionnaire_Value_Total += Number(model.get('questionnaireValue'))
					};
			
			//Duration Value
			if( typeof Duration_Total === 'undefined'){
					Duration_Total = Number(model.get('duration'))}
				else{
					Duration_Total += Number(model.get('duration'))};
					
			//Intrusivness Value
			if( typeof Intrusiveness_Total === 'undefined'){
					Intrusiveness_Total = Number(model.get('details').intrusiveness)}
				else{
					Intrusiveness_Total += Number(model.get('details').intrusiveness)};
					
		})
		
		//calculate averages
		var avg_rmse = RMSE_total / this.collection.length;
		var avg_mwl = MWL_total / this.collection.length;
		var avg_questionnaire_value = Questionnaire_Value_Total / this.collection.length;
		var avg_duration = Duration_Total / this.collection.length;
		var avg_intrusiveness = Intrusiveness_Total / this.collection.length;
		
		avgModel.set('avg_rmse', avg_rmse.toFixed(2));
		avgModel.set('avg_mwl', avg_mwl.toFixed(2));
		avgModel.set('avg_questionnaire_value', avg_questionnaire_value.toFixed(2));
		avgModel.set('avg_duration', avg_duration.toFixed(2));
		avgModel.set('avg_intrusiveness', avg_intrusiveness.toFixed(2));
		
		//standard deviations
		var std_rmse, std_mwl, std_questionnaire_value, std_duration, std_intrusiveness;
		_.each(this.collection.models, function(model){
		
			if( typeof std_rmse === 'undefined'){
				std_rmse = (Number(model.get('details').rmse_value) - avg_rmse) * 
				(Number(model.get('details').rmse_value) - avg_rmse)}
			else{
				std_rmse += (Number(model.get('details').rmse_value) - avg_rmse) * 
				(Number(model.get('details').rmse_value) - avg_rmse);
			};
			
			//mwl
			if( typeof std_mwl === 'undefined'){
					std_mwl = (Number(model.get('details').mwl_value ) - avg_mwl) * 
						(Number(model.get('details').mwl_value) - avg_mwl)}
				else{
					std_mwl += (Number(model.get('details').mwl_value) - avg_mwl) * 
						(Number(model.get('details').mwl_value) - avg_mwl)};
						
			//Questionnaire Value
			if( typeof std_questionnaire_value === 'undefined'){
					std_questionnaire_value = (Number(model.get('questionnaireValue')) - avg_questionnaire_value) * 
						(Number(model.get('questionnaireValue'))  - avg_questionnaire_value)}
				else{
					std_questionnaire_value += (Number(model.get('questionnaireValue'))  - avg_questionnaire_value) *
						(Number(model.get('questionnaireValue')) - avg_questionnaire_value)};
			
			//Duration Value
			if( typeof std_duration === 'undefined'){
					std_duration = (Number(model.get('duration')) - avg_duration) * 
						(Number(model.get('duration'))  - avg_duration)}
				else{
					std_duration += (Number(model.get('duration'))  - avg_duration) *
						(Number(model.get('duration'))  - avg_duration)};
						
			//Intrusivness Value
			if( typeof std_intrusiveness === 'undefined'){
					std_intrusiveness = (Number(model.get('details').intrusiveness) - avg_intrusiveness) *
						(Number(model.get('details').intrusiveness))}
				else{
					std_intrusiveness += (Number(model.get('details').intrusiveness)) *
						(Number(model.get('details').intrusiveness) - avg_intrusiveness)};
		})
		
		std_rmse = Math.sqrt(std_rmse / that.collection.length);
		std_mwl = Math.sqrt(std_mwl / that.collection.length);
		std_questionnaire_value = Math.sqrt(std_questionnaire_value / that.collection.length);
		std_duration = Math.sqrt(std_duration / that.collection.length);
		std_intrusiveness = Math.sqrt(std_intrusiveness / that.collection.length);
		
		//set to model
		stdModel.set('std_rmse', std_rmse.toFixed(2));
		stdModel.set('std_mwl', std_mwl.toFixed(2));
		stdModel.set('std_questionnaire_value', std_questionnaire_value.toFixed(2));
		stdModel.set('std_duration', std_duration.toFixed(2));
		stdModel.set('std_intrusiveness', std_intrusiveness.toFixed(2));

		this.$el.append(this.template(avgModel.toJSON()));
		
		questionDeivationsView.flush();
		questionDeivationsView.render(stdModel);
	},
	
	flush : function() {
		this.$el.empty(); // jquery method
	}
});

var QuestionnairesListView = Backbone.View.extend({
	el: '#task_1_table_body',
	render: function () {
		var that = this;
		
		_.each(this.collection.models, function(model) {

			var questionnairesListItemView = new QuestionnairesListItemView({
				model : model
			});

			questionnairesListItemView.render();
			var x = questionnairesListItemView.$el;
			that.$el.append(questionnairesListItemView.$el);
		})
		
		var questionnaireAveragesRowView = new QuestionnaireAveragesRowView({
					collection : this.collection
				});
		questionnaireAveragesRowView.flush();
		questionnaireAveragesRowView.render();
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

//Donut data View
var StudentsOfANationalitieView = Backbone.View.extend({
	el : $('#donut_window'),
	
	render : function() {
		var that = this;
		var nationalitiesListItemView = new NationalitiesListItemView({
			collection: this.collection
		});
		
		nationalitiesListItemView.flush();
		nationalitiesListItemView.render();
		
		var svg = d3.select("#donut_window").append("svg").attr("width",900).attr("height",500);
		svg.append("g").attr("id","salesDonut");
		Donut3D.draw("salesDonut", getData(), 300, 250, 200, 150, 30, 0.4);
		
		function getData(){
			return that.collection.map(function(d){
				return {label:d.get('country'), value:d.get('count'), color:d.get('color')};
			});
		}
		this.$el.prepend('<h3>Percentage of Stundent Nationailites</h3>');
	},
	
	flush : function() {
		this.$el.empty(); 
	}
});

//Donut Legend View
var NationalitiesListItemView = Backbone.View.extend({
	
	el : $('#legend_list'),
	tagName : "li",
	template : _.template($("#nationalitiesListItemTemplate").html()),

	render : function() {
	var that = this;
	var index = 0;
	
		_.each(this.collection.models, function(model) {
			var x = that.template(model.toJSON());
			that.$el.append(x);
			that.$el[0].childNodes[index].style.color = model.get('color');
			index++;
		})
	},
	
	flush : function() {
		this.$el.empty(); 
	}
});

var QuestionnairesByStudentsView = Backbone.View.extend({
	
	el : $('#task_3_content'),
	
	render : function(){
	
	this.$el.prepend('<h3>Number of Questionnaires answered per Student</h3>');
	var data = this.collection.toJSON();

	var margin = {
			top : 20,
			right : 20,
			bottom : 200,
			left : 40
		}, width = 1300 - margin.left - margin.right, height = 500 - margin.top
				- margin.bottom;

		var x = d3.scale.ordinal().rangeRoundBands([ 0, width ], .1);

		var y = d3.scale.linear().range([ height, 0 ]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.ticks(10);

		var svg = d3.select("#task_3_content")
			.append("svg")
				.attr("id","barChart")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			.append("g").attr("transform","translate(" + margin.left + "," + margin.top + ")");

		x.domain(data.map(function(d) {
			return d.student_number;
		}));
		
		y.domain([ 0, d3.max(data, function(d) {
			return d.num_questionnaires;
		}) ]);

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform","translate(0," + height + ")")
				.call(xAxis)
				.selectAll("text")
				.style("text-anchor", "end")
			.attr("dx", "-.6em")
			.attr("dy","-.5em")
			.attr("transform", function(d) {
						return "rotate(-90)"
						});

		svg.append("g")
			.attr("class", "y axis")
				.call(yAxis)
			.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy",".71em")
				.style("text-anchor", "end")
				.text("Total");

		svg.selectAll(".bar")
			.data(data)
			.enter()
			.append("rect")
				.attr("class","bar")
				.attr("x", function(d) {return x(d.student_number);})
				.attr("width", x.rangeBand())
				.attr("y", function(d) {return y(d.num_questionnaires);})
				.attr("height", function(d) {
					return height - y(d.num_questionnaires);
				});
	},
	
	flush : function() {
		this.$el.empty(); 
	}
	
});

var QuestionnairesByTaskView = Backbone.View.extend({
	el : $('#task_5_content'),
	
	flush : function() {
		this.$el.empty(); 
	},
	
	render : function(){
		
		this.$el.prepend('<h3>Hierarchical chart of questionnaires answered per task</h3>');
		var data = this.collection.toJSON();
	
		var m = [30, 10, 10, 30],
		w = 1200 - m[1] - m[3],
		h = 400 - m[0] - m[2];

		var format = d3.format(",.0f");

		var x = d3.scale.linear().range([0, w]);
		var y = d3.scale.ordinal().rangeRoundBands([0, h], .1);

		var xAxis = d3.svg.axis().scale(x).orient("top").tickSize(-h),
			yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

		var svg = d3.select("#task_5_content")
			.append("svg")
				.attr("width", w + m[1] + m[3])
				.attr("height", h + m[0] + m[2])
			.append("g")
				.attr("transform", "translate(" + m[3] + "," + m[0] + ")");

	  // Parse numbers, and sort by value.
	  data.forEach(function(d) { d.num_questionnaires = +d.num_questionnaires; });
	  data.sort(function(a, b) { return b.num_questionnaires - a.num_questionnaires; });

	  // Set the scale domain.
	  x.domain([0, d3.max(data, function(d) { return d.num_questionnaires; })]);
	  y.domain(data.map(function(d) { return d.task_number; }));

	  var bar = svg.selectAll("g.bar")
		  .data(data)
		.enter().append("g")
		  .attr("class", "bar")
		  .attr("transform", function(d) { 
		  return "translate(0," + y(d.task_number) + ")"; });

	  bar.append("rect")
		  .attr("width", function(d) { return x(d.num_questionnaires); })
		  .attr("height", y.rangeBand());

	  bar.append("text")
		  .attr("class", "value")
		  .attr("x", function(d) { return x(d.num_questionnaires); })
		  .attr("y", y.rangeBand() / 2)
		  .attr("dx", -3)
		  .attr("dy", ".35em")
		  .attr("text-anchor", "end")
		  .text(function(d) { return (d.task_number); });

	  svg.append("g")
		  .attr("class", "x axis")
		  .call(xAxis);

	  svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis);
	}

});

var router = new AppRouter();
Backbone.history.start();

//calculate time passing in two strings
function getMinutes( start, end )
{
	var startHours, startMins, startSecs;
	var endHours, endMins, endSecs;
	var startDate, endDate;
	var duration;
	
	startHours = parseInt(start.substring(0,2));
	startMins = parseInt(start.substring(3,5));
	startSecs = parseInt(start.substring(6,8));
	
	endHours = parseInt(end.substring(0,2));
	endMins = parseInt(end.substring(3,5));
	endSecs = parseInt(end.substring(6,8));
	
	startDate = new Date(1970, 1, 1, startHours, startMins, startSecs, 0);
	endDate = new Date(1970, 1, 1, endHours, endMins, endSecs, 0);
	
	duration = (endDate - startDate )/ (1000 * 60 );
	return duration;
}

//create random color
function generateColor(){
	var newColor = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
	return newColor;
}
