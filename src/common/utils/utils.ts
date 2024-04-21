import { RedisKeyPrefix } from '../enums/redis-key-prefix.enum'
import dayjs from 'dayjs'
/**
 * 获取 模块前缀与唯一标识 整合后的 redis key
 * @param moduleKeyPrefix 模块前缀
 * @param id id 或 唯一标识
 */
export function getRedisKey(moduleKeyPrefix: RedisKeyPrefix, id: string | number): string {
  return `${moduleKeyPrefix}${id}`
}

/**
 * 下划线转驼峰
 * @param str
 * @returns
 */
export function toCamelCase(str: string): string {
  return str.replace(/_(\w)/g, (_, c) => c.toUpperCase())
}

/**
 * 驼峰命名转下划线
 * @param str
 * @returns
 */
export function toUnderline(str) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase()
}

/**
 * 对象 key 下划线转驼峰，驼峰转下划线
 * @param target 目标
 * @param targetType
 * @param cutStr 对象 key 裁剪字段
 * @returns
 */
export function objAttrToCamelOrUnderline(
  target: Record<string, any>,
  targetType: 'camelCase' | 'underline',
  cutStr?: string,
) {
  const _target = {}
  Object.keys(target).forEach((k) => {
    let _k = k
    if (!!cutStr) {
      _k = _k.replace(cutStr, '')
    }
    _k = targetType === 'camelCase' ? toCamelCase(_k) : toUnderline(_k)
    _target[_k] = target[k]
  })
  return _target
}

export interface ListToTreeOptions {
  root?: string | number
  pidKey?: string
  idKey?: string
  childKey?: string
}

/**
 * 扁平数组转 树结构
 * @param source
 * @param param
 */
export function listToTree(
  source: any[],
  { root = 0, pidKey = 'pid', idKey = 'id', childKey = 'children' }: ListToTreeOptions
) {
  function getNode(id: string | number) {
    const node = []
    for (let i = 0, len = source.length; i < len; i++) {
      if (source[i][pidKey] === id) {
        const children = getNode(source[i][idKey])
        if (children.length > 0) source[i][childKey] = children
        node.push(source[i])
      }
    }
    return node
  }
  return getNode(root)
}

export const dateStrFormat = (dateStr: string, format?: string) => {
  try {
    return dayjs(dateStr).format(format || 'YYYY-MM-DD HH:mm:ss')
  } catch (error) {
    console.error(error)
  }
}

export const dateSqlQuery = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    // 获取当前日期的年、月、日信息
    let year = date.getFullYear(); // 年份
    let month = date.getMonth() + 1; // 月份（注意需要+1）
    let day = date.getDate() + 1; // 日期
    const returnDate = `${year}-${month}-${day}`;
    return returnDate
  } catch (error) {
    console.error(error)
  }
}

export const dateTimeSqlQuery = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    // 获取当前日期的年、月、日、时、分、秒信息
    let year = date.getFullYear(); // 年份
    let month = date.getMonth() + 1; // 月份（注意需要+1）
    let day = date.getDate(); // 日期
    let hour = date.getHours(); // 时
    let minute = date.getMinutes(); // 分
    let second = date.getSeconds(); // 秒
    const returnDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    return returnDate
  } catch (error) {
    console.error(error)
  }
}


/**
 * 获取过去几个月
 * @param len12
 * @param
 */
export const formerlyMonth = (len = 5) => {
  let currentDate = new Date(); // 当前月份
  let pastTwelveMonthsArray = []; // 存放过去12个月的日期数组
  
  for (let i = len; i >= 0; i--) {
    let monthIndex = currentDate.getMonth(); // 获取当前月份索引（从0开始）
    if (monthIndex === 0) { // 如果已经到了第一个月，则需要将年份减少1并设置为最后一个月
      currentDate.setFullYear(currentDate.getFullYear() - 1);
      currentDate.setMonth(11);
      pastTwelveMonthsArray[i] = formatDateString(currentDate);
    } else {
      currentDate.setMonth(monthIndex - 1); // 否则直接将月份索引减少1
      pastTwelveMonthsArray[i] = formatDateString(currentDate);
    }
  }

  // 格式化日期字符串函数
  function formatDateString(dateObj) {
    let year = dateObj.getFullYear().toString();
    let month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    // let day = (dateObj.getDate() + 1 ).toString().padStart(2, '0');

    return `${year}年${month}月`;
  }

  return pastTwelveMonthsArray;
}


/**
 * 创建随机数
 * @param length 随机数长度
 */
export const RandomNumber = (length = 32) =>{
  let str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  str += '0123456789'
  let _str = ''
  for (let i = 0; i < length; i++) {
    var rand = Math.floor(Math.random() * str.length)
    _str += str[rand];
  }
  return _str
}