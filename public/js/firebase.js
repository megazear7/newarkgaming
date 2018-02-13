var uiConfig = {
  signInSuccessUrl: '/',
  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      authMethod: 'https://accounts.google.com',
      clientId: '838382712391-38utf875dfbieg6ovfem73ddhl98kr00.apps.googleusercontent.com'
    },
    // Currently there is a console error when clicking on verify with the phone auth provider.
    /*{
      provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      recaptchaParameters: {
        type: 'image',
        size: 'invisible',
        badge: 'bottomleft'
      }
    },*/
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
};
var ui = new firebaseui.auth.AuthUI(firebase.auth());

initApp = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var uid = user.uid;
      var phoneNumber = user.phoneNumber;
      var providerData = user.providerData;

      firebase.database().ref('users/' + uid).update({
        uid: uid,
        displayName: displayName,
        email: email,
        profile_picture : photoURL
      });

      user.getIdToken().then(function(accessToken) {
        document.getElementById('sign-out').textContent = 'Sign out';
        document.getElementById('display-name').textContent = displayName;
        document.getElementById('account').style.opacity = "1";
        document.getElementById('login').style.opacity = "0";
        if (photoURL) {
          document.getElementById('avatar').src = photoURL;
        } else {
          document.getElementById('avatar').src = '/images/user.png';
        }
        document.getElementById('avatar').addEventListener("click", () => {
          document.getElementById('sign-out').classList.toggle("show");
        });
      });
    } else {
      ui.start('#firebaseui-auth-container', uiConfig);
      document.getElementById('sign-out').textContent = 'Sign in';
      document.getElementById('display-name').textContent = 'null';
      document.getElementById('account').style.opacity = "0";
      document.getElementById('login').style.opacity = "1";
      document.getElementById('login-opener').addEventListener("click", () => {
        document.getElementById('firebaseui-auth-container').classList.toggle("show");
        document.getElementById('login').classList.toggle("show");
        document.getElementById('login-toggle').classList.toggle("show");
        document.getElementById('login-message').classList.toggle("hide");
      });
    }
  }, function(error) {
    console.log(error);
  });

  document.getElementById('sign-out').addEventListener("click", () => {
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
