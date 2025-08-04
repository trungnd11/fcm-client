import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  Messaging,
} from "firebase/messaging";
import { getConfig } from "./config";

let app: FirebaseApp | undefined;
let messaging: Messaging | undefined;

export const initializeFirebase = () => {
  const config = getConfig();

  if (!app) {
    app = initializeApp(config.firebase);
  }

  if (!messaging) {
    messaging = getMessaging(app);
  }

  return { app, messaging };
};

// Initialize Firebase when importing
const { messaging: defaultMessaging } = initializeFirebase();

export { defaultMessaging as messaging, getToken, onMessage };
