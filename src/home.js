var platform = new H.service.Platform({
  'apikey': 'p7h735_8lH9w49kBYsEY1pvkAz97Gd7pMvK9D013aGk'
});

let map;

function initializeMap(latitude, longitude) {
  // Center the map on user's location
  const defaultLayers = platform.createDefaultLayers();
  map = new H.Map(
    document.getElementById('mapContainer'),
    defaultLayers.vector.normal.map, {
      zoom: 15, // Adjust zoom level for better user location visibility
      center: { lat: latitude, lng: longitude }
    }
  );

  var yourLocationMarker = new H.map.Marker({ lat: latitude, lng: longitude });
  map.addObject(yourLocationMarker);

  map.addLayer(defaultLayers.vector.traffic);

  const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

  // Create the default UI:
  const ui = H.ui.UI.createDefault(map, defaultLayers);

  // Continuously track user's location
  navigator.geolocation.watchPosition(position => {
    const { latitude, longitude } = position.coords;
    yourLocationMarker.setGeometry({ lat: latitude, lng: longitude });
    map.setCenter({ lat: latitude, lng: longitude });
  });
}

function submitDestination() {
  let destinationInput = document.getElementById("destinationInput").value;

  // Use Geocoding API to get latitude and longitude of the destination
  var service = platform.getSearchService();
  service.geocode({ q: destinationInput }, (result) => {
    if (result.items.length > 0) {
      let destination = result.items[0].position.lat + ',' + result.items[0].position.lng;
      console.log("Destination coordinates:", destination);
      calculateRoute(destination); // Calculate the route with the geocoded destination

      // Center the map on user's location after calculating the route
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        map.setCenter({ lat: latitude, lng: longitude });
      });
    } else {
      alert("Destination not found!");
    }
  }, (error) => {
    console.error("Error fetching geocode data:", error);
    alert("Error fetching geocode data. Please try again later.");
  });
  service.geocode(
    { q: destinationInput },
    (result) => {
      if (result.items.length > 0) {
        let destination =
          result.items[0].position.lat + "," + result.items[0].position.lng;
        console.log("Destination coordinates:", destination);
        calculateRoute(destination); // Calculate the route with the geocoded destination
      } else {
        alert("Destination not found!");
      }
    },
    (error) => {
      console.error("Error fetching geocode data:", error);
      alert("Error fetching geocode data. Please try again later.");
    }
  );
}

let onError = (error) => {
  alert(error.message);
};

// create an instance of the routing service and make a request
let router = platform.getRoutingService(null, 8);

// Define a callback function to process the routing response:
let onResult = function (result) {
  // Clear previous routes
  map.removeObjects(map.getObjects());

  // ensure that at least one route was found
  if (result.routes.length) {
    result.routes[0].sections.forEach((section) => {
      // Create a linestring to use as a point source for the route line
      let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

      // Create a polyline to display the route:
      let routeLine = new H.map.Polyline(linestring, {
        style: { strokeColor: "blue", lineWidth: 3 },
      });

      // Create a marker for the start point:
      let startMarker = new H.map.Marker(section.departure.place.location);

      // Create a marker for the end point:
      let endMarker = new H.map.Marker(section.arrival.place.location);

      // Add the route polyline and the two markers to the map:
      map.addObjects([routeLine, startMarker, endMarker]);

      // Set the map's viewport to make the whole route visible:
      map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
    });
  }
};

let routingParameters = {
  transportMode: "car",
  // Include the route shape in the response
  return: "polyline",
};

// Define a callback that calculates the route
let calculateRoute = (destination) => {
  // Make sure that destination is present
  if (!destination) return;

  // Add origin and destination to the routing parameters
  routingParameters.origin = map.getCenter().lat + "," + map.getCenter().lng;
  routingParameters.destination = destination;

  // Call the router service to calculate the route
  router.calculateRoute(routingParameters, onResult, onError);
};

document.addEventListener("DOMContentLoaded", () => {
  // Get user's current location
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    initializeMap(latitude, longitude);
  });

  // Zoom In and Zoom Out functionality
  document.getElementById("zoomInButton").addEventListener("click", function () {
    var zoom = map.getZoom();
    map.setZoom(zoom + 1);
  });

  document.getElementById("zoomOutButton").addEventListener("click", function () {
    var zoom = map.getZoom();
    map.setZoom(zoom - 1);
  });
});

// Pinch In and Pinch Out functionality with touchpad mouse
document.getElementById("mapContainer").addEventListener("wheel", function (event) {
      var delta = Math.sign(event.deltaY); // Determine whether to zoom in or out based on the scroll direction
      var zoom = map.getZoom();
      map.setZoom(zoom + delta); // Adjust the zoom level accordingly
      event.preventDefault(); // Prevent the default scrolling behavior
});

let lastTouchDistance = 0;

document.getElementById("mapContainer").addEventListener("touchmove", function (event) {
      if (event.touches.length === 2) {
        var touch1 = event.touches[0];
        var touch2 = event.touches[1];
        var touchDistance = Math.sqrt(
          Math.pow(touch1.clientX - touch2.clientX, 2) +
            Math.pow(touch1.clientY - touch2.clientY, 2)
        );

        if (lastTouchDistance !== 0) {
          var delta = touchDistance - lastTouchDistance;
          var zoom = map.getZoom();
          map.setZoom(zoom + delta / 100); // Adjust the zoom level based on touch distance change
        }

        lastTouchDistance = touchDistance;
      }
});

document.getElementById("mapContainer").addEventListener("touchend", function () {
      lastTouchDistance = 0;
});
  
