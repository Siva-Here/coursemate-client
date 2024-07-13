import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDwD0jhu3XcyKHLl0SA3UOQi4G7C4ljVEA",
  authDomain: "test-project-push-1efd3.firebaseapp.com",
  projectId: "test-project-push-1efd3",
  storageBucket: "test-project-push-1efd3.appspot.com",
  messagingSenderId: "547989539270",
  appId: "1:547989539270:web:a3bd4725c79e3fcb68cac7",
  measurementId: "G-3W6ZP46DYG",
};

initializeApp(firebaseConfig);

const messaging = getMessaging();

export const requestForToken = () => {
  return getToken(messaging, {
    vapidKey:
      "BGqIIsZVxlpP8MMEwWyCCYOpaR_JHM62z11WL7CIn7rQSDQ1HdOBms0kgWJVdrWmBeIlhC9__wC_gvK8v8ytaXU",
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log("notify token: ", currentToken);
        return currentToken;
        // Perform any other neccessary action with the token
      } else {
        // Show permission request UI
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload);
      resolve(payload);
    });
  });
