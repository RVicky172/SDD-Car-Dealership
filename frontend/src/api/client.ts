import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const apiClient = axios.create({
  baseURL: '/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach access token to every request
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401/403 responses globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
