import axios from "axios";

const API_BASE = "https://reqres.in/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export interface User {
  id?: number; 
  first_name: string;
  last_name: string;
  email: string;
}

export const login = async (email: string, password: string): Promise<void> => {
  const response = await api.post<{ token: string }>("/login", {
    email,
    password,
  });
  sessionStorage.setItem("authToken", response.data.token); 
};

export const fetchUsers = async (page: number = 1): Promise<User[]> => {
  const response = await api.get(`/users`, { params: { page } });
  return response.data.data;
};

export const fetchUser = async (id: number): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data.data; 
};

export const createUser = async (user: User): Promise<User> => {
  const response = await api.post(`/users`, user);
  return response.data; 
};

export const updateUser = async (id: number, user: User): Promise<User> => {
  const response = await api.put(`/users/${id}`, user);
  return response.data; 
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};
