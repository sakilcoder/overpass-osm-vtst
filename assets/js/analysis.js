
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
            drawBuildings(buildings);
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
            let roads=data.elements;
            drawRoads(roads);
        })
        .catch(error => {
            console.error('Error fetching OSM data:', error);
        });
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

    }
}

let roadFeatures = new L.FeatureGroup().addTo(map);
let drawRoads = function (roads) {
    console.log(roads);
    roadFeatures.clearLayers();
    
    for (var i = 0; i < roads.length; i++) {
        let rg = roads[i].geometry;
        let roadLtLns=[];
        rg.forEach(r => {
            console.log(r);
            roadLtLns.push([r.lat, r.lon]);
        });
        if(roads[i].tags==='residential'){
            var road = L.polyline(roadLtLns, { color: "blue", weight: 1 }).addTo(roadFeatures);
        }else{
            var road = L.polyline(roadLtLns, { color: "blue", weight: 5 }).addTo(roadFeatures);
        }
        
        
    }
    
    
}