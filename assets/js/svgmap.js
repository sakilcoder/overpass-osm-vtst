

let drawSvgMap = function () {
    console.log('ellepo');

    const width = document.getElementById('svgmap').clientWidth;
    const height = 400;

    // Create an SVG element within the map container
    const svg = d3.select('#svgmap')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const projection = d3.geoMercator()
        .fitSize([width, height], roadjs)
        .translate([width / 2, height / 2]);

    // Create a path generator
    const path = d3.geoPath().projection(projection);

    const transformedGeojson = {
        ...roadjs,
        features: roadjs.features.map(feature => ({
            ...feature,
            geometry: {
                ...feature.geometry,
                coordinates: feature.geometry.coordinates.map(coords => projection(coords))
            }
        }))
    };

    // Draw the map
    svg.selectAll('path')
        .data(roadjs.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style('fill', 'steelblue')
        .style('stroke', 'black')
        .style('stroke-width', 5);

}