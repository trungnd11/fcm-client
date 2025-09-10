import { ref } from "vue";
import useGetAllNotification from "../useGetAllNotification/useGetAllNotification";
import NotificationService from "../../services/NotificationService";

const isLoading = ref<boolean>(false);

export default function useDeleteAllNotification() {
  const { fetchAllNotification, fetchPaginatedNotifications } = useGetAllNotification();

  async function fetchDeleteAllNotification() {
    isLoading.value = true;
    try {
      await NotificationService.deleteAllNotifications();
      fetchAllNotification();
      fetchPaginatedNotifications();
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  }
  return {
    isLoading,
    fetchDeleteAllNotification,
  };
}
