import { Meta, StoryObj } from "storybook-vue3-rsbuild";
import Notification from "../src/components/notification/Notification.vue";

const meta: Meta<typeof Notification> = {
  title: "Notification",
  component: Notification,
};

export default meta;

export const Default: StoryObj<typeof Notification> = {
  args: {},
};
