/*
 * @Author: linlunyong 
 * @Date: 2019-12-06 10:34:55 
 * @Last Modified by: linlunyong
 * @Last Modified time: 2020-06-17 11:40:06
 */

const bridge = (() => {
  const win = window
  const JS_BRIDGE_PROTOCOL_SCHEMA = 'onez'
  const onezJsBridge = win.onezJsBridge || (win.onezJsBridge = {})
  let increase = 1

  const exposeMethod = {
    callMethod: (clazz, method, param, callback) => { // 调起app方法
      // console.log('h5通知app')
      const port = privateMethod.generatePort()
      if (typeof callback !== 'function') {
        callback = null
      }
      privateMethod.registerCallback(port, callback)
      privateMethod.callNativeMethod(clazz, port, method, param)
    },
    onComplete: (port, result) => { // app 回调h5函数
      privateMethod.onNativeComplete(port, result)
    },
    registerMethod: (method, callback) => { // js注册函数 供app主动调用
      if (typeof callback !== 'function') {
        callback = null
        console.warn('callback is not "function"')
      }
      privateMethod.messageHandlers[method] = callback
    },
    nativeInvokeJs: (method, result) => { // app 主动调用h5函数
      const handler = privateMethod.messageHandlers[method]
      if (!handler) {
        console.error('method not found')
      } else {
        handler(privateMethod.str2Json(result))
      }
    }
  }

  const privateMethod = {
    callbacks: {},
    messageHandlers: {},
    callNativeMethod: (clazz, port, method, param) => {
      const jsonStr = privateMethod.json2Str(param)
      const uri = JS_BRIDGE_PROTOCOL_SCHEMA + "://" + clazz + ":" + port + "/" + method + "?" + jsonStr
      win.prompt(uri, "")
    },
    registerCallback: (port, callback) => {
      if (callback) {
        privateMethod.callbacks[port] = callback
      }
    },
    getCallback: port => {
      let call = {}
      if (privateMethod.callbacks[port]) {
        call.callback = privateMethod.callbacks[port]
      } else {
        call.callback = null
      }
      return call
    },
    unRegisterCallback: port => {
      if (privateMethod.callbacks[port]) {
        delete privateMethod.callbacks[port]
      }
    },
    onNativeComplete: (port, result) => {
      // console.log('app回调通知h5')
      // console.log(port, result)
      const resultJson = privateMethod.str2Json(result)
      const callback = privateMethod.getCallback(port).callback
      privateMethod.unRegisterCallback(port) // 释放内存
      if (callback) {
        callback && callback(resultJson)
      }
    },
    /**
     * 随机port 作用是为了标识Js中的回调function 及时释放内存
     */
    generatePort: () => {
      return Math.floor(Math.random() * (1 << 50)) + '' + increase++
    },
    str2Json: str => {
      if (str && typeof str === 'string') {
        try {
          return JSON.parse(str)
        } catch (error) {
          return {
            status: {
              code: 1,
              msg: 'params parse error!'
            }
          }
        }
      } else {
        return str || {}
      }
    },
    json2Str: json => {
      if (json && typeof json === 'object') {
        return JSON.stringify(json)
      } else {
        return json || ''
      }
    }
  }
  for (let index in exposeMethod) {
    if (exposeMethod.hasOwnProperty(index)) {
      if (!Object.prototype.hasOwnProperty.call(onezJsBridge, index)) {
        onezJsBridge[index] = exposeMethod[index];
      }
    }
  }
})()

export default bridge