import axios from 'axios';

// console.log('Backend Base URL:', process.env.REACT_APP_BACKEND_BASE_URL);

export default axios.create({
    baseURL: process.env.REACT_APP_BACKEND_BASE_URL,
    timeout: 5000,
    credentials: "include"
});