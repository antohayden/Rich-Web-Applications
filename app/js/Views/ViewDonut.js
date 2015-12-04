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