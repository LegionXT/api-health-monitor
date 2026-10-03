import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const getApis = () => API.get("/apis");

export const getStats = () => API.get("/apis/stats/summary");

export const addApi = (data) => API.post("/apis", data);

export const deleteApi = (id) => API.delete(`/apis/${id}`);

export const checkApi = (id) => API.post(`/apis/${id}/check`);

export const getHistory = (id) => API.get(`/apis/${id}/history`);