# http-js

这是一个 JavaScript http library，是基于 axios 进行的封装。

## 选型

-   使用 TypeScript 开发，所有的函数参数、返回，以及变量都要有类型声明。
-   NodeJS 模块请使用 ESModule 而不是 CommonJS。
-   代码文件不超过 300 行，当行数超出时，提醒你的用户，并将大段的函数分离出去。

## 详细介绍

### 入口文件

项目入口文件是 index.ts。文件默认导出的是一个函数（下文用变量"topFn"代替）。因为要兼容 PC 端和移动端，两端组件库的使用方式不同，所以需要适配。

topFn 只有一个参数，参数是个对象，有两个属性：

-   Toast：提示框，是个函数，只接收一个参数，是 string 类型的。
-   loading：加载框，是个对象，其中有两个属性：
    -   open：函数类型的，含义是显示 loading。一个可选参数，类型是 string，显示加载时的文字，默认值是"加载中"。
    -   close: 函数类型的，含义是关闭 loading。该函数无参数。

topFn 函数返回一个函数（下文用变量"optionFn"代替），optionFn 函数接收一个对象参数，是配置项。配置项参数会和默认参数合并。
optionFn 函数的配置项参数有以下属性：

optionFn 函数的配置项参数有以下属性：

-   baseURL：string 类型的，含义是接口前缀地址，默认值是""。
-   timeout：number 类型的，含义是超时时间，默认值是 5000。
-   logApiError：boolean 类型的，含义是当接口出现异常时，上报给监控系统，默认值是 true。
-   retry：number 类型的，含义是请求失败时，重试次数，默认值是 0。
-   enhanceHeaders: 函数类型，含义是请求头的扩展函数。有两个参数。返回任意对象，参数如下：
    -   config: 配置项参数
    -   url: 请求地址
-   getToken: 函数类型，含义是获取 token 的函数，默认是从 localStorage 中获取 token 属性的值。

optionFn 函数返回 axios 的实例（下文用变量"service"代替）。

### 拦截器

service 拦截器函数放在 interceptors 目录下，index.ts 会自动加载目录下的所有文件。拦截器文件名称根据含义来命名。
拦截器的代码大致如下：

```js
// request.js
export default function (config) {
    return config;
}

// index.js
import req from './interceptors/request';
axios.interceptors.request.use(req);
```

### request 拦截器

request 拦截器代码在 interceptors/request 目录中。
service 只有一个拦截器，包含功能如下：

-   读取浏览器 localStorage 的 token 字段值，作为请求头中的 token 属性值。

### response 拦截器

response 拦截器代码在 interceptors/response 目录中。
response 拦截器函数会根据返回的 response.data 的值按顺序做以下区分：

-   是不是一个对象，如果不是，抛出错误，错误信息是“接口返回格式错误”
-   如果是个对象，且对象中的 code 属性值为 200。如果是的话，返回对象中的 result 属性值，否则抛出错误，错误内容是这个对象中的 message 属性值。
