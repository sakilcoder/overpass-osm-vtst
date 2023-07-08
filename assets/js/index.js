// Create the map
var map = L.map('map').setView([54.63727450443948, -5.541127751271631], 16); // 54.63727450443948, lng: -5.541127751271631

var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
}).addTo(map);

var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

// map.on('click', function(e){
//     console.log(e);
// });
