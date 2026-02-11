const getYear = (date: Date) => date.getFullYear();
const getMonth = (date: Date) => date.getMonth() + 1;
const getDate = (date: Date) => date.getDate();

const getTodayStr = (date?: Date) => {
  if (date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
};

const startOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const endOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const isSameYear = (d1: Date, d2: Date) => {
  return d1.getFullYear() === d2?.getFullYear();
};

const isSameMonth = (d1: Date, d2: Date) => {
  return d1.getFullYear() === d2?.getFullYear() && d1.getMonth() === d2?.getMonth();
};

const isSameDay = (d1: Date, d2: Date) => {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
};

const dateDiff = (date1: Date, date2: Date) => {
  // 将两个日期转换为 UTC 的 00:00:00（消除时区影响）
  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

  // 计算毫秒差并转换为天数（取整）
  const diffMs = utc2 - utc1;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

const formatDate = (date: Date, formatStr: string): string => {
  const year = getYear(date).toString();
  const month = getMonth(date).toString();
  const day = getDate(date).toString();
  const dayOfWeek = date.getDay();

  if (formatStr === 'YYYY') {
    return `${year}年`;
  } else if (formatStr === 'YYYY MM') {
    return `${year}年${month}月`;
  } else if (formatStr === 'MM') {
    return `${month.padStart(2, '0')}月`;
  } else if (formatStr === 'dd') {
    return `${day}日`;
  } else if (formatStr === 'MMM dd, EEEE') {
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return `${month}月${day.padStart(2, '0')}日，${days[dayOfWeek]}`;
  } else if (formatStr === 'YYYY-MM-DD') {
    return `${year}年${month.padStart(2, '0')}月${day.padStart(2, '0')}日`;
  }
  return date.toDateString();
};

export {
  getYear,
  getMonth,
  getDate,
  getTodayStr,
  startOfMonth,
  endOfMonth,
  isSameYear,
  isSameMonth,
  isSameDay,
  dateDiff,
  formatDate,
};
