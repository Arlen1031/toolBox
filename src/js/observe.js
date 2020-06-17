/**
 * 手写Vue数据劫持 核心代码
 * 基本流程 
 * 1. new Vue() // 实例化Vue对象
 * 2. initState() // 初始化一系列方法
 * 3. initData (vm) { // 初始化数据
 *      let data = vm.$options.data
 *      data = typeof data === 'function' ? data.call(vm) : data // 如果data为函数则让data一直指向vm
 *      observe(data) // 4. 劫持数据 
 *    }
 * 5. new Observe() -> this.observeObj(value) || this.observeArr(value) -> Object.defineProperty()
 */


import { isObject, isArray } from './utils'


const arrayProto = Array.prototype // 原生数组的原型对象
const newArrayProto = Object.create(arrayProto) // 原型继承创建新的原型对象 避免直接篡改Array.prototype导致所有数组实例受影响

const arrayMethods = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse'] // 劫持数组的方法

arrayMethods.forEach(method => {
  console.log(method)
  const originArrayMethod = arrayProto[method]
  newArrayProto[method] = function (...args) {
    console.log(this) // 方法均被你的值调用 所以这里的this指向你的数组
    const result = originArrayMethod.apply(this, args)
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = arguments
        break;
      case 'splice':
        inserted = args.slice(2) // 第三个元素
        break;
    }
    if (inserted) {
      this.__ob__.observeArr(inserted) // 对照55行
    }

    console.log('监听数组被改', inserted)
    renderView() // 告知视图渲染

    return result
  }
})

console.log(newArrayProto)


class Observe {
  constructor(value) {
    Object.defineProperty(value, '__ob__', { // 通过value.__ob__.observeArr()能够直接访问
      value: this,
      enumerable: false,
      writable: true,
      configurable: true
    })
    if (isArray(value)) { // 数组劫持
      value.__proto__ = newArrayProto // 改变当前数组的方法
      this.observeArr(value)
    } else { // 对象劫持
      this.observeObj(value)
    }
  }
  observeObj (obj) {
    const keys = Object.keys(obj)
    keys.forEach(key => {
      defineProperty(obj, key, obj[key])
    })
  }
  observeArr (arr) {
    for (let i = 0; i < arr.length; i++) {
      observe(arr[i])
    }
  }
}

/**
 * 对象劫持函数
 * @param {*} obj 
 * @param {*} key 
 * @param {*} value 
 */
const defineProperty = (obj, key, value) => {
  observe(value) // 递归劫持
  Object.defineProperty(obj, key, {
    get () {
      return value
    },
    set (newValue) {
      console.log('监听对象被改')
      if (value === newValue) return
      observe(newValue)
      value = newValue

      // 视图渲染
      renderView()
    }
  })
}


const renderView = () => {
  // 视图渲染相关逻辑函数
}

/**
 * 实例化 监测
 * @param {*} data 
 */
const observe = data => {
  if (!isObject(data) && !isArray(data)) return // 非对象
  return new Observe(data)
}

export default observe
