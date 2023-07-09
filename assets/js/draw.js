
var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

var MyCustomMarker = L.Icon.extend({
    options: {
        shadowUrl: null,
        iconAnchor: new L.Point(12, 12),
        iconSize: new L.Point(24, 24),
        iconUrl: 'assets/images/marker.png'
    }
});

var options = {
    position: 'topright',
    draw: {
        polyline: false,
        rectangle: {
            allowIntersection: false,
            drawError: {
                color: '#e1e100', 
                message: '<strong>Oh snap!<strong> you can\'t draw that!' 
            },
            shapeOptions: {
                color: '#bada55'
            }
        },
        circle: false, 
        polygon: false,
        marker: {
            icon: new MyCustomMarker()
        }
    },
    edit: {
        featureGroup: editableLayers, 
        edit: false
        // remove: false
    }
};

var drawControl = new L.Control.Draw(options);
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function (e) {
    editableLayers.clearLayers();
    var type = e.layerType,
        layer = e.layer;

    // console.log(layer);

    if (type === 'marker') {

    } else if (type === 'rectangle' || type === 'polygon') {

        let bbox=layer.getBounds();

        fetchBuildingData(bbox);
        
        
        
    }

    editableLayers.addLayer(layer);
});