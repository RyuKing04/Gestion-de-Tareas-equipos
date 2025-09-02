import axios from "axios";

const API = "http://localhost:5000/api"; // cambiar en producción

export const login = async (email: string, password: string) => {
  const res = await axios.post(`${API}/login`, { email, password });
  const { token, usuario } = res.data;

  // Guardar token en localStorage
  localStorage.setItem("token", token);

  return usuario;
};

export const register = async (nombre: string, email: string, password: string) => {
  const res = await axios.post(`${API}/register`, { nombre, email, password });
  return res.data;
};
