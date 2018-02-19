const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var newArticleTopic = 'new-article';

// Example: https://us-central1-<APP_NAME>.cloudfunctions.net/makeAdmin?uid=<USER_UID>
exports.makeAdmin = functions.https.onRequest((req, res) => {
  admin.auth().setCustomUserClaims(req.query.uid, {admin: true})
  .then(() => res.send("Specified user is now an admin"))
  .catch(() => res.send("An error occured"))
});

exports.subscribeToArticleTopic = functions.database.ref('/users/{userId}/notificationTokens/{token}').onCreate((event) => {
  const isActive = event.data.val();
  if (! isActive) return;

  const token = event.params.token
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
  const post = event.data.val();
  const authorUid = post.author;
  console.log(authorUid)

  const authorPromise = admin.database().ref(`/users/${authorUid}`).once('value');

  return authorPromise.then((authorSnapshot) => {
    const author = authorSnapshot.val();
    console.log(author.displayName);

    var message = {
      notification: {
        title: post.title,
        body: `${author.displayName} posted a new article to the Newark Gaming group.`,
        icon: 'https://newarkgaming.firebaseapp.com/images/logo/meeple-132.png',
        click_action: 'https://newarkgaming.firebaseapp.com'
      },
      data: {
        image: post.image,
        badge: 'https://newarkgaming.firebaseapp.com/images/logo/meeple-132.png'
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
