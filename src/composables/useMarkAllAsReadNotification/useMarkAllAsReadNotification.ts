import { ref } from "vue";
import { notification } from "ant-design-vue";
import NotificationService from "../../services/NotificationService";
import useGetAllNotification from "../useGetAllNotification/useGetAllNotification";

const isLoading = ref<boolean>(false);

export default function useMarkAllAsReadNotification() {
  const { fetchAllNotification, fetchPaginatedNotifications } = useGetAllNotification();

  async function fetchMarkAllAsReadNotification() {
    isLoading.value = true;
    try {
      await NotificationService.markAllAsRead();
      fetchAllNotification();
      fetchPaginatedNotifications();
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
