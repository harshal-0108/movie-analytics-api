import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const getAnalytics = async () => {
  const response = await api.get("/movies/analytics");
  return response.data;
};