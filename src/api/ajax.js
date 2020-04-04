import axios from 'axios'
import storageUtil from '@/util/localStorageUtil'
// 全局请求地址
const BASE_URL = 'http://localhost:8888/api/private/v1/'
axios.defaults.baseURL = BASE_URL
axios.interceptors.request.use(config => {
  config.headers.Authorization = storageUtil.read('token')
  return config
})
/*
ajax请求封装模块
@return: promise对象(异步返回数据response.data)
 */
export default function ajax (url, data = {}, type = 'GET') {
  return new Promise((resolve, reject) => {
    let promise
    // 如果是GET请求封装url参数
    if (type === 'GET') {
      let dataStr = ''
      Object.keys(data).forEach(key => {
        dataStr += key + '=' + data[key] + '&'
      })
      if (dataStr !== '') {
        dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
        url = url + '?' + dataStr
      }
      promise = axios.get(url)
    } else if (type === 'POST') { // 如果是Post请求发送url和data数据
      promise = axios.post(url, data)
    } else if (type === 'DELETE') {
      promise = axios.delete(url)
    } else if (type === 'PUT') {
      promise = axios.put(url, data)
    }
    // 进行回调处理
    promise.then((response) => {
      resolve(response.data)
    }).catch((error) => {
      reject(error)
    })
  })
}
