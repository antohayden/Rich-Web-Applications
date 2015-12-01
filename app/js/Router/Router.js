/*
* Backbone Router for various paths & views
* */


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
    }

});