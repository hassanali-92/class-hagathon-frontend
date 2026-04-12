import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
const getConfig = () => ({ headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` } });
export const getMyProfile = () => axios.get(`${API_BASE_URL}/profile/me`, getConfig()).then(r => r.data);
export const updateProfile = (data) => axios.post(`${API_BASE_URL}/profile`, data, getConfig()).then(r => r.data);
export const getPublicProfile = (username) => axios.get(`${API_BASE_URL}/profile/${username}`).then(r => r.data);