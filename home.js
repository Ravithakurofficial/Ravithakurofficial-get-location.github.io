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
  var yourLocationMarker = new H.map.Marker({ lat: latitude, lng: longitude });
  map.addObject(yourLocationMarker);
});

document.getElementById("zoomInButton").addEventListener("click", function() {
  var zoom = map.getZoom();
  map.setZoom(zoom + 1);
});

document.getElementById("zoomOutButton").addEventListener("click", function() {
  var zoom = map.getZoom();
  map.setZoom(zoom - 1);
});

function submitDestination() {
  let destinationInput = document.getElementById("destinationInput").value;

  // Use Geocoding API to get latitude and longitude of the destination
  var service = platform.getSearchService();
  service.geocode({ q: destinationInput }, (result) => {
    if (result.items.length > 0) {
      let destination = result.items[0].position.lat + ',' + result.items[0].position.lng;
      console.log("Destination coordinates:", destination);
      calculateRoute(destination); // Calculate the route with the geocoded destination
    } else {
      alert("Destination not found!");
    }
  }, (error) => {
    console.error("Error fetching geocode data:", error);
    alert("Error fetching geocode data. Please try again later.");
  });
}

let onError = (error) => {
  alert(error.message);
}

// create an instance of the routing service and make a request
let router = platform.getRoutingService(null, 8);

// Define a callback function to process the routing response:
let onResult = function(result) {
  // ensure that at least one route was found
  if (result.routes.length) {
    result.routes[0].sections.forEach((section) => {
      // Create a linestring to use as a point source for the route line
      let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

      // Create a polyline to display the route:
      let routeLine = new H.map.Polyline(linestring, {
        style: { strokeColor: 'blue', lineWidth: 3 }
      });

      // Create a marker for the start point:
      let startMarker = new H.map.Marker(section.departure.place.location);

      // Create a marker for the end point:
      let endMarker = new H.map.Marker(section.arrival.place.location);

      // Add the route polyline and the two markers to the map:
      map.addObjects([routeLine, startMarker, endMarker]);

      // Set the map's viewport to make the whole route visible:
      map.getViewModel().setLookAtData({bounds: routeLine.getBoundingBox()});
    });
  }
};

let routingParameters = {
  'transportMode': 'car',
  // Include the route shape in the response
  'return': 'polyline'
};

// Define a callback that calculates the route
let calculateRoute = (destination) => {
  // Make sure that destination is present
  if (!destination) return;

  // Add origin and destination to the routing parameters
  routingParameters.destination = destination;

  // Assuming origin is already calculated
  // Call the router service to calculate the route
  router.calculateRoute(routingParameters, onResult, onError);
}
