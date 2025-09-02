import axios from "axios";

const API = "http://localhost:5000/api/board";

export const getTasks = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(API, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createTask = async (title: string, column: string) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(API, { title, column }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
