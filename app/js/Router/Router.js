/*
* Backbone Router for various paths & views
* */

// Router
var AppRouter = Backbone.Router.extend({

    routes : {
        '' : 'home',
        "questionnaires" : "questionnaires",
        "nationalities" : "nationalities",
        "questionnairesPerStudent" : "questionnairesPerStudent",
        "questionnairesOfATask" : "questionnairesOfATask",
        "tasksOfACourse" : "tasksOfACourse"
    },

    home : function(){
    },

    questionnaires : function(){

        var questionnairesCount = new QuestionnairesCountByTaskCollection();
        var questionnairesByTaskCount = new BaseCollection();

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

                                    /*
                                     * Make sure the times are valid before adding, otherwise ignore
                                     * */
                                    var timeBetween = getMilliSecondsBetweenTime(model.get('time_1'), model.get('time_2'));

                                    if(timeBetween > 0)
                                        total_duration += timeBetween;

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

    },

    nationalities : function () {

        var nationalitiesCollection = new StudentNationalitiesCollection();
        var nationalitiesCountCollection = new BaseCollection();
        var studentsOfANationalitieView = new
            StudentsOfANationalitieView({
            collection : nationalitiesCountCollection
        });

        nationalitiesCollection.fetch({
            success: function() {
                _.each(nationalitiesCollection.models, function(model){

                    var studentsOfANationalitieCollection =
                        new StudentsOfANationalityCollection(model.get("description"));

                    studentsOfANationalitieCollection.fetch({
                        success : function(){
                            var nationalitiesCountModel = new BaseModel();
                            nationalitiesCountModel.set('country', model.get('description'));
                            nationalitiesCountModel.set('count', studentsOfANationalitieCollection.length);
                            nationalitiesCountModel.set('color', colorGenerator.getColor());
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
        
        var fetchCount;
        var count = 0;

        var studentsCollection = new StudentsCollection();
        var questionnairesByStudentsCount = new BaseCollection();
        var questionnairesByStudentsView = new
            QuestionnairesByStudentsView({
            collection : questionnairesByStudentsCount
        });

        studentsCollection.fetch({

            success : function(){

                fetchCount = studentsCollection.length;
                _.each(studentsCollection.models, function(model){

                    var questionnairesByAStudent = new QuestionnairesCollectionByStudentId(model.get('student_number'));

                    questionnairesByAStudent.fetch({

                        success : function(){
                            count++;
                            
                            questionnairesByStudentsCount.add({
                                'student_number' : model.get('student_number'),
                                'num_questionnaires' : questionnairesByAStudent.length
                            });

                            if (count === fetchCount){
                                questionnairesByStudentsView.flush();
                                questionnairesByStudentsView.render();
                            }
                        }
                    });
                })
            }
        })
    },

    tasksOfACourse: function(){

        var coursesCollections = new CoursesCollection();
        var tasksCollection = new TasksCollection();
        var tasksPerCourseView = new TaskPerCourseView({
            collection : tasksCollection
        });

        var coursesLegendView = new CoursesLegendView({
            collection : coursesCollections
        });

        tasksCollection.fetch({

            success : function(){

                coursesCollections.fetch({

                    success : function() {

                        _.each(coursesCollections.models, function(courseModel){

                            var color = colorGenerator.getColor();
                            courseModel.set("color", color);

                            _.each(tasksCollection.models, function(taskModel){
                                if(taskModel.get("course_id") === courseModel.get("id_course"))
                                   taskModel.set("color", color);
                            })
                        });

                        coursesLegendView.flush();
                        tasksPerCourseView.flush();
                        tasksPerCourseView.render();
                        coursesLegendView.render();
                    }
                });

            }
        });
    },

    questionnairesOfATask : function(){

        var tasksCollection = new TasksCollection();
        var questionnairesByTaskCount = new BaseCollection();
        var questionnairesByTaskView = new QuestionnairesByTaskView({
            collection : questionnairesByTaskCount
        });

        tasksCollection.fetch({
            success : function(){
                _.each(tasksCollection.models, function(model){
                    var questionnairesOfATask = new QuestionnairesCollectionByTaskId(model.get('task_id'));

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