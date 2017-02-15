//Donut data View
var StudentsOfANationalitieView = Backbone.View.extend({

    that: this,

    el : $('#donut_window'),

    render : function() {
        var that = this;
        var nationalitiesListItemView = new NationalitiesListItemView({
            collection: this.collection
        });

        nationalitiesListItemView.flush();
        nationalitiesListItemView.render();

        var width = Math.floor($(window).width());

        var viewBoxCenter = width / 4;
        var pieChartWidth = width / 5;
        var viewBoxScale = width / 2;
        var viewBox = "0, 0 " + viewBoxScale + " " + viewBoxScale;

        var svg = d3.select("#donut_window")
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", viewBox)
            .classed("svg-content", true);

        svg.append("g").attr("id","salesDonut");
        //function(id, data, x /*center x*/, y/*center y*/, rx/*radius x*/, ry/*radius y*/, h/*height*/, ir/*inner radius*/
        Donut3D.draw("salesDonut", getData(), viewBoxCenter, viewBoxCenter, pieChartWidth, pieChartWidth, 60, 0.4);

        function getData(){
            return that.collection.map(function(d){
                return {label:d.get('country'), value:d.get('count'), color:d.get('color')};
            });
        }
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