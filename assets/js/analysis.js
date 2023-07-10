
let fetchBuildingData = function (bounds) {
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
            drawBuildings(buildings);
            fetchPrimaryRoadData(bounds);
        })
        .catch(error => {
            console.error('Error fetching OSM data:', error);
        });
}

let fetchPrimaryRoadData = function (bounds) {
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
            drawRoads(roads);
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

let buildingRoads = new L.FeatureGroup().addTo(map);
let drawBuildingConnectedRoads = function () {
    buildingRoads.clearLayers();
    buildingFeatures.eachLayer(function (marker) {
        let nearestPoints = [];
        roadFeatures.eachLayer(function (road) {
            // console.log(road.toGeoJSON());
            var nearestLine = turf.nearestPointOnLine(road.toGeoJSON(), marker.toGeoJSON());
            nearestPoints.push(turf.point(nearestLine.geometry.coordinates))
        });

        const nearestPoint = turf.nearestPoint(marker.toGeoJSON(), turf.featureCollection(nearestPoints));

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

    });

    drawSvgMap();
}

let buildingFeatures = new L.FeatureGroup().addTo(map);
let drawBuildings = function (buildings) {
    // console.log(buildings);
    buildingFeatures.clearLayers();
    for (var i = 0; i < buildings.length; i++) {
        let bg = buildings[i].geometry;
        var latLng = L.latLng([bg[0].lat, bg[0].lon]);
        L.circleMarker(latLng, { radius: 2, color: 'blue', fillOpacity: 1 }).addTo(buildingFeatures);
        // L.marker(latLng).addTo(buildingFeatures);

        let b = {
            "type": "Feature",
            "geometry": {
              "coordinates": [bg[0].lon, bg[0].lat],
              "type": "Point"
            }
          }
          buildingjs.features.push(b);
    }
}

let roadFeatures = new L.FeatureGroup().addTo(map);
let drawRoads = function (roads) {
    // console.log(roads);
    roadFeatures.clearLayers();

    for (var i = 0; i < roads.length; i++) {
        let rg = roads[i].geometry;
        let roadLtLns = [];
        // console.log(roads[i].tags.highway);
        rg.forEach(r => {
            // console.log(r);
            roadLtLns.push([r.lat, r.lon]);
        });
        if (roads[i].tags.highway === 'residential') {
            var road = L.polyline(roadLtLns, { color: "blue", weight: 2 }).addTo(roadFeatures);
            let feature = road.toGeoJSON();
            feature.properties.name = 'residential';
            roadjs.features.push(feature);
        } else {
            var road = L.polyline(roadLtLns, { color: "blue", weight: 4 }).addTo(roadFeatures);
            let feature = road.toGeoJSON();
            feature.properties.name = 'primary';
            roadjs.features.push(feature);
        }


    }

}