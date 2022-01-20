import firebase from 'firebase'

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyA2vwChlStKsPIhRDAeBEebQw-cZNz5OIA",
    authDomain: "pwaapps-67088.firebaseapp.com",
    databaseURL: "https://pwaapps-67088.firebaseio.com",
    projectId: "pwaapps-67088",
    storageBucket: "pwaapps-67088.appspot.com",
    messagingSenderId: "184478675876",
    appId: "1:184478675876:web:4465981fd9f65ae9fbc731"
  };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

export default firebase