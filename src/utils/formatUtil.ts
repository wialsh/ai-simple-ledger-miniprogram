export const formatNumber = (num: number) => {
  // 1. 先判断是不是 number 类型
  if (typeof num !== 'number' || isNaN(num)) {
    return '';
  }

  // 2. 判断是否为整数
  if (Number.isInteger(num)) {
    return num.toString(); // 整数：直接转字符串
  } else {
    return num.toFixed(2); // 小数：保留两位
  }
};
