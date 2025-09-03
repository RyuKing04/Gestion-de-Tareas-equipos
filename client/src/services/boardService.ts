import axios from "axios";

const API = "http://localhost:5000/api"; // Cambiar en producción

// Configuración de axios con el token
const api = axios.create({
  baseURL: API,
});

// Interceptor para agregar el token a todas las requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const boardService = {
  // Crear un nuevo tablero
  createBoard: async (nombre: string) => {
    const res = await api.post("/boards", { nombre });
    return res.data;
  },

  // Obtener todos los tableros del usuario
  getBoards: async () => {
    const res = await api.get("/boards");
    return res.data;
  },

  // Eliminar un tablero
  deleteBoard: async (id: string) => {
    const res = await api.delete(`/boards/${id}`);
    return res.data;
  },

  // Actualizar un tablero
  updateBoard: async (id: string, updates: any) => {
    const res = await api.put(`/boards/${id}`, updates);
    return res.data;
  }
};