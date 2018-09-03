function init() {
    $('#graph').empty();
    var docu = document.getElementById('graph');

    color = ["#01DF3A", "#F7819F", "#dddddd"];


    var width = docu.clientWidth,
        height = docu.clientHeight,
        centered,
        update = false,
        clickBool = false;


    var path = d3.geo.path()
        .projection(null);

    var svg = d3.select("#graph").append("svg")
        .attr("width", width)
        .attr("height", height);

    var graph = d3.select("#graph").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", clicked);


    var g = svg.append("g")
        .attr("width", "")
        .attr("height", "");

    d3.json("lib/json/tg-municipalities-lakes.json", function (error, tg) {
        g.append("g")
            .attr("id", "municipalities")
            .selectAll("path")
            .data(topojson.feature(tg, tg.objects.municipalities).features)
            .enter().append("path")
            .attr("d", path)
            .on("click", clicked)
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .attr("fill", function (d) {

                var gemeindeName = "";

                for (let j = 0; j < muniArr.length; j++) {
                    if (d.id === muniArr[j][0]) {
                        gemeindeName = muniArr[j][1];
                        break;
                    }
                }

                selectedOption = parseInt(document.getElementById('options').value);
                if (!isNaN(selectedOption) && selectedOption !== null) {
                    var name = arrayG[selectedOption][1];
                    for (let i = 0; i < arrayG.length; i++) {
                        if (arrayG[i][1] === name && arrayG[i][7] === gemeindeName) {
                            var colorChooser = arrayG[i][13] - arrayG[i][14];

                            if (colorChooser < 0) {
                                return color[1];
                            } else if (colorChooser === 0) {
                                return color[3];
                            } else {
                                return color[0];
                            }
                        }
                    }
                }
            });


        g.append("g")
            .attr("id", "lakes")
            .selectAll("path")
            .data(topojson.feature(tg, tg.objects.lakes).features)
            .enter().append("path")
            .attr("d", path);

        g.append("path")
            .datum(topojson.mesh(tg, tg.objects.municipalities, function (a, b) {
                return a !== b;
            }))
            .attr("id", "border")
            .style("stroke-width", "1px")
            .attr("d", path);
    });

    function clicked(d) {
        var x, y, k;
        if (d && centered !== d) {
            var centroid = path.centroid(d);
            x = centroid[0];
            y = centroid[1];
            k = 4;
            centered = d;

            clickBool = true;
            sendData(centered);

            console.log(d.id + ": Surprise Motherfucker");
        } else {
            x = width / 2;
            y = height / 2;
            k = 1;
            centered = null;

            update = false;
            clickBool = false;

            console.log(d.id + ": bitch I'm out");
        }
        g.selectAll("path")
            .classed("active", centered && function (d) {
                return d === centered;
            });
        g.transition()
            .duration(750)
            // .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1.5 / k + "px");
    }

    function mouseover(d) {
        graph.style("opacity", .9)
            .html(getMName(d) + "<br> Einwohnerzahl: " + getMPopulation(d))
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");

    }

    function mouseout(d) {
        graph.style("opacity", 0)
            .html();
    }

    function sendData(d) {
        for (i = 0; i < muniArr.length; i++) {
            if (d.id === muniArr[i][0]) {
                console.log(muniArr[i][1]);
                getData(i);
            }
        }
    }

    function getMName(d) {
        for (i = 0; i < muniArr.length; i++) {
            if (d.id === muniArr[i][0]) {
                return muniArr[i][1] || d.id;

            }
        }
    }

    function getMPopulation(d) {
        for (i = 0; i < muniArr.length; i++) {
            if (d.id === muniArr[i][0]) {
                return muniArr[i][2];
            }
        }
    }
}


function drawChart(gemeinde, i) {
    var ctx = document.getElementById('myChart').getContext('2d');

    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'doughnut',

        // The data for our dataset
        data: {
            labels: ["Ja", "Nein"],
            datasets: [{
                label: "Abstimmung in der Gemeinde " + gemeinde,
                backgroundColor: ['rgb(77, 219, 124)', 'rgb(219, 77, 77)'],
                borderColor: 'rgb(255, 99, 132)',
                data: [arrayG[i][13], arrayG[i][14]],

            }]
        },

        // Configuration options go here
        options: {
            hover: {mode: null}
        }
    });


}

