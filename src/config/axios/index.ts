import axios, { AxiosInstance } from "axios";
import { LocalStorageKeyEnum } from "../../enums/LocalStorageKeyEnum";
import { getConfig } from "../../config";
import { notification } from "ant-design-vue";

let axiosInstance: AxiosInstance | null = null;

// Create single axios instance
const createAxiosInstance = () => {
  const config = getConfig();

  const instance = axios.create({
    baseURL: config.baseUrl,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add interceptors
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(LocalStorageKeyEnum.ACCESS_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      notification.error({ message: error ?? "" });
      return Promise.reject(error);
    }
  );

  return instance;
};

export const getAxiosInstance = () => {
  if (!axiosInstance) {
    axiosInstance = createAxiosInstance();
  }
  return axiosInstance;
};

export const resetAxiosInstance = () => {
  axiosInstance = createAxiosInstance();
};
