import { AxiosResponse } from 'axios';

export interface Response<T> {
  code: 0 | 1;
  data: T;
  msg: string;
}

// 1. 定义 ISO 8601 日期格式的正则
// 匹配形如：2023-12-01T12:00:00Z 或 2023-12-01T12:00:00.000Z
const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;

/**
 * 判断是否为日期字符串
 */
function isIsoDateString(value: any): boolean {
  return typeof value === 'string' && isoDateRegex.test(value);
}

/**
 * 递归遍历对象，将所有日期格式的字符串转换为 Date 对象
 */
function parseDates(body: any): any {
  if (body === null || body === undefined || typeof body !== 'object') {
    return body;
  }

  if (Array.isArray(body)) {
    return body.map(item => parseDates(item));
  }

  const newObj: any = {};
  for (const key of Object.keys(body)) {
    const value = body[key];

    // 如果是日期字符串，直接转换
    if (isIsoDateString(value)) {
      newObj[key] = new Date(value);
    }
    // 如果是对象或数组，递归处理
    else if (typeof value === 'object') {
      newObj[key] = parseDates(value);
    }
    // 其他情况保持原样
    else {
      newObj[key] = value;
    }
  }
  return newObj;
}

// 修改你的 deserializer 函数
export function deserializer<T>(response: AxiosResponse<Response<T>>): T {
  // 注意：这里返回类型直接写 T 即可，或者用你之前的 WithDateFields<T>
  // 如果你的 T 定义里已经是 Date 类型了（如 Ledger 接口），这里直接返回 T 最方便。

  const rawData = response.data.data;
  return parseDates(rawData) as T;
}
