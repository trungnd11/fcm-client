// src/composables/useFcm.ts
import { messaging, getToken, onMessage } from './firebase';
import { ref, watch } from 'vue';

export interface FcmNotificationPayload {
  from: string;
  messageId: string;
  notification?: {
    title?: string;
    body?: string;
    image?: string;
  };
}

export const useFcm = () => {
  const listNotification = ref<FcmNotificationPayload[]>([]);
  const vapidKey =
    'BAnMUfFvWEf8QHCBIyHisHmMKp5PURUnn-6tFlM-5uJVZwjcRCnWkYRJuX8fL44imIRMFu3iFWwifc8jdcfAJ0U'; // từ Firebase Console > Project Settings > Cloud Messaging

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
      // console.log('Message received.', payload)
      listNotification.value = [...listNotification.value, payload];
      // Hiển thị thông báo hoặc xử lý tại clientss
    });
  };

  const getListNotification = () => {
    return listNotification;
  };

  watch(
    listNotification,
    (listNotification) => {
      console.log('[LIB] ref:', listNotification);
      console.log('[LIB] Vue ref:', ref);
    },
    { immediate: true, deep: true },
  );

  return {
    requestPermissionAndGetToken,
    listenToForegroundMessages,
    listNotification,
    getListNotification,
  };
};
