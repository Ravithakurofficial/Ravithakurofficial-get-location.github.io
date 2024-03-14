// Initialize the platform object
var platform = new H.service.Platform({
  apikey: "p7h735_8lH9w49kBYsEY1pvkAz97Gd7pMvK9D013aGk",
});

let map;

navigator.geolocation.getCurrentPosition((position) => {
  const { latitude, longitude } = position.coords;

  // Center the map on user's location
  map = new H.Map(
    document.getElementById("mapContainer"),
    platform.createDefaultLayers().vector.normal.map,
    {
      zoom: 15, // Adjust zoom level for better user location visibility
      center: { lat: latitude, lng: longitude },
    }
  );
  var yourlocationmarker = new H.map.Marker({ lat: latitude, lng: longitude });
  map.addObject(yourlocationmarker);
});

document.getElementById("zoomInButton").addEventListener("click", function () {
  var zoom = map.getZoom();
  map.setZoom(zoom + 1);
});

document.getElementById("zoomOutButton").addEventListener("click", function () {
  var zoom = map.getZoom();
  map.setZoom(zoom - 1);
});

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyA54-IKm2qW-Ki2S_p0PrcZM_v3wwF1rOk",
  authDomain: "crm-database-8ee82.firebaseapp.com",
  databaseURL: "https://crm-database-8ee82-default-rtdb.firebaseio.com",
  projectId: "crm-database-8ee82",
  storageBucket: "crm-database-8ee82.appspot.com",
  messagingSenderId: "867136798793",
  appId: "1:867136798793:web:74fcee39de223f51d77f98",
  // measurementId: "G-LNGKDM9662"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

//signOut
function signOut() {
  auth.signOut();
  alert("see you soon!");
  window.location = "./index.html";
}

//active user to homepage
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var email = user.email;
    // alert("Active user " + email);
  } else {
    alert("No Active user Found");
    // window.location = "./index.html";
  }
});

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    var user = firebase.auth().currentUser;

    if (user != null) {
      var email_id = user.email;
      document.getElementById("user_para").innerHTML = "" + email_id;
    }
  } else {
    // No user is signed in.
    window.location = "./index.html";
  }
});