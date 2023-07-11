let getStrokeWidth = function (road) {
    if (road === 'connecting')
        return 1;
    else if (road === 'residential')
        return 3;
    else
        return 5;
}

let drawSvgMap = function () {
    // console.log(buildingjs.features[0].geometry.coordinates[1]);
    document.getElementById('smap').innerHTML = '<svg id="svgmap" style="width: 100%; height: 400px"></svg>';

    var body = d3.select("body").node().getBoundingClientRect();
    var w = body.width;
    var h = 400;

    const svg = d3.select('#svgmap');
    const projection = d3.geoMercator()
        .fitSize([w, h], roadjs);

    svg.selectAll('path')
        .data(roadjs.features)
        .enter()
        .append('path')
        .attr('d', d3.geoPath().projection(projection))
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', function (d) {
            var road = d.properties.name;
            return getStrokeWidth(road);
        });

    svg.selectAll('text')
        .data(buildingjs.features)
        .enter()
        .append('text')
        .attr('x', d => projection(d.geometry.coordinates)[0])
        .attr('y', d => projection(d.geometry.coordinates)[1])
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('fill', 'red')
        .text('x');

    // svg.selectAll('circle')
    //     .data(buildingjs.features)
    //     .enter()
    //     .append('circle')
    //     .attr('cx', d => projection(d.geometry.coordinates)[0])
    //     .attr('cy', d => projection(d.geometry.coordinates)[1])
    //     .attr('r', 4)
    //     .attr('fill', 'red')
    //     .attr('stroke', 'white')
    //     .attr('stroke-width', 1);

    svg.node();
}