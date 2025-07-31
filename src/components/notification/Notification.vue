<script setup lang="ts">
import { onMounted, watchEffect, computed, ref } from 'vue';
import {
  Popover,
  List,
  Badge,
  TypographyText,
  TypographyTitle,
  Divider,
  Button,
} from 'ant-design-vue';
import { BellOutlined } from '@ant-design/icons-vue';
import { useNotification } from '../../composables/useNotification';
import TrashIcon from '../icons/TrashIcon.vue';

const {
  listNotification,
  countReadAllNotification,
  requestPermissionAndGetToken,
  initializeFCM,
  resetCountReadAllNotification,
  readNotification,
  removeNotification,
  clearAllNotification,
} = useNotification();

const isBellShaking = ref(false);

const sortedListNotification = computed(() => {
  return listNotification.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
});

let previousLength = listNotification.length;

watchEffect(() => {
  const currentLength = listNotification.length;
  
  if (currentLength > previousLength) {
    shakeBell();
  }
  
  previousLength = currentLength;
});


function shakeBell() {
  isBellShaking.value = true;
  setTimeout(() => {
    isBellShaking.value = false;
  }, 500);
}

function getTimeAgo(createdAt: string) {
  const now = new Date();
  const created = new Date(createdAt);
  const diffInMinutes = Math.floor(
    (now.getTime() - created.getTime()) / (1000 * 60),
  );

  if (diffInMinutes < 1) return 'Vừa xong';
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ngày trước`;
}

onMounted(() => {
  requestPermissionAndGetToken()
  initializeFCM();
});
</script>

<template>
  <div class="notification-container">
    <Popover placement="bottomRight" trigger="click" :width="300">
      <Badge :count="countReadAllNotification" :overflow-count="9">
        <BellOutlined
          :class="{ 'bell-shake': isBellShaking }"
          :style="{ fontSize: '40px', cursor: 'pointer' }"
          @click="resetCountReadAllNotification"
        />
      </Badge>

      <template #content>
        <div class="notification-wrapper">
          <div class="notification-header">
            <TypographyTitle :level="4" class="notification-title"
              >Thông báo</TypographyTitle
            >
          </div>
          <Divider />
          <div class="notification-content">
            <List :dataSource="sortedListNotification">
              <template #renderItem="{ item }">
                <div
                  class="notification-item"
                  @click="readNotification(item.messageId)"
                >
                  <div class="notification-item-content">
                    <TypographyTitle :level="5">{{
                      item.notification.title
                    }}</TypographyTitle>
                    <TypographyText>{{
                      item.notification.body
                    }}</TypographyText>
                  </div>
                  <div class="notification-item-time">
                    <TypographyText>{{
                      getTimeAgo(item.createdAt)
                    }}</TypographyText>
                    <TrashIcon
                      :size="16"
                      className="trash-icon"
                      :style="{
                        cursor: 'pointer',
                        color: 'red',
                        display: 'none',
                        position: 'absolute',
                        right: '-24px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }"
                      @click="removeNotification(item.messageId)"
                    />
                  </div>
                  <div v-if="!item.isRead" class="notification-item-unread" />
                </div>
              </template>
            </List>
          </div>
          <div
            v-if="sortedListNotification.length > 0"
            class="notification-footer"
          >
            <Button type="link" @click.stop="clearAllNotification"
              >Xóa tất cả</Button
            >
          </div>
        </div>
      </template>
    </Popover>
  </div>
</template>

<style scoped>
.notification-header {
  padding: 16px;
}

.notification-content {
  width: 500px;
  max-height: 400px;
  overflow-y: auto;
}

.notification-item-unread {
  width: 10px;
  height: 10px;
  background-color: green;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.notification-item {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  position: relative;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;

    .trash-icon {
      display: block !important;
    }
  }
}

.notification-item-content {
  padding-left: 32px;
}

.notification-item-time {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-right: 24px;

  &:hover {
    .trash-icon {
      display: block !important;
    }
  }
}

.notification-title {
  margin: 0 !important;
}

.ant-popover-inner {
  padding: 0 !important;
}

.ant-divider {
  margin: 0;
}

.notification-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
}

.notification-content::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.1);
	background-color: #F5F5F5;
	border-radius: 10px;
}

.notification-content::-webkit-scrollbar
{
	width: 6px;
	background-color: #F5F5F5;
}

.notification-content::-webkit-scrollbar-thumb
{
	border-radius: 10px;
	background-color: #FFF;
	background-image: -webkit-gradient(linear,
									   40% 0%,
									   75% 84%,
									   from(#4D9C41),
									   to(#19911D),
									   color-stop(.6,#54DE5D))
}

@keyframes bellShake {
  0%, 100% {
    transform: rotate(0deg);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: rotate(-5deg);
  }
  20%, 40%, 60%, 80% {
    transform: rotate(5deg);
  }
}

.bell-shake {
  animation: bellShake 0.5s ease-in-out;
  transform-origin: top center;
}
</style>
