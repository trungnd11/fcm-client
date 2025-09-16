import { ref } from "vue";
import NotificationService from "../../services/NotificationService";
import { DeleteNotificationRequest } from "../../services/NotificationService/types";

const isLoading = ref<boolean>(false);

export default function useDeleteNotification() {
  const deleteNotificationRequest = ref<DeleteNotificationRequest>();

  async function fetchDeleteNotification(request: DeleteNotificationRequest, sucessAction?: () => void) {
    isLoading.value = true;
    try {
      await NotificationService.deleteNotification(request);
      sucessAction?.();
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
