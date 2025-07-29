// src/composables/useFcm.ts
import { messaging, getToken, onMessage } from './firebase';
import { reactive, watch } from 'vue';

export interface FcmNotificationPayload {
  from: string;
  messageId: string;
  notification?: {
    title?: string;
    body?: string;
    image?: string;
  };
}

// Shared state để đảm bảo app bên ngoài có thể watch được
let sharedState: { notifications: FcmNotificationPayload[] } | null = null;

export const useFcm = () => {
  // Sử dụng shared state nếu đã tồn tại, nếu không tạo mới
  if (!sharedState) {
    sharedState = reactive({
      notifications: [] as FcmNotificationPayload[]
    });
  }

  watch(sharedState, (newVal) => {
    console.log('sharedState changed:', newVal);
  }, { immediate: true, deep: true });

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
      // Đảm bảo payload được wrap đúng cách
      const notification = reactive({
        from: payload.from,
        messageId: payload.messageId,
        notification: payload.notification ? reactive(payload.notification) : undefined,
        collapseKey: payload.collapseKey,
      });

      console.log('notification:', notification);

      sharedState!.notifications.push(notification);
    });
  };

  const getListNotification = () => {
    return sharedState!.notifications;
  };

  return {
    requestPermissionAndGetToken,
    listenToForegroundMessages,
    listNotification: sharedState!.notifications,
    getListNotification,
  };
};
