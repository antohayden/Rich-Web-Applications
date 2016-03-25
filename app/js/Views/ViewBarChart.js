var QuestionnairesByStudentsView = Backbone.View.extend({

    el : $('#task_3_content'),

    render : function(){
        var data = this.collection.toJSON();

        var margin = {
            top : 20,
            right : 20,
            bottom : 250,
            left : 20
        }, width = 1600 - margin.left - margin.right, height = 500 - margin.top
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
            .attr("x",
            function(d) {
                return x(d.student_number);
            })
            .attr("width", x.rangeBand())
            .attr("y", function(d) {
                return y(d.num_questionnaires);}
        )
            .attr("height", function(d) {
                return height - y(d.num_questionnaires);
            })
            .append("svg:title")
            .text(function(d) {return d.num_questionnaires;});
    },

    flush : function() {
        this.$el.empty();
    }

});