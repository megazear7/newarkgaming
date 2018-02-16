importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '652674419581'
});

const messaging = firebase.messaging();

// TODO Instead of having a databse listener in a cloud function can we just
// subscribe to a topic right here?
//messaging.subscribeToTopic("new-article");

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  return self.registration.showNotification(payload.notification.title, payload.notification);
});

function sendTokenToServer(token) {
  firebase.database()
  .ref(`/users/${firebase.auth().currentUser.uid}/notificationTokens`)
  .push().set(token);
}
