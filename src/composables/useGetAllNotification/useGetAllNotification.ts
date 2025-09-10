import { ref } from "vue";
import NotificationService from "../../services/NotificationService";
import {
  GetNotificationRequest,
  NotificationResponse,
  PaginatedNotificationResponse,
} from "../../services/NotificationService/types";
import { PartnerCodeEnum } from "../../enums/PartnerCodeEnum";
import { ProjectCodeEnum } from "../../enums/ProjectCodeEnum";
import { LanguageCodeEnum } from "../../enums/LanguageCodeEnum";

const defaultNotificationRequest = ref<GetNotificationRequest>({
  PartnerCode: PartnerCodeEnum.MY_F88,
  ProjectCode: ProjectCodeEnum.MY_F88_SYSTEM,
  Language: LanguageCodeEnum.VI,
  PageNumber: 1,
  PageSize: 5,
});

const notifications = ref<NotificationResponse[]>([]);
const notificationRequest = ref<GetNotificationRequest>();
const paginatedNotifications = ref<PaginatedNotificationResponse>();
const isGetAllLoading = ref<boolean>(false);
const isGetPaginatedLoading = ref<boolean>(false);

export default function useGetAllNotification() {
  async function fetchAllNotification() {
    if (!notificationRequest.value) return;
    isGetAllLoading.value = true;
    try {
      const { data } = await NotificationService.getAllNotifications(notificationRequest.value);
      notifications.value = data;
    } catch (error) {
      console.log(error);
    } finally {
      isGetAllLoading.value = false;
    }
  }

  async function fetchPaginatedNotifications() {
    if (!notificationRequest.value) return;
    isGetPaginatedLoading.value = true;
    try {
      const { data } = await NotificationService.getPaginatedNotifications(notificationRequest.value);
      paginatedNotifications.value = data;
    } catch (error) {
      console.log(error);
    } finally {
      isGetPaginatedLoading.value = false;
    }
  }

  function setNotificationRequest(request: GetNotificationRequest) {
    notificationRequest.value = request;
  }

  function fetchDefaultNotification() {
    notificationRequest.value = defaultNotificationRequest.value;
    fetchAllNotification();
    fetchPaginatedNotifications();
  }

  return {
    isGetAllLoading,
    isGetPaginatedLoading,
    notifications,
    paginatedNotifications,
    fetchDefaultNotification,
    setNotificationRequest,
    fetchAllNotification,
    fetchPaginatedNotifications,
  };
}
