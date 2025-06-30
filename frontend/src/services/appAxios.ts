import axios from 'axios';

const appAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
});

appAxios.interceptors.request.use(
  async (config) => {
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      config.headers['Authorization'] = `Bearer ${userToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

appAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('userToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default appAxios;
