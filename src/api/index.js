/*
此处用来书写所有的ajax请求
 */
import ajax from './ajax'
export const getUserInfo = (userId) => ajax(`/user/info/${userId}`)
export const deleteUser = (userId) => ajax(`/user/delete/${userId}`, '', 'DELETE')
export const login = (loginForm) => ajax('/login', loginForm, 'POST')
