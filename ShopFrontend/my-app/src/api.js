import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.10.19:5000",
});

export default api;
