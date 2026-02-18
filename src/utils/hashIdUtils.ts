/**
 * 💡 纯 JS 实现的字符串哈希函数 (替代 crypto)
 * 这是一个经典且高效的实现，返回一个 32 位正整数
 */
export const hashIdByCrypto = (str: string): number => {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    // 经典的哈希算法 (hash * 31 + char)
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 转换为 32 位整数
  }
  // 返回正数并限制在 JavaScript 安全整数范围内
  return Math.abs(hash);
};

export async function md5LikeByCrypto(textStr: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(textStr));
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  // .slice(0, 32); // 截成32位，像MD5一样
}
