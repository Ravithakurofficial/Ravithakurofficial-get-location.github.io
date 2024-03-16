// Your web app's Firebase configuration
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

//signup function
function signUp() {
  var email = document.getElementById("email");
  var password = document.getElementById("password");

  const promise = auth.createUserWithEmailAndPassword(
    email.value,
    password.value
  );
  //
  promise.catch((e) => alert(e.message));
  alert("Thanks for Sign Up. Now you can Sign In.");
}

//signIN function
function signIn() {
  var email = document.getElementById("email");
  var password = document.getElementById("password");
  const promise = auth.signInWithEmailAndPassword(email.value, password.value);
  promise.catch((e) => alert(e.message));
}

//signOut
function signOut() {
  auth.signOut();
  alert("See you soon!");
}

//active user to homepage
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var email = user.email;
    alert("Active user " + email);
    window.location = "./home.html";
  } else {
    // alert("No Active user Found");
  }
});