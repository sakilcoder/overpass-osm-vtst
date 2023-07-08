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