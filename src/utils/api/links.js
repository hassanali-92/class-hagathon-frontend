import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
const getConfig = () => ({ headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` } });
export const getMyLinks = () => axios.get(`${API_BASE_URL}/links/me`, getConfig()).then(r => r.data);
export const createLink = (data) => axios.post(`${API_BASE_URL}/links`, data, getConfig()).then(r => r.data);
export const updateLink = (id, data) => axios.put(`${API_BASE_URL}/links/${id}`, data, getConfig()).then(r => r.data);
export const deleteLink = (id) => axios.delete(`${API_BASE_URL}/links/${id}`, getConfig()).then(r => r.data);
export const toggleLink = (id) => axios.patch(`${API_BASE_URL}/links/${id}/toggle`, {}, getConfig()).then(r => r.data);