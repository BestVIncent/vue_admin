/**
 * 使用localStorage存储数据的工具模块
 * 1. 函数
 * 2. 对象
 * 需要向外暴露一个或多个的区别
 */
export default {
  save (key, val) {
    window.localStorage.setItem(key, JSON.stringify(val))
  },
  read (key) {
    return JSON.parse(window.localStorage.getItem(key))
  },
  remove (key) {
    window.localStorage.removeItem(key)
  },
  clear () {
    window.localStorage.clear()
  }
}
