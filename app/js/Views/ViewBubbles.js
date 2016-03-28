var TaskPerCourseView = Backbone.View.extend({

    el : $('#task_4_content'),


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
            .padding(3) // padding between adjacent circles
            .value(function(d) {return d.size;}) ;// new data will be loaded to bubble layout

        var nodes = bubble.nodes(processData(data))
            .filter(function(d) { return !d.children; }); // filter out the outer bubble

        var vis = svg.selectAll('circle')
            .data(nodes, function(d) { return d.name; });

        vis.enter().append('circle')
            .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
            .attr('r', function(d) { return d.r; })
            .attr('class', function(d) { return d.className; })
            .append("svg:title")
            .text(function(d) {return "duration : "+ d.size + " mins";});



        function processData(data) {
            console.log(data);
            var obj = data;

            var newDataSet = [];

            for(var prop in obj) {
                var sheet = document.styleSheets[0];
                sheet.addRule(".course_"+ obj[prop].course_id, "fill:" + generateColor() , 1);

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