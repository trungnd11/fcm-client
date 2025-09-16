import { useNotification } from "./composables/useNotification/useNotification";
import Notification from "./components/notification/Notification.vue";
import useInitializeFirebase from "./composables/useInitializeFirebase/useInitializeFirebase";
import useToken from "./composables/useToken/useToken";
import useGetAllNotification from "./composables/useGetAllNotification/useGetAllNotification";
import useMarkAsReadNotification from "./composables/useMarkAsReadNotification/useMarkAsReadNotification";
import useMarkAllAsReadNotification from "./composables/useMarkAllAsReadNotification/useMarkAllAsReadNotification";
import useDeleteNotification from "./composables/useDeleteNotification/useDeleteNotification";
import useDeleteAllNotification from "./composables/useDeleteAllNotification/useDeleteAllNotification";
import useRegisterNotification from "./composables/useRegisterNotification/useRegisterNotification";
import { initializeConfig, setConfig, getConfig, loadConfigFromFile, type FCMConfig } from "./config";
import type {
  BellSlotProps,
  HeaderSlotProps,
  ListSlotProps,
  EmptySlotProps,
  HeaderActionSlotProps,
  PaginationSlotProps,
  NotificationProps,
  NotificationEmits,
} from "./components/notification/types";
import "ant-design-vue/dist/reset.css";
import "./style.css";
import "./config/tailwind.css";

export {
  Notification,
  initializeConfig,
  setConfig,
  getConfig,
  loadConfigFromFile,
  useNotification,
  useInitializeFirebase,
  useToken,
  useGetAllNotification,
  useMarkAsReadNotification,
  useMarkAllAsReadNotification,
  useDeleteNotification,
  useDeleteAllNotification,
  useRegisterNotification,
};
export type {
  FCMConfig,
  BellSlotProps,
  HeaderSlotProps,
  ListSlotProps,
  EmptySlotProps,
  HeaderActionSlotProps,
  PaginationSlotProps,
  NotificationProps,
  NotificationEmits,
};
