const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var newArticleTopic = 'new-article';

exports.subscribeToArticleTopic = functions.database.ref('/users/{userId}/notificationTokens/{token}').onCreate((event) => {
  const token = event.data.val();
  console.log("subscribeToArticleTopic: Token: " + token);

  return admin.messaging().subscribeToTopic([token], newArticleTopic)
  .then((response) => {
    console.log('Successfully subscribed to topic:', response);
    return response;
  })
  .catch((error) => {
    console.log('Error subscribing to topic:', error);
  });
});

exports.sendPostNotification = functions.database.ref('/posts/{postId}').onCreate((event) => {
  const postId = event.params.postId;
  console.log(postId);
  const authorUid = event.data.val().author;
  console.log(authorUid)

  const authorPromise = admin.database().ref(`/users/${authorUid}`).once('value');

  return authorPromise.then((authorSnapshot) => {
    const author = authorSnapshot.val();
    console.log(author.displayName);

    var message = {
      notification: {
        title: 'There is a new post!',
        body: `${author.displayName} posted to the Newark gaming group.`,
        icon: 'https://newarkgaming.firebaseapp.com/images/logo/meeple-132.png',
        click_action: 'https://newarkgaming.firebaseapp.com'
      }
    };

    return admin.messaging().sendToTopic(newArticleTopic, message);
  }).then((response) => {
    // For each message check if there was an error.
    const tokensToRemove = [];
    response.results.forEach((result, index) => {
      const error = result.error;
      if (error) {
        console.error('Failure sending notification to', tokens[index], error);
        // Cleanup the tokens who are not registered anymore.
        if (error.code === 'messaging/invalid-registration-token' || error.code === 'messaging/registration-token-not-registered') {
          tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
        }
      }
    });
    return Promise.all(tokensToRemove);
  });
});
