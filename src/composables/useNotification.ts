import { messaging, getToken, onMessage } from '../firebase';
import { reactive, watch, ref } from 'vue';

const vapidKey =
  'BAnMUfFvWEf8QHCBIyHisHmMKp5PURUnn-6tFlM-5uJVZwjcRCnWkYRJuX8fL44imIRMFu3iFWwifc8jdcfAJ0U';

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
  const notifications = localStorage.getItem('fcm-notifications');
  if (!notifications) return [];
  return JSON.parse(notifications);
}

const listNotification = reactive<FcmNotificationPayload[]>(
  getFromLocalStorage() ?? [],
);
// Tính toán count dựa trên số notification chưa đọc thực tế
const countReadAllNotification = ref(0);

export const useNotification = () => {
  const requestPermissionAndGetToken = async () => {
    console.log("start request permission and get token...");
    try {
      const token = await getToken(messaging, { vapidKey });
      if (token) {
        console.log('FCM Token:', token);
      } else {
        console.warn(
          'No registration token available. Request permission to generate one.',
        );
      }
    } catch (err) {
      console.error('An error occurred while retrieving token. ', err);
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
      window.dispatchEvent(
        new CustomEvent('fcm-notification', {
          detail: payload,
        }),
      );
      increaseCountReadAllNotification();
    });
  };

  // Lắng nghe background messages từ service worker qua BroadcastChannel
  const listenToBackgroundMessages = () => {
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('fcm-notifications');

      channel.onmessage = (event) => {
        if (event.data && event.data.type === 'FCM_BACKGROUND_NOTIFICATION') {
          const notification = event.data.payload;
          // Kiểm tra xem notification đã có trong list chưa
          const exists = listNotification.find(
            (n) => n.messageId === notification.messageId,
          );
          if (!exists) {
            listNotification.push({
              ...notification,
              isRead: false,
              createdAt: new Date().toISOString(),
            });
            console.log(
              'Received background notification via BroadcastChannel:',
              notification,
            );
            increaseCountReadAllNotification();
          }
        }
      };
    } else {
      // Fallback: sử dụng service worker message
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'FCM_BACKGROUND_NOTIFICATION') {
            const notification = event.data.payload;
            const exists = listNotification.find(
              (n) => n.messageId === notification.messageId,
            );
            if (!exists) {
              listNotification.push(notification);
              console.log(
                'Received background notification via postMessage:',
                notification,
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
      (n) => n.messageId === messageId,
    );
    if (notification && !notification.isRead) {
      notification.isRead = true;
      // Không giảm count khi đọc notification vì count đã được reset khi click chuông
      console.log('Read notification:', messageId, 'Count remains:', countReadAllNotification.value);
    }
  }

  function saveToLocalStorage(notification: FcmNotificationPayload[]) {
    localStorage.setItem('fcm-notifications', JSON.stringify(notification));
  }

  function saveCountReadAllNotification() {
    localStorage.setItem(
      'countReadAllNotification',
      countReadAllNotification.value.toString(),
    );
  }

  function resetCountReadAllNotification() {
    countReadAllNotification.value = 0;
    saveCountReadAllNotification();
  }

  function removeNotification(messageId: string) {
    const notificationIndex = listNotification.findIndex((n) => n.messageId === messageId);
    if (notificationIndex !== -1) {
      listNotification.splice(notificationIndex, 1);
      // Không giảm count khi xóa notification vì count đã được reset khi click chuông
    }
  }

  function clearAllNotification() {
    countReadAllNotification.value = 0;
    saveCountReadAllNotification();
    listNotification.splice(0, listNotification.length);
  }



  function increaseCountReadAllNotification() {
    // Chỉ tăng count khi có notification mới
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
