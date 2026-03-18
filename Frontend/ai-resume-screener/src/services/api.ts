import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto logout if token expires
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ─── Auth APIs ────────────────────────────────────────────────
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  getMe: () => api.get("/auth/me"),

  updateProfile: (data: { name?: string; email?: string }) =>
    api.put("/auth/profile", data),
};

// ─── Resume APIs ──────────────────────────────────────────────
export const resumeAPI = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/resume/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getMyResumes: () => api.get("/resume/my-resumes"),
};

// ─── Analysis APIs ────────────────────────────────────────────
export const analysisAPI = {
  analyze: (resumeId: number, jobDescription: string) =>
    api.post("/analyze/", { resume_id: resumeId, job_description: jobDescription }),
};

// ─── History APIs ─────────────────────────────────────────────
export const historyAPI = {
  getAll: () => api.get("/history/"),
  getOne: (id: number) => api.get(`/history/${id}`),
  delete: (id: number) => api.delete(`/history/${id}`),
};

// ─── Profile APIs ─────────────────────────────────────────────
export const profileAPI = {
  getProfile: () => api.get("/profile/"),
};

export default api;