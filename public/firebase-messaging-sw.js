// // This a service worker file for receiving push notifitications.
// // See `Access registration token section` @ https://firebase.google.com/docs/cloud-messaging/js/client#retrieve-the-current-registration-token

// // Scripts for firebase and firebase messaging
// importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
// importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// // Initialize the Firebase app in the service worker by passing the generated config
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
//   measurementId: process.env.REACT_APP_MEASUREMENT_ID,
// };

// firebase.initializeApp(firebaseConfig);

// // Retrieve firebase messaging
// const messaging = firebase.messaging();

// // Handle incoming messages while the app is not in focus (i.e in the background, hidden behind other tabs, or completely closed).
// messaging.onBackgroundMessage(function (payload) {
//   console.log("Received background message ", payload);

//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
// This a service worker file for receiving push notifications.
// See `Access registration token section` @ https://firebase.google.com/docs/cloud-messaging/js/client#retrieve-the-current-registration-token

// This a service worker file for receiving push notifications.
// See `Access registration token section` @ https://firebase.google.com/docs/cloud-messaging/js/client#retrieve-the-current-registration-token

// firebase-messaging-sw.js in public folder

// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

fetch("/firebaseConfig.json")
  .then((response) => response.json())
  .then((firebaseConfig) => {
    firebase.initializeApp(firebaseConfig);

    // Retrieve firebase messaging
    const messaging = firebase.messaging();

    // Handle incoming messages while the app is not in focus
    messaging.onBackgroundMessage(function (payload) {
      console.log("Received background message ", payload);

      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
      };

      self.registration.showNotification(
        notificationTitle,
        notificationOptions
      );
    });
  })
  .catch((error) =>
    console.error("Failed to fetch firebaseConfig.json:", error)
  );
