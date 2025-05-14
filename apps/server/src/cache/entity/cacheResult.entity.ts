/**
 * 缓存查询结果对象
 * 用于封装文章相关的查询返回结构
 */
export class CacheResult {
  /**
   * 返回状态码
   */
  code!: number;

  /**
   * 返回消息
   */
  message!: string;

  /**
   * 返回数据
   */
  data?: any;
}
