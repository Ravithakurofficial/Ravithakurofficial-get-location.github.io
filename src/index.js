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

//signup function
function signUp() {
  var email = document.getElementById("floatingInput");
  var password = document.getElementById("floatingPassword");

  const promise = auth.createUserWithEmailAndPassword(
    email.value,
    password.value
  );
  promise.catch((e) => alert(e.message));
  alert("Thanks for Sign up!!");
  window.location = "./home.html";
}

//signIN function
function signIn() {
  var email = document.getElementById("floatingInput");
  var password = document.getElementById("floatingPassword");
  const promise = auth.signInWithEmailAndPassword(email.value, password.value);
  promise.catch((e) => alert(e.message));
  // window.location = "./home.html";
}

//signOut
function signOut() {
  auth.signOut();
  alert("See you soon!");
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