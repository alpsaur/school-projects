import axios from 'axios';
//import authService from './authService';

axios.interceptors.request.use(
    (config) => {
        //const user = authService.getCurrentUser();
        //if (user.token) {
        //    config.headers['Authorization'] = 'Bearer ' + user.token;
        //}
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
