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
        Donut3D.draw("salesDonut", getData(), 400, 200, 300, 200, 30, 0.4);

        function getData(){
            return that.collection.map(function(d){
                return {label:d.get('country'), value:d.get('count'), color:d.get('color')};
            });
        }
        this.$el.prepend('<h3>Percentage of Student Nationalities</h3>');
    },

    flush : function() {
        this.$el.empty();
    }
});

//Donut Legend View
var NationalitiesListItemView = Backbone.View.extend({

    el : $('#legend_list'),
    tagName : "div",
    template : _.template($("#nationalitiesListItemTemplate").html()),

    render : function() {
        var that = this;
        var index = 0;

        _.each(this.collection.models, function(model) {
            var x = that.template(model.toJSON());
            that.$el.append(x);
            that.$el[0].childNodes[index].style.background = model.get('color');
            that.$el[0].childNodes[index].style.border = "solid black 1px";
            that.$el[0].childNodes[index].style.color = "white";
            that.$el[0].childNodes[index].style.display = "inline-block";
            that.$el[0].childNodes[index].style.width = "49%";
            that.$el[0].childNodes[index].style.margin = "0.5px";
            that.$el[0].childNodes[index].style.textShadow= "1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000";
            index++;
        })
    },

    flush : function() {
        this.$el.empty();
    }
});