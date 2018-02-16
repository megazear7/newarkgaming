importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '652674419581'
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  payload.notification.vibrate = [250, 250];
  payload.notification.requireInteraction = true;
  payload.notification.image = payload.data.image;
  payload.notification.badge = payload.data.badge;
  return self.registration.showNotification(payload.notification.title, payload.notification);
});

function sendTokenToServer(token) {
  firebase.database()
  .ref(`/users/${firebase.auth().currentUser.uid}/notificationTokens`)
  .push().set(token);
}
