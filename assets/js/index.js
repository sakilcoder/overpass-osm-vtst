// Create the map
var map = L.map('gmap').setView([53.44942, -6.14343], 18); // 54.63727450443948, lng: -5.541127751271631

var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(map);

var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

let roadjs = {
    "type": "FeatureCollection",
    "features": []
}
let buildingjs = {
    "type": "FeatureCollection",
    "features": []
}

let roadFeatures = new L.FeatureGroup().addTo(map);
let buildingRoads = new L.FeatureGroup().addTo(map);
let buildingFeatures = new L.FeatureGroup().addTo(map);

// map.on('click', function(e){
//     console.log(e);
// });
