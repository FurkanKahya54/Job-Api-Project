import axios from "axios";

// Tarayıcıda çalışacak: localhost kullan
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export const fetchJobs = async ({ page = 1, per_page = 10, type = "" } = {}) => {
  const params = { page, per_page };
  if (type) params.type = type;
  const res = await axios.get(`${API_BASE}/jobs`, { params });
  return res.data;
};

export const runOSJob = async (command) => {
  const res = await axios.post(`${API_BASE}/job/os`, { command });
  return res.data;
};

export const runCrawlJob = async (url) => {
  const res = await axios.post(`${API_BASE}/job/crawl`, { url });
  return res.data;
};
