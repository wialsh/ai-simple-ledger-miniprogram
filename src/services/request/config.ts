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
// --- 配置常量 ---
export const CLOUD_ENV = 'prod-6gn4gq2x618b4775'; // 替换：云环境ID
export const X_WX_SERVICE = 'springboot-aqak-004'; // 替换：服务名称
