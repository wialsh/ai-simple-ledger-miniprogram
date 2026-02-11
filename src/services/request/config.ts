const isH5 = process.env.TARO_ENV === 'h5';
const isDev = process.env.NODE_ENV === 'development';

let baseUrl = '';

if (isH5 && isDev) {
  // H5 开发环境走代理
  baseUrl = '/api';
} else {
  // 其他情况（小程序所有环境、H5 生产环境）走环境变量
  baseUrl = process.env.TARO_APP_BASE_URL || '';
}

export const BASE_URL = baseUrl;
export const TIMEOUT = 5000;
export const TARO_ENV = process.env.TARO_ENV || 'unknown';
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const CLOUD_ENV = process.env.TARO_APP_CLOUD_ENV || '';
export const X_WX_SERVICE = process.env.TARO_APP_X_WX_SERVICE || '';
