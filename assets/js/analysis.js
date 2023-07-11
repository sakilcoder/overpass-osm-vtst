


let fetchBuildingData = function (bounds, poly) {
    const overpassQuery = `
    [out:json];
    way["building"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
    out geom;
    `;

    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    fetch(overpassUrl)
        .then(response => response.json())
        .then(data => {
            const buildings = data.elements.filter(element => element.type === 'way');
            // console.log(buildings);
            roadjs = {
                "type": "FeatureCollection",
                "features": []
            }
            buildingjs = {
                "type": "FeatureCollection",
                "features": []
            }
            let filteredBuildings = filterBuildings(buildings, poly);
            drawBuildings(filteredBuildings);
            fetchPrimaryRoadData(bounds, poly);
        })
        .catch(error => {
            console.error('Error fetching OSM data:', error);
        });
}

let fetchPrimaryRoadData = function (bounds, polygon) {
    const overpassQuery = `
    [out:json];
    way["highway"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
    out geom;
    `;
    // "highway"="residential"
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    fetch(overpassUrl)
        .then(response => response.json())
        .then(data => {
            let roads = data.elements;
            let filteredRoads = filterRoads(roads, bounds);
            // drawRoads(filteredRoads);
            drawBuildingConnectedRoads();
        })
        .catch(error => {
            console.error('Error fetching OSM data:', error);
        });
}

let fetchSecondaryRoadData = function (bounds) {

    var overpassQuery = `
    [out:json];
    (
        way["highway"="residential"]
        ["building"="house"]
        (around:500)(${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
        
    );
    out geom;`;

    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    fetch(overpassUrl)
        .then(response => response.json())
        .then(data => {
            let roads = data.elements;
            // console.log(roads);


        })
        .catch(error => {
            console.error('Error fetching OSM data:', error);
        });
}


let drawBuildingConnectedRoads = function () {
    buildingRoads.clearLayers();
    buildingFeatures.eachLayer(function (marker) {
        // console.log(marker);
        let nearestPoints = [];
        roadFeatures.eachLayer(function (road) {
            // console.log(road);
            var nearestLine = turf.nearestPointOnLine(road.toGeoJSON(), marker.toGeoJSON());
            nearestPoints.push(turf.point(nearestLine.geometry.coordinates))
        });

        const nearestPoint = turf.nearestPoint(marker.toGeoJSON(), turf.featureCollection(nearestPoints));

        var distance = turf.distance(turf.point(marker.toGeoJSON().geometry.coordinates), turf.point(nearestPoint.geometry.coordinates), { units: 'meters' });
        if (distance < 40) {
            let feature = {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        marker.toGeoJSON().geometry.coordinates,
                        nearestPoint.geometry.coordinates
                    ]
                },
                properties: {
                    color: 'blue',
                    weight: 1,
                    name: 'connecting'
                }
            }
            var connectingLine = L.geoJSON(feature).addTo(buildingRoads);
            roadjs.features.push(feature);
        }



    });

    drawSvgMap();
}


let drawBuildings = function (buildings) {
    buildingFeatures.clearLayers();
    const circleMarker = L.geoJSON(buildings, {
        pointToLayer: function (feature, latlng) {
            L.circleMarker([latlng.lng, latlng.lat], { radius: 2, color: 'blue', fillOpacity: 1 }).addTo(buildingFeatures);
        }
    });

    for (var i = 0; i < buildings.features.length; i++) {
        let b = {
            "type": "Feature",
            "geometry": {
                "coordinates": [buildings.features[i].geometry.coordinates[1], buildings.features[i].geometry.coordinates[0]],
                "type": "Point"
            }
        }
        buildingjs.features.push(b);
    }
}

let drawRoads = function (roads) {
    // console.log(roads);
    roadFeatures.clearLayers();

    // for (var i = 0; i < roads.length; i++) {
    //     let rg = roads[i].geometry;
    //     let roadLtLns = [];
    //     // console.log(roads[i].tags.highway);
    //     rg.forEach(r => {
    //         // console.log(r);
    //         roadLtLns.push([r.lat, r.lon]);
    //     });
    //     if (roads[i].tags.highway === 'residential') {
    //         var road = L.polyline(roadLtLns, { color: "blue", weight: 2 }).addTo(roadFeatures);
    //         let feature = road.toGeoJSON();
    //         feature.properties.name = 'residential';
    //         roadjs.features.push(feature);
    //     } else {
    //         var road = L.polyline(roadLtLns, { color: "blue", weight: 4 }).addTo(roadFeatures);
    //         let feature = road.toGeoJSON();
    //         feature.properties.name = 'primary';
    //         roadjs.features.push(feature);
    //     }


    // }

}