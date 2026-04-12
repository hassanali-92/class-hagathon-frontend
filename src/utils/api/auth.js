import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
export const registerUser = (data) => axios.post(`${API_BASE_URL}/auth/register`, data).then(r => r.data);
export const loginUser = (data) => axios.post(`${API_BASE_URL}/auth/login`, data).then(r => r.data);
export const registerAdmin = (data) => axios.post(`${API_BASE_URL}/auth/register-admin`, data).then(r => r.data);