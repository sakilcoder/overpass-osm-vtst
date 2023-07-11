function filterBuildings(buildings, polygon) {
  const polygonCoordinates = polygon.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng]);
  polygonCoordinates.push(polygonCoordinates[0]);
  const turfPolygon = turf.polygon([polygonCoordinates]);

  let points = [];
  for (i = 0; i < buildings.length; i++) {
    let bg = buildings[i].geometry;
    points.push(turf.point([bg[0].lat, bg[0].lon]));
  }
  let turfPoints = turf.featureCollection(points);
  const pointsWithinPolygon = turf.pointsWithinPolygon(turfPoints, turfPolygon);
  return pointsWithinPolygon;
}

function filterRoads(roads, bounds) {

  var southWest = bounds.getSouthWest();
  var northEast = bounds.getNorthEast();
  var bbox = [southWest.lng, southWest.lat, northEast.lng, northEast.lat];

  roadFeatures.clearLayers();

  for (var i = 0; i < roads.length; i++) {
    let rg = roads[i].geometry;
    let roadLtLns = [];

    rg.forEach(r => {
      roadLtLns.push([r.lon, r.lat]);
    });

    const turfLine = turf.lineString(roadLtLns);
    var clippedRoad = turf.bboxClip(turfLine, bbox);

    let switchLatLon=[];

    clippedRoad.geometry.coordinates.forEach(c => {
      switchLatLon.push([c[1], c[0]]);
    });
    if (roads[i].tags.highway === 'residential' || roads[i].tags.highway === 'footway') {
      var road = L.polyline(switchLatLon, {color: 'blue', weight: 3}).addTo(roadFeatures);
      let feature = road.toGeoJSON();
      feature.properties.name = 'residential';
      roadjs.features.push(feature);
    } else {
      var road = L.polyline(switchLatLon, {color: 'blue', weight: 5}).addTo(roadFeatures);
      let feature = road.toGeoJSON();
      feature.properties.name = 'primary';
      roadjs.features.push(feature);
    }
  }

  // console.log(roadjs);
  return roadjs;

}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;
  return distance;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function findNearestPoint(targetLat, targetLon, points) {
  let nearestPoint;
  let shortestDistance = Infinity;

  for (let i = 0; i < points.length; i++) {
    const [lat, lon] = points[i];
    const distance = calculateDistance(targetLat, targetLon, lat, lon);

    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestPoint = points[i];
    }
  }

  return nearestPoint;
}