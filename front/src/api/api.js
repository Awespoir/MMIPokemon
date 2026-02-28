// src/api/api.js
import axios from "axios";

const API_BASE = "http://localhost:3000/api";

// Token stocké en mémoire et localStorage
let token = localStorage.getItem("token") || null;

export const setToken = (t) => {
  token = t;
  if (t) localStorage.setItem("token", t);
  else localStorage.removeItem("token");
};

// ---------- AUTH ----------

// Login
export const login = async (username, password) => {
  const res = await axios.post(`${API_BASE}/auth/login`, { username, password });
  setToken(res.data.token);
  return res.data;
};

// ---------- TRAINER ----------

// Get Trainer
export const getTrainer = async () => {
  if (!token) throw new Error("No token available");
  const res = await axios.get(`${API_BASE}/trainer`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Create Trainer (optionnel si l'utilisateur est créé via register)
export const createTrainer = async (trainerName, imgUrl) => {
  if (!token) throw new Error("No token available");
  const res = await axios.post(
    `${API_BASE}/trainer`,
    { trainerName, imgUrl },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// Update Trainer
export const updateTrainer = async (data) => {
  if (!token) throw new Error("No token available");
  const res = await axios.put(`${API_BASE}/trainer`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Delete Trainer
export const deleteTrainer = async () => {
  if (!token) throw new Error("No token available");
  const res = await axios.delete(`${API_BASE}/trainer`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.status;
};

// Mark Pokemon (vu/capturé)
export const markPokemon = async (pkmnId, isCaptured) => {
  if (!token) throw new Error("No token available");
  const res = await axios.post(
    `${API_BASE}/trainer/mark`,
    { pkmnId, isCaptured },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// ---------- POKÉMON ----------

// Search Pokémon
export const searchPokemon = async ({ typeOne, typeTwo, partialName, page = 1, size = 20 }) => {
  const params = { typeOne, typeTwo, partialName, page, size };
  const res = await axios.get(`${API_BASE}/pkmn/search`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Get one Pokémon
export const getPokemon = async ({ id, name }) => {
  const params = {};
  if (id) params.id = id;
  if (name) params.name = name;

  const res = await axios.get(`${API_BASE}/pkmn`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Create Pokémon (ADMIN)
export const createPokemon = async (data) => {
  const res = await axios.post(`${API_BASE}/pkmn`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Update Pokémon (ADMIN)
export const updatePokemon = async (id, data) => {
  const res = await axios.put(`${API_BASE}/pkmn?id=${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Delete Pokémon (ADMIN)
export const deletePokemon = async (id) => {
  const res = await axios.delete(`${API_BASE}/pkmn?id=${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.status;
};

// Add region to Pokémon
export const addRegion = async (pkmnID, regionName, regionPokedexNumber) => {
  const res = await axios.post(
    `${API_BASE}/pkmn/region`,
    { pkmnID, regionName, regionPokedexNumber },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// Remove region from Pokémon (ADMIN)
export const removeRegion = async (pkmnID, regionName) => {
  const res = await axios.delete(`${API_BASE}/pkmn/region`, {
    params: { pkmnID, regionName },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.status;
};

// ---------- TYPES ----------

// Get all Pokémon types
export const getTypes = async () => {
  const res = await axios.get(`${API_BASE}/pkmn/types`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};