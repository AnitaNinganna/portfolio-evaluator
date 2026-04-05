import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor for adding auth headers if needed
API.interceptors.request.use(
  (config) => {
    // Add any auth headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.message);
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }

    if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }

    const { status, data } = error.response;

    switch (status) {
      case 400:
        throw new Error(data.error || 'Bad request. Please check your input.');
      case 401:
        throw new Error('Authentication failed. Please check your credentials.');
      case 403:
        throw new Error('Access forbidden. You may not have permission.');
      case 404:
        throw new Error(data.error || 'Resource not found.');
      case 429:
        throw new Error('Too many requests. Please wait and try again.');
      case 500:
        throw new Error('Server error. Please try again later.');
      default:
        throw new Error(data.error || `Request failed with status ${status}`);
    }
  }
);

export default API;

