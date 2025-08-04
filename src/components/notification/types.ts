import { ListProps } from "ant-design-vue";
import type { FcmNotificationPayload } from "../../composables/useNotification";

// Slot types for Notification component
export interface BellSlotProps {
  count: number;
  isShaking: boolean;
  onClick: () => void;
}

export interface HeaderSlotProps {
  title: string;
}

export interface ListSlotProps {
  notifications: FcmNotificationPayload[];
  readNotification: (messageId: string) => void;
  removeNotification: (messageId: string) => void;
  getTimeAgo: (createdAt: string) => string;
}

export interface EmptySlotProps {
  text: string;
}

export interface FooterSlotProps {
  clearAll: () => void;
  text: string;
}

// Props interface for Notification component
export interface NotificationProps {
  title?: string;
  emptyText?: string;
  clearAllText?: string;
  showClearAll?: boolean;
  maxHeight?: string;
  width?: string;
  listProps?: ListProps
}

// Emits interface for Notification component
export interface NotificationEmits {
  (e: "bell-click"): void;
  (e: "notification-read", messageId: string): void;
  (e: "notification-remove", messageId: string): void;
  (e: "clear-all"): void;
}
