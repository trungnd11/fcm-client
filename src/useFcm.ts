// src/composables/useFcm.ts
import { messaging, getToken, onMessage } from './firebase';
import { reactive } from 'vue';

export interface FcmNotificationPayload {
  from: string;
  messageId: string;
  notification?: {
    title?: string;
    body?: string;
    image?: string;
  };
}

const listNotification = reactive<FcmNotificationPayload[]>([]);

export const useFcm = () => {
  const vapidKey =
    'BAnMUfFvWEf8QHCBIyHisHmMKp5PURUnn-6tFlM-5uJVZwjcRCnWkYRJuX8fL44imIRMFu3iFWwifc8jdcfAJ0U';

  const requestPermissionAndGetToken = async () => {
    try {
      const token = await getToken(messaging, { vapidKey });
      if (token) {
        console.log('FCM Token:', token);
        // Gửi token lên server của bạn để push về sau
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
      listNotification.push(payload);
      // Emit custom event
      window.dispatchEvent(new CustomEvent('fcm-notification', { 
        detail: payload 
      }));
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
          const exists = listNotification.find(n => n.messageId === notification.messageId);
          if (!exists) {
            listNotification.push(notification);
            console.log('Received background notification via BroadcastChannel:', notification);
          }
        }
      };
    } else {
      // Fallback: sử dụng service worker message
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'FCM_BACKGROUND_NOTIFICATION') {
            const notification = event.data.payload;
            const exists = listNotification.find(n => n.messageId === notification.messageId);
            if (!exists) {
              listNotification.push(notification);
              console.log('Received background notification via postMessage:', notification);
            }
          }
        });
      }
    }
  };

  // Khởi tạo tất cả listeners
  const initializeFCM = () => {
    // Lắng nghe foreground messages
    listenToForegroundMessages();
    
    // Lắng nghe background messages
    listenToBackgroundMessages();
  };

  return {
    requestPermissionAndGetToken,
    listenToForegroundMessages,
    initializeFCM,
    listNotification,
  };
};
