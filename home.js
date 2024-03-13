  // Initialize the platform object
  var platform = new H.service.Platform({
    'apikey': 'p7h735_8lH9w49kBYsEY1pvkAz97Gd7pMvK9D013aGk'
  });

  // Obtain the default map types from the platform object
  var maptypes = platform.createDefaultLayers();

  // Instantiate (and display) the map
  var map = new H.Map(
    document.getElementById('mapContainer'),
    maptypes.vector.normal.map,
    {
      zoom: 4,
      center: { lat: 20.5937, lng: 78.9629 }
    });