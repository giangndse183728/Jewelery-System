import axios from 'axios';
import { API_BASE_URL } from '../config/serverApiConfig';

axios.defaults.baseURL = API_BASE_URL;
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('TOKEN');
        if (token && token !== 'undefined') {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const request = {
    get: async (url) => {
        try {
            return await axios.get(url);
        } catch (error) {
            if (error.response) {
                console.error(error.response.data);
                console.error(error.response.status);
                console.error(error.response.headers);
            }
            return null;
        }
    },
    post: async (url, data, config = {}) => {
        try {
            return await axios.post(url, data, config);
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    put: async (url, data) => {
        try {
            return await axios.put(url, data);
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    delete: async (url) => {
        try {
            return await axios.delete(url);
        } catch (error) {
            console.error(error);
            return null;
        }
    },
};

export default request;
