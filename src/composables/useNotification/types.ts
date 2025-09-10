import { MessagePayload } from "firebase/messaging";

export interface UseNotificationProps {
  options?: {
    immediateFetchAllNotification?: boolean;
  };
}

export interface NotificationDataPayload {
  PartnerCode: string;
  ProjectCode: string;
  Username: string;
  Content: string;
  Link: string;
  EnContent: string;
  EnLink: string;
  Details: string;
  EnDetails: string;
  Type: number;
  RefId: string;
  Icon: string;
  Language?: string;
}

export interface FcmNotificationPayload<T = unknown> extends Omit<MessagePayload, "data"> {
  data?: T;
  isRead: boolean;
  createdAt: string;
}
