import axios from "axios";
import config from "../../config";

const adminApi = axios.create({
  baseURL: config.apiHost,
  withCredentials: true,
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = "Bearer " + token;
  return config;
});

export default adminApi;
