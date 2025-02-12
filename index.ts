import axios from 'axios';
// 导入请求拦截器
import requestInterceptor from './interceptors/request';
// 导入响应拦截器
import responseInterceptor from './interceptors/response';

// 定义 loading 对象的接口
interface Loading {
    /**
     * 显示 loading 的函数
     * @param {string} [text="加载中"] - 显示加载时的文字，默认值是"加载中"
     */
    open: (text?: string) => void;
    /**
     * 关闭 loading 的函数
     */
    close: () => void;
}

// 定义 topFn 的参数接口
interface TopFnParams {
    /**
     * 提示框函数，只接收一个 string 类型的参数
     * @param {string} message - 提示信息
     */
    Toast: (message: string) => void;
    /**
     * 加载框对象
     */
    loading: Loading;
}

// 定义 optionFn 的配置项参数接口
/**
 * optionFn 函数的配置项参数接口
 */
export interface OptionFnParams {
    /**
     * 接口前缀地址，必填
     * @default ""
     */
    baseURL: string;
    /**
     * 超时时间
     * @default 5000
     */
    timeout?: number;
    /**
     * 当接口出现异常时，上报给监控系统
     * @default true
     */
    logApiError?: boolean;
    /**
     * 请求失败时，重试次数
     * @default 0
     */
    retry?: number;
    /**
     * 请求头的扩展函数
     * @param {any} config - 配置项参数，类型和 axios request 的 config 一样
     * @param {string} url - 请求地址
     * @returns {any} 任意对象
     */
    enhanceHeaders?: (config: any, url: string) => any;
    /**
     * 获取 token 的函数，默认是从 localStorage 中获取 token 属性的值
     * @returns {string} token 值
     */
    getToken?: () => string;
}

// 默认的配置项
const defaultOptions: OptionFnParams = {
    baseURL: '',
    timeout: 5000,
    logApiError: true,
    retry: 0,
    getToken: () => localStorage.getItem('token') || '',
};

// 入口文件默认导出的函数
const topFn = (params: TopFnParams) => {
    const { Toast, loading } = params;

    return (options: OptionFnParams) => {
        // 合并配置项
        const mergedOptions = { ...defaultOptions, ...options };

        // 创建 axios 实例
        const service = axios.create({
            baseURL: mergedOptions.baseURL,
            timeout: mergedOptions.timeout,
        });

        // 添加请求拦截器
        service.interceptors.request.use(requestInterceptor);

        // 添加响应拦截器
        service.interceptors.response.use(responseInterceptor);

        return service;
    };
};

export default topFn;
