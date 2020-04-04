/*
此处用来书写所有的ajax请求
 */
import ajax from './ajax'
export const getUser = (userId) => ajax(`/users/${userId}`)
export const deleteUser = (userId) => ajax(`/users/${userId}`, '', 'DELETE')
export const login = (loginForm) => ajax('/login', loginForm, 'POST')
export const getMenuList = () => ajax('/menus')
export const getUserList = (param) => ajax('/users', param, 'GET')
export const updateUserState = (param) => ajax(`/users/${param.id}/state/${param.mg_state}`, '', 'PUT')
export const addUser = (param) => ajax('users', param, 'POST')
export const updateUser = (param) => ajax(`/users/${param.id}`, { email: param.email, mobile: param.mobile }, 'PUT')
