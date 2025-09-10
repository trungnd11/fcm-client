import { ref } from "vue";
import NotificationService from "../../services/NotificationService";
import { DeleteNotificationRequest } from "../../services/NotificationService/types";
import useGetAllNotification from "../useGetAllNotification/useGetAllNotification";

const isLoading = ref<boolean>(false);

export default function useDeleteNotification() {
  const { fetchAllNotification, fetchPaginatedNotifications } = useGetAllNotification();

  const deleteNotificationRequest = ref<DeleteNotificationRequest>();

  async function fetchDeleteNotification(request: DeleteNotificationRequest) {
    isLoading.value = true;
    try {
      await NotificationService.deleteNotification(request);
      fetchAllNotification();
      fetchPaginatedNotifications();
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  }

  function setDeleteNotificationRequest(request: DeleteNotificationRequest) {
    deleteNotificationRequest.value = request;
  }

  return {
    isLoading,
    setDeleteNotificationRequest,
    fetchDeleteNotification,
  };
}
