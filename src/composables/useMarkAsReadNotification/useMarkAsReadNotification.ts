import { ref } from "vue";
import { notification } from "ant-design-vue";
import NotificationService from "../../services/NotificationService";
import { MarkAsReadRequest } from "../../services/NotificationService/types";

const isLoading = ref<boolean>(false);

export default function useMarkAsReadNotification() {
  async function fetchMarkAsReadNotification(request: MarkAsReadRequest, sucessAction?: () => void) {
    isLoading.value = true;
    try {
      await NotificationService.markAsRead(request);
      sucessAction?.();
    } catch (error) {
      notification.error({
        message: "Failed to mark as read notification",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      isLoading.value = false;
    }
  }

  return { fetchMarkAsReadNotification, isLoading };
}
