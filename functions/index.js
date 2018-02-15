const functions = require('firebase-functions');

exports.test = functions.database.ref('/posts/{postId}').onCreate((event) => {
  // event.data.val() is the value of the newly created post

  // event.data.ref is a database reference to the newly created post.
  // For example, if we wanted to set a property on it we could do the following
  //return event.data.ref.child('hello').set('world');

  // TODO Authenticate with the firebase cloud messaging server
  // TODO Send push notification with content from event.data.ref
});
