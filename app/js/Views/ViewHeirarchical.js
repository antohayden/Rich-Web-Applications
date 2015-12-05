
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