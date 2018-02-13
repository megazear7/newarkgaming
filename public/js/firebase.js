var config = {
  apiKey: "AIzaSyDZqVEfoyeKhdpNw-tdkvlojxnFB1vk1nY",
  authDomain: "newarkgaming.firebaseapp.com",
  databaseURL: "https://newarkgaming.firebaseio.com",
  projectId: "newarkgaming",
  storageBucket: "newarkgaming.appspot.com",
  messagingSenderId: "652674419581"
};
firebase.initializeApp(config);

var uiConfig = {
  signInSuccessUrl: '/',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ]
};
var ui = new firebaseui.auth.AuthUI(firebase.auth());

initApp = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var uid = user.uid;
      var phoneNumber = user.phoneNumber;
      var providerData = user.providerData;
      user.getIdToken().then(function(accessToken) {
        document.getElementById('sign-in-status').textContent = 'Signed in';
        document.getElementById('sign-in').textContent = 'Sign out';
        document.getElementById('account-details').textContent = displayName;
      });
    } else {
      // User is signed out.
      ui.start('#firebaseui-auth-container', uiConfig);
      document.getElementById('sign-in-status').textContent = 'Signed out';
      document.getElementById('sign-in').textContent = 'Sign in';
      document.getElementById('account-details').textContent = 'null';
    }
  }, function(error) {
    console.log(error);
  });
  document.getElementById('sign-in').addEventListener("click", () => {
    firebase.auth().signOut().then(function() {
      console.log('Signed Out');
    }, function(error) {
      console.error('Sign Out Error', error);
    });
  });
};

 window.addEventListener('load', function() {
   initApp()
 });
