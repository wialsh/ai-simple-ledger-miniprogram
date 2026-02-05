import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Taro from '@tarojs/taro';
import { BASE_URL, TIMEOUT } from './config';

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  // 核心修改：手动编写适配器
  adapter: (config: InternalAxiosRequestConfig) => {
    return new Promise((resolve, reject) => {
      // 处理 URL：如果是相对路径，需要手动拼接 baseURL
      // (虽然 axios 内部会拼接，但在自定义 adapter 中有时候需要自己处理以防万一)
      let url = config.url || '';
      if (!url.startsWith('http') && !url.startsWith('https') && config.baseURL) {
        // 去除重复的斜杠
        const baseURL = config.baseURL.endsWith('/') ? config.baseURL.slice(0, -1) : config.baseURL;
        const subURL = url.startsWith('/') ? url : `/${url}`;
        url = `${baseURL}${subURL}`;
      }

      // 2. 发起 Taro 请求
      Taro.request({
        url: url,
        method: (config.method?.toUpperCase() || 'GET') as any, // 确保方法大写
        data: config.data,
        /**
         * 微信小程序要求 header 必须是一个对象，不能是 undefined 或 null
         * 在 Axios 中，如果请求没有设置特殊的 header，config.headers 可能会是 undefined。
         * 当你把它直接传给 Taro.request 时，就报错了
         */
        header: config.headers || {}, // Axios 是 headers，Taro 是 header
        success: res => {
          // 3. 构造 Axios 需要的响应结构
          const response: AxiosResponse = {
            data: res.data,
            status: res.statusCode,
            statusText: res.errMsg || 'OK',
            headers: res.header,
            config: config,
            request: null,
          };

          // 4. 模拟 Axios 的验证状态码逻辑 (默认 2xx 才算成功)
          // 如果不判断，Taro 会把 404/500 也当成 success，导致进不到你的 error 拦截器
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            // 抛出错误，为了让后面的拦截器能捕获到 error.response
            reject({
              message: `Request failed with status code ${res.statusCode}`,
              config,
              code: res.statusCode.toString(),
              request: null,
              response, // 重要：把响应挂载上去，否则拦截器里 error.response 为 undefined
            });
          }
        },
        fail: err => {
          // 网络层面的失败（断网、DNS解析失败等）
          reject({
            message: err.errMsg || 'Network Error',
            config,
            request: null,
          });
        },
      });
    });
  },
});

// 响应拦截器
apiClient.interceptors.response.use(
  response => {
    // 直接返回 Result 对象
    return response;
  },
  error => {
    // 失败回调: 处理 http 网络错误的
    let message = '';
    console.log('error', error);

    // 加上 ?. 防止网络断开时 response 为 undefined 导致报错
    const status = error.response?.status;

    switch (status) {
      case 401:
        message = 'TOKEN过期';
        break;
      case 403:
        message = '无权访问';
        break;
      case 404:
        message = '请求地址错误';
        break;
      case 500:
        message = '服务器出现问题';
        break;
      default:
        message = error.message || '网络出现问题';
        break;
    }

    // 提示错误信息 (Taro 环境建议用 Taro.showToast)
    // console.error(message);
    Taro.showToast({
      title: message,
      icon: 'none',
      duration: 2000,
    });

    return Promise.reject(error);
  }
);

export default apiClient;
