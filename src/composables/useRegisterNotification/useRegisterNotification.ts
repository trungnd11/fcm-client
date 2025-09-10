import NotificationService from "../../services/NotificationService";
import { RegisterNotificationRequest } from "../../services/NotificationService/types";

export default function useRegisterNotification() {
  async function fetchRegisterNotification(request: RegisterNotificationRequest) {
    try {
      await NotificationService.register(request);
    } catch (error) {
      console.log(error);
    }
  }

  return {
    fetchRegisterNotification,
  };
}
