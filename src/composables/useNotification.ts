import { reactive, ref, watch } from "vue";
import { getConfig } from "../config";
import { getToken, messaging, onMessage } from "../firebase";

export interface FcmNotificationPayload {
  from: string;
  messageId: string;
  isRead?: boolean;
  createdAt: string;
  notification?: {
    title?: string;
    body?: string;
    image?: string;
  };
}

function getFromLocalStorage() {
  const config = getConfig();
  const notifications = localStorage.getItem(
    config.storageKey || "fcm-notifications"
  );
  if (!notifications) return [];
  return JSON.parse(notifications);
}

const listNotification = reactive<FcmNotificationPayload[]>(
  getFromLocalStorage() ?? []
);
// Calculate count based on actual unread notifications
const countReadAllNotification = ref(0);

export const useNotification = () => {
  const requestPermissionAndGetToken = async () => {
    console.log("start request permission and get token...");
    try {
      const config = getConfig();
      const token = await getToken(messaging, { vapidKey: config.vapidKey });
      if (token) {
        console.log("FCM Token:", token);
      } else {
        console.warn(
          "No registration token available. Request permission to generate one."
        );
      }
    } catch (err) {
      console.error("An error occurred while retrieving token. ", err);
    }
  };

  const listenToForegroundMessages = () => {
    onMessage(messaging, (payload) => {
      listNotification.push({
        ...payload,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
      // Emit custom event
      const config = getConfig();
      window.dispatchEvent(
        new CustomEvent(config.customEventName || "fcm-notification", {
          detail: payload,
        })
      );
      increaseCountReadAllNotification();
    });
  };

  // Listen to background messages from service worker via BroadcastChannel
  const listenToBackgroundMessages = () => {
    if ("BroadcastChannel" in window) {
      const config = getConfig();
      const channel = new BroadcastChannel(
        config.broadcastChannelName || "fcm-notifications"
      );

      channel.onmessage = (event) => {
        if (event.data && event.data.type === "FCM_BACKGROUND_NOTIFICATION") {
          const notification = event.data.payload;
          // Check if notification already exists in list
          const exists = listNotification.find(
            (n) => n.messageId === notification.messageId
          );
          if (!exists) {
            listNotification.push({
              ...notification,
              isRead: false,
              createdAt: new Date().toISOString(),
            });
            console.log(
              "Received background notification via BroadcastChannel:",
              notification
            );
            increaseCountReadAllNotification();
          }
        }
      };
    } else {
      // Fallback: use service worker message
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.addEventListener("message", (event) => {
          if (event.data && event.data.type === "FCM_BACKGROUND_NOTIFICATION") {
            const notification = event.data.payload;
            const exists = listNotification.find(
              (n) => n.messageId === notification.messageId
            );
            if (!exists) {
              listNotification.push(notification);
              console.log(
                "Received background notification via postMessage:",
                notification
              );
              increaseCountReadAllNotification();
            }
          }
        });
      }
    }
  };

  const initializeFCM = () => {
    listenToForegroundMessages();
    listenToBackgroundMessages();
  };

  watch(listNotification, (listNotification) => {
    saveToLocalStorage(listNotification);
  });

  function readNotification(messageId: string) {
    const notification = listNotification.find(
      (n) => n.messageId === messageId
    );
    if (notification && !notification.isRead) {
      notification.isRead = true;
      // Don't decrease count when reading notification because count is reset when clicking bell
      console.log(
        "Read notification:",
        messageId,
        "Count remains:",
        countReadAllNotification.value
      );
    }
  }

  function saveToLocalStorage(notification: FcmNotificationPayload[]) {
    const config = getConfig();
    localStorage.setItem(
      config.storageKey || "fcm-notifications",
      JSON.stringify(notification)
    );
  }

  function saveCountReadAllNotification() {
    localStorage.setItem(
      "countReadAllNotification",
      countReadAllNotification.value.toString()
    );
  }

  function resetCountReadAllNotification() {
    countReadAllNotification.value = 0;
    saveCountReadAllNotification();
  }

  function removeNotification(messageId: string) {
    const notificationIndex = listNotification.findIndex(
      (n) => n.messageId === messageId
    );
    if (notificationIndex !== -1) {
      listNotification.splice(notificationIndex, 1);
      // Don't decrease count when removing notification because count is reset when clicking bell
    }
  }

  function clearAllNotification() {
    countReadAllNotification.value = 0;
    saveCountReadAllNotification();
    listNotification.splice(0, listNotification.length);
  }

  function increaseCountReadAllNotification() {
    // Only increase count when there's a new notification
    countReadAllNotification.value = countReadAllNotification.value + 1;
    saveCountReadAllNotification();
  }

  return {
    requestPermissionAndGetToken,
    listenToForegroundMessages,
    initializeFCM,
    listNotification,
    resetCountReadAllNotification,
    countReadAllNotification,
    readNotification,
    removeNotification,
    clearAllNotification,
  };
};
