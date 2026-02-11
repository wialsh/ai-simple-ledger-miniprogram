export interface Response<T> {
  code: 0 | 1;
  data: T;
  msg: string;
}
