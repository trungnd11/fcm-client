import { getAxiosInstance } from "../../config/axios";
import { NotificationApiPath } from "../../constants/notification";
import {
  DeleteNotificationRequest,
  GetNotificationRequest,
  MarkAsReadRequest,
  NotificationResponse,
  PaginatedNotificationResponse,
  RegisterNotificationRequest,
} from "./types";

const NotificationService = {
  register: (request: RegisterNotificationRequest) => {
    return getAxiosInstance().post<boolean>(NotificationApiPath.REGISTER, request);
  },

  getAllNotifications: (request: GetNotificationRequest) => {
    return getAxiosInstance().post<NotificationResponse[]>(NotificationApiPath.GET_ALL_NOTIFICATIONS, request);
  },

  getPaginatedNotifications: (request: GetNotificationRequest) => {
    return getAxiosInstance().post<PaginatedNotificationResponse>(
      NotificationApiPath.GET_PAGINATED_NOTIFICATIONS,
      request
    );
  },

  markAsRead: (request: MarkAsReadRequest) => {
    return getAxiosInstance().post<boolean>(NotificationApiPath.MARK_AS_READ, request);
  },

  markAllAsRead: () => {
    return getAxiosInstance().post<boolean>(NotificationApiPath.MARK_ALL_AS_READ, {});
  },

  deleteNotification: (request: DeleteNotificationRequest) => {
    const { Id, PartnerCode } = request;
    if (!Id || !PartnerCode) return;
    return getAxiosInstance().delete<boolean>(`${NotificationApiPath.DELETE_NOTIFICATION}/${PartnerCode}/${Id}`);
  },

  deleteAllNotifications: () => {
    return getAxiosInstance().delete<boolean>(NotificationApiPath.DELETE_ALL_NOTIFICATIONS, {});
  },
};

export default NotificationService;
