/**
 * @description HTTP请求库，基于axios封装
 * @module http-js
 */

import axios from 'axios';
import reqInterceptor from './interceptors/request';
import resInterceptor from './interceptors/response';

/**
 * HTTP服务实例
 * @type {axios}
 */
const service = axios.create({
    baseURL: 'https://api.diankeduo.net/meituan',
});

service.interceptors.request.use(reqInterceptor);
service.interceptors.response.use(resInterceptor);

export default service;
