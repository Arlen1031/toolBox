
/**
 * 判断是否对象
 * @param {*} obj 
 */
export const isObject = obj => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 * 是否数组
 * @param {*}} arr 
 */
export const isArray = arr => {
  return Object.prototype.toString.call(arr) === '[object Array]'
}