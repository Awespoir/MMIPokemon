import axios from "axios";

const API_BASE = "http://localhost:3000/api"; // change si ton API tourne ailleurs

let token = null;

export const setToken = (t) => {
  token = t;
};

export const login = async (username, password) => {
  const res = await axios.post(`${API_BASE}/auth/login`, { username, password });
  setToken(res.data.token);
  return res.data;
};

export const getTrainer = async () => {
  const res = await axios.get(`${API_BASE}/trainer`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createTrainer = async (trainerName, imgUrl) => {
  const res = await axios.post(
    `${API_BASE}/trainer`,
    { trainerName, imgUrl },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const updateTrainer = async (data) => {
  const res = await axios.put(`${API_BASE}/trainer`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteTrainer = async () => {
  const res = await axios.delete(`${API_BASE}/trainer`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.status;
};

export const markPokemon = async (pkmnId, isCaptured) => {
  const res = await axios.post(
    `${API_BASE}/trainer/mark`,
    { pkmnId, isCaptured },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};