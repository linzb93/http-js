# http-js

这是一个 JavaScript http library，是基于 axios 进行的封装。

## 选型

一、 使用 TypeScript 开发。

-   所有的函数参数、返回，以及变量都要有类型声明。
-   所有的函数，如果它的参数类型是个对象，参数类型声明请优先使用 interface，如果涉及需要联合或者交叉类型，才用 type 表示。不要将类型声明内联在参数后面。
-   所有 interface 里面的属性需要用 JSDoc 的方式备注属性类型和默认值。

二、所有的模块导入和导出，请使用 ESModule 而不是 CommonJS。ESModule 的导入是这样的，需要在文件头部编写导入的代码：

```ts
import add from './sum';
```

请不要使用动态`import`，甚至是`require`来导入。

三、代码文件不超过 300 行，当行数超出时，提醒你的用户，并将大段的函数分离出去。

四、代码尽量能够复用。

## 详细介绍

### 入口文件

项目入口文件是 index.ts。文件默认导出的是一个函数（下文用变量"topFn"代替）。因为要兼容 PC 端和移动端，两端组件库的使用方式不同，所以需要适配。

topFn 只有一个参数，参数是个对象，有两个必填属性：

-   Toast：提示框，是个函数，只接收一个参数，是 string 类型的。
-   loading：加载框，是个对象，其中有两个属性：
    -   open：函数类型的，含义是显示 loading。一个可选参数，类型是 string，显示加载时的文字，默认值是"加载中"。
    -   close: 函数类型的，含义是关闭 loading。该函数无参数。

topFn 函数返回一个函数（下文用变量"optionFn"代替），optionFn 函数接收一个对象参数，是配置项。配置项参数会和默认参数合并。这个类型需要导出。

optionFn 函数的配置项参数有以下属性：

-   baseURL：string 类型的，必填，含义是接口前缀地址，默认值是""。
-   timeout：number 类型的，含义是超时时间，默认值是 5000。
-   logApiError：boolean 类型的，含义是当接口出现异常时，上报给监控系统，默认值是 true。
-   retry：number 类型的，含义是请求失败时，重试次数，默认值是 0。
-   enhanceHeaders: 函数类型，含义是请求头的扩展函数。有两个参数。返回任意对象，参数如下：
    -   config: 配置项参数，类型和 axios request 的 config 一样。
    -   url: string 类型的，含义是请求地址
-   getToken: 函数类型，含义是获取 token 的函数，默认是从 localStorage 中获取 token 属性的值。返回 string 类型的。

optionFn 函数返回 axios 的实例（下文用变量"service"代替）。

默认导出 topFn，以及 topFn 函数返回的函数 optionFn，只是我为了在文档里面方便说明而命名的，你应该把它们改成匿名函数。

此外，在每个单独的，使用 service 的 http 请求，有自定义属性，写在\_config 属性里面，这个\_config 属性也是自定义的，不是 axios config 自带的。自定义属性用法如下：

```ts
service.post(
    '/v1/api',
    {},
    {
        _config: {
            // 接口请求不带token的
            ignoreToken: true,
        },
    }
);
```

自定义属性包括：

-   noToast: boolean 类型，含义是当接口返回报错的时候，不会调用 Toast 函数显示提示框。默认值为 false。
-   noLoading: boolean 类型，含义是接口发起请求的时候，不会显示 loading。默认值为 false。
-   ignoreToken: boolean 类型，含义是接口发起请求的时候，不需要在 headers 中添加 token 字段。默认值为 false。
-

### 拦截器

service 拦截器函数放在 interceptors 目录下，index.ts 会自动加载目录下的所有文件。拦截器文件名称根据含义来命名。

注意以下两点：

1. 请求拦截器的代码是在 interceptors 目录的 request 目录下，而不是 interceptors 目录下的 request.ts。响应拦截器同理。
2. 在 request 和 response 拦截器中的默认导出函数，它们的类型请在 axios 这个库里面查找。

拦截器的代码大致如下：

```js
// request.ts
export default function (config) {
    return config;
}

// index.ts
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
