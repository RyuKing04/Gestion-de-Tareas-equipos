import axios from "axios";

const API = "http://localhost:5000/api";

export const login = async (email: string, password: string) => {
  const res = await axios.post(`${API}/login`, { email, password });
  const { token, usuario } = res.data;
  localStorage.setItem("token", token);
  return usuario;
};

export const register = async (nombre: string, email: string, password: string) => {
  const res = await axios.post(`${API}/register`, { nombre, email, password });
  return res.data;
};

// NUEVA FUNCIÓN: Obtener usuarios
export const getUsers = async (): Promise<any[]> => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API}/users`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};