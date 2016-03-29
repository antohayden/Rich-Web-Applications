var TaskPerCourseView = Backbone.View.extend({

    el : $('#task_4_window'),


    flush : function() {
        this.$el.empty();
    },

    render : function(){

        this.$el.prepend('<h3>Tasks completed per Course</h3>');
        var data = this.collection.toJSON();

        var diameter = 700;

        var svg = d3.select('#task_4_content').append('svg')
            .attr('width', diameter)
            .attr('height', diameter);

        var bubble = d3.layout.pack()
            .size([diameter, diameter])
            .padding(3)
            .value(function(d) {return d.size;});

        var nodes = bubble.nodes(processData(data))
            .filter(function(d) { return !d.children; });

        var vis = svg.selectAll('circle')
            .data(nodes, function(d) { return d.name; });

        vis.enter().append('circle')
            .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
            .attr('r', function(d) {
                return d.r; })
            .attr('class', function(d) { return d.className; })
            .append("svg:title")
            .text(function(d) {return "duration : "+ d.size + " mins";})
            .data("test");



        function processData(data) {
            var obj = data;

            var newDataSet = [];

            for(var prop in obj) {
                var sheet = document.styleSheets[0];
                sheet.addRule(".course_"+ obj[prop].course_id, "fill:" + obj[prop].color , 1);

                newDataSet.push({
                    name: obj[prop].task_id,
                    className: "course_" + obj[prop].course_id,
                    size: parseInt(obj[prop].duration_mins)}
                );
            }
            return {children: newDataSet};
        }


    }

});

var CoursesLegendView = Backbone.View.extend({

    el : $('#task_4_legend'),
    tagName : "div",
    template : _.template($("#bubbleListItemTemplate").html()),

    render : function() {
        var that = this;
        var index = 0;

        _.each(this.collection.models, function(model) {
            var x = that.template(model.toJSON());
            that.$el.append(x);
            that.$el[0].childNodes[index].style.backgroundColor = model.get("color");
            that.$el[0].childNodes[index].style.border = "solid black 1px";
            that.$el[0].childNodes[index].style.color = "white";
            that.$el[0].childNodes[index].style.display = "inline-block";
            that.$el[0].childNodes[index].style.width = "49%";
            that.$el[0].childNodes[index].style.margin = "0.5px";
            that.$el[0].childNodes[index].style.fontSize = "2vh";
            that.$el[0].childNodes[index].style.textShadow= "1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000";
            index++;
        })
    },

    flush : function() {
        this.$el.empty();
    }

});