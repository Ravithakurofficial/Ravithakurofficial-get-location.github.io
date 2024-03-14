// Initialize the platform object
var platform = new H.service.Platform({
  'apikey': 'p7h735_8lH9w49kBYsEY1pvkAz97Gd7pMvK9D013aGk'
});

let map;

navigator.geolocation.getCurrentPosition(position => {
  const { latitude, longitude } = position.coords;


  

  // Center the map on user's location
  map = new H.Map(
    document.getElementById('mapContainer'),
    platform.createDefaultLayers().vector.normal.map,
    {
      zoom: 15, // Adjust zoom level for better user location visibility
      center: { lat: latitude, lng: longitude }
    }
  );
  var yourlocationmarker = new H.map.Marker({ lat: latitude, lng: longitude });
  map.addObject(yourlocationmarker);
});

document.getElementById("zoomInButton").addEventListener("click", function() {
  var zoom = map.getZoom();
  map.setZoom(zoom + 1);
});

document.getElementById("zoomOutButton").addEventListener("click", function() {
  var zoom = map.getZoom();
  map.setZoom(zoom - 1);
});
