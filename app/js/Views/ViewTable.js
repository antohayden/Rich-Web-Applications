/*
* Backbone Views for tabled data
* */

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
        this.$el.empty();
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