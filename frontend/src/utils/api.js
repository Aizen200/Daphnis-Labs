import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  headers: { "Content-Type": "application/json" },
});
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err.response?.data || err.message);
    throw err;
  }
);

export const commitRound = async () => (await API.post("/rounds/commit")).data;

export const startRound = async (roundId, payload) =>
  (await API.post(`/rounds/${roundId}/start`, payload)).data;

export const revealRound = async (roundId) =>
  (await API.post(`/rounds/${roundId}/reveal`)).data;

export const getRound = async (roundId) =>
  (await API.get(`/rounds/${roundId}`)).data;

export const verifyRound = async (params) =>
  (await API.get("/verify", { params })).data;