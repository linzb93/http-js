/**
 * @description HTTP请求库，基于axios封装
 * @module http-js
 */

import axios from 'axios';

/**
 * HTTP服务实例
 * @type {axios}
 */
const service = axios.create({
    baseURL: 'https://api.diankeduo.net/meituan',
});

// 请求拦截器
service.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['token'] = token;
    }
    return config;
});

// 响应拦截器
service.interceptors.response.use((response) => {
    const data = response.data;
    if (data && data.code === 200) {
        return data.result;
    } else {
        throw new Error(data.message);
    }
});

export default service;
