# http-js

这是一个 JavaScript http library，是基于 axios 进行的封装。NodeJS 模块请使用 ESModule 而不是 CommonJS。

项目入口文件是 index.js。文件默认导出的是 axios 的实例（下文用变量"service"代替），设置 baseURL 为"https://api.diankeduo.net/meituan"。
service 拥有一个 requst 拦截器，会读取浏览器 localStorage 的 token 字段值，作为请求头中的 token 属性值。
service 拥有一个 response 拦截器，会根据返回的 response.data 的值按顺序做以下区分：

-   是不是一个对象，如果不是，抛出错误，错误信息是“接口返回格式错误”
-   如果是个对象，且对象中的 code 属性值为 200。如果是的话，返回对象中的 result 属性值，否则抛出错误，错误内容是这个对象中的 message 属性值。

将 request 拦截器函数代码放在 interceptors/request 目录下，例如

```js
// request.js
export default function (config) {
    return config;
}

// index.js
import req from './interceptors/request';
axios.interceptors.request.use(req);
```

将 response 拦截器代码放在 interceptors/response 目录下,代码格式同上。
