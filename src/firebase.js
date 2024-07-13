// import { initializeApp } from "firebase/app";
// import { getMessaging, onMessage, getToken } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
//   measurementId: process.env.REACT_APP_MEASUREMENT_ID,
// };

// initializeApp(firebaseConfig);

// const messaging = getMessaging();

// export const requestForToken = () => {
//   return getToken(messaging, {
//     vapidKey: process.env.REACT_APP_VAPID_KEY,
//   })
//     .then((currentToken) => {
//       if (currentToken) {
//         return currentToken;
//       } else {
//         console.log(
//           "No registration token available. Request permission to generate one."
//         );
//       }
//     })
//     .catch((err) => {
//       console.log("An error occurred while retrieving token. ", err);
//     });
// };

// export const onMessageListener = () =>
//   new Promise((resolve) => {
//     onMessage(messaging, (payload) => {
//       console.log("payload", payload);
//       resolve(payload);
//     });
//   });

import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

initializeApp(firebaseConfig);

const messaging = getMessaging();

export const requestForToken = async () => {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready;

    try {
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (currentToken) {
        console.log("notify token: ", currentToken);
        return currentToken;
        // Perform any other necessary action with the token
      } else {
        // Show permission request UI
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    } catch (err) {
      console.log("An error occurred while retrieving token. ", err);
    }
  } else {
    console.log("Service workers are not supported by this browser.");
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload);
      resolve(payload);
    });
  });
