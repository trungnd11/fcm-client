import { ref } from "vue";
import { notification } from "ant-design-vue";
import NotificationService from "../../services/NotificationService";

const isLoading = ref<boolean>(false);

export default function useMarkAllAsReadNotification() {
  async function fetchMarkAllAsReadNotification(sucessAction?: () => void) {
    isLoading.value = true;
    try {
      await NotificationService.markAllAsRead();
      sucessAction?.();
    } catch (error) {
      notification.error({
        message: "Failed to mark all as read notification",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      isLoading.value = false;
    }
  }

  return {
    fetchMarkAllAsReadNotification,
    isLoading,
  };
}
