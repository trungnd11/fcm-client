import { ref, watch } from "vue";
import { FirebaseApp, initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, deleteToken, Messaging } from "firebase/messaging";
import { ref as dbRef, get, getDatabase, onValue, set } from "firebase/database";
import useToken from "../useToken/useToken";
import { DatabaseRefEnum } from "../../enums/DatabaseRefEnum";
import { FCMConfig } from "../../config";
import { AccessTokenResponse } from "../useToken/types";

const app = ref<FirebaseApp | undefined>(undefined);
const messaging = ref<Messaging | undefined>(undefined);
const messageCount = ref<number>(0);

export default function useInitializeFirebase() {
  const { username } = useToken<AccessTokenResponse>();

  function initializeFirebase(config: FCMConfig) {
    if (!app.value) {
      app.value = initializeApp(config.firebase);
    }

    if (!messaging.value) {
      messaging.value = getMessaging(app.value);
    }

    return { app, messaging };
  }

  watch(app, (app) => {
    if (!app) return;

    const db = getDatabase(app);
    const messagesRef = dbRef(db, DatabaseRefEnum.USER_NOTIFICATION_COUNT);
    if (messagesRef) {
      onValue(messagesRef, (snapshot) => {
        if (snapshot.exists()) {
          messageCount.value = snapshot.val()?.[username.value]?.count ?? 0;
        }
      });
    }
  });

  async function deleteMessages() {
    if (!app.value) return;
    const db = getDatabase(app.value);
    const messagesRef = dbRef(db, "messages");

    try {
      await set(messagesRef, {});
      messageCount.value = 0;
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  }

  async function fetchMessageCount() {
    if (!app.value) return;
    const db = getDatabase(app.value);
    const messagesRef = dbRef(db, DatabaseRefEnum.USER_NOTIFICATION_COUNT);
    const snapshot = await get(messagesRef);

    if (snapshot.exists()) {
      messageCount.value = Object.keys(snapshot.val()).length;
    } else {
      messageCount.value = 0;
    }
  }

  return { messageCount, initializeFirebase, getToken, onMessage, deleteToken, fetchMessageCount, deleteMessages };
}
