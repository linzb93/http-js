import axios, { AxiosResponse } from 'axios';

// 响应拦截器
export default (response: AxiosResponse): any => {
    const data = response.data;
    if (typeof data !== 'object') {
        throw new Error('接口返回格式错误');
    }
    if (data.code === 200) {
        return data.result;
    } else {
        throw new Error(data.message);
    }
};
