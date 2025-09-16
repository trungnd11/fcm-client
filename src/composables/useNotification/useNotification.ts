import { reactive, ref, watch, onMounted, h } from "vue";
import { notification as antdNotification } from "ant-design-vue";
import { NotificationTwoTone } from "@ant-design/icons-vue";
import useRegisterNotification from "../useRegisterNotification/useRegisterNotification";
import useGetAllNotification from "../useGetAllNotification/useGetAllNotification";
import useInitializeFirebase from "../useInitializeFirebase/useInitializeFirebase";
import useMarkAsReadNotification from "../useMarkAsReadNotification/useMarkAsReadNotification";
import useMarkAllAsReadNotification from "../useMarkAllAsReadNotification/useMarkAllAsReadNotification";
import useDeleteNotification from "../useDeleteNotification/useDeleteNotification";
import useDeleteAllNotification from "../useDeleteAllNotification/useDeleteAllNotification";
import { Messaging } from "firebase/messaging";
import { getConfig } from "../../config";
import { PartnerCodeEnum } from "../../enums/PartnerCodeEnum";
import { FcmNotificationPayload, NotificationDataPayload, UseNotificationProps } from "./types";

const messagingFirebase = ref<Messaging>();
const listNotification = reactive<FcmNotificationPayload<NotificationDataPayload>[]>([]);
const countReadAllNotification = ref(0);

export const useNotification = (props?: UseNotificationProps) => {
  const { fetchRegisterNotification } = useRegisterNotification();
  const { notifications, fetchDefaultNotification } = useGetAllNotification();
  const { messageCount, initializeFirebase, onMessage, getToken } = useInitializeFirebase();
  const { fetchMarkAsReadNotification } = useMarkAsReadNotification();
  const { fetchMarkAllAsReadNotification } = useMarkAllAsReadNotification();
  const { fetchDeleteNotification } = useDeleteNotification();
  const { fetchDeleteAllNotification } = useDeleteAllNotification();

  watch(notifications, (newNotifications) => {
    newNotifications.forEach((notification) => {
      const isExist = listNotification.find((n) => n.messageId === notification.Id);
      if (isExist) return;

      listNotification.push({
        messageId: notification.Id,
        isRead: notification.IsReaded,
        createdAt: new Date(notification.CreatedDate * 1000 - 7 * 60 * 60 * 1000).toISOString(),
        from: "",
        collapseKey: "",
        notification: {
          title: notification.Content,
          body: notification.Details,
          image: notification.Icon ?? undefined,
        },
        data: notification as unknown as NotificationDataPayload,
      });
    });
  });

  watch(messageCount, (newMessageCount) => {
    countReadAllNotification.value = newMessageCount;
  });

  async function requestPermissionAndGetToken() {
    try {
      const config = getConfig();

      console.log("getConfig", config);

      const { messaging } = initializeFirebase(config);
      if (!messaging.value) return;

      messagingFirebase.value = messaging.value;
      const token = await getToken(messaging.value, { vapidKey: config.vapidKey });
      if (token) {
        console.log("fcmToken", token);
        await fetchRegisterNotification({
          FCMToken: token,
          PartnerCode: PartnerCodeEnum.MY_F88,
        });
      } else {
        antdNotification.error({
          message: "No registration token available. Request permission to generate one.",
        });
      }
    } catch (err) {
      console.error("An error occurred while retrieving token. ", err);
    }
  }

  function listenToForegroundMessages() {
    if (!messagingFirebase.value) return;

    onMessage(messagingFirebase.value, (payload) => {
      const { data, ...rest } = payload;
      console.log("Received message", data, rest);
      fetchDefaultNotification();
      antdNotification.open({
        message: rest.notification?.title ?? data?.Content,
        description: rest.notification?.body ?? data?.Detail,
        icon: rest.notification?.icon ?? data?.Icon ?? h(NotificationTwoTone),
      });
      // Emit custom event
      const config = getConfig();
      window.dispatchEvent(
        new CustomEvent(config.customEventName || "fcm-notification", {
          detail: payload,
        })
      );
    });
  }

  // Listen to background messages from service worker via BroadcastChannel
  function listenToBackgroundMessages() {
    if ("BroadcastChannel" in window) {
      const config = getConfig();
      const channel = new BroadcastChannel(config.broadcastChannelName || "fcm-notifications");

      channel.onmessage = (event) => {
        if (event.data && event.data.type === "FCM_BACKGROUND_NOTIFICATION") {
          const notification = event.data.payload;
          // Check if notification already exists in list
          const exists = listNotification.find((n) => n.messageId === notification.messageId);
          if (!exists) {
            fetchDefaultNotification();
            console.log("Received background notification via BroadcastChannel:", notification);
          }
        }
      };
    } else {
      // Fallback: use service worker message
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.addEventListener("message", (event) => {
          if (event.data && event.data.type === "FCM_BACKGROUND_NOTIFICATION") {
            const notification = event.data.payload;
            const exists = listNotification.find((n) => n.messageId === notification.messageId);
            if (!exists) {
              fetchDefaultNotification();
              console.log("Received background notification via postMessage:", notification);
            }
          }
        });
      }
    }
  }

  function initializeFCM() {
    listenToForegroundMessages();
    listenToBackgroundMessages();
  }

  async function markAsReadNotification(messageId: string) {
    const notification = listNotification.find((n) => n.messageId === messageId);
    if (!notification) return;

    await fetchMarkAsReadNotification(
      {
        Id: messageId,
        PartnerCode: PartnerCodeEnum.MY_F88,
      },
      () => {
        const index = listNotification.findIndex((n) => n.messageId === messageId);
        if (index !== -1) {
          listNotification[index].isRead = true;
        }
      }
    );
  }

  async function markAllAsReadNotification() {
    await fetchMarkAllAsReadNotification(() => {
      listNotification.forEach((n) => {
        n.isRead = true;
      });
    });
  }

  function resetCountReadAllNotification() {
    countReadAllNotification.value = 0;
  }

  function removeNotification(messageId: string) {
    const item = listNotification.find((n) => n.messageId === messageId);
    if (!item) return;
    fetchDeleteNotification(
      {
        Id: messageId,
        PartnerCode: PartnerCodeEnum.MY_F88,
      },
      () => {
        const index = listNotification.findIndex((n) => n.messageId === messageId);
        if (index !== -1) {
          listNotification.splice(index, 1);
        }
      }
    );
  }

  function clearAllNotification() {
    countReadAllNotification.value = 0;
    fetchDeleteAllNotification();
  }

  onMounted(() => {
    if (props?.options?.immediateFetchAllNotification) {
      fetchDefaultNotification();
    }
  });

  return {
    listNotification,
    countReadAllNotification,
    requestPermissionAndGetToken,
    listenToForegroundMessages,
    initializeFCM,
    resetCountReadAllNotification,
    markAsReadNotification,
    markAllAsReadNotification,
    removeNotification,
    clearAllNotification,
  };
};

export type { FcmNotificationPayload } from "./types";
