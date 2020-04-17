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
export const getRightList = () => ajax('rights/list')
export const getRoleList = () => ajax('roles')
export const addRole = (param) => ajax('roles', param, 'POST')
export const deleteRole = (roleId) => ajax(`roles/${roleId}`, '', 'DELETE')
export const getRoleById = (roleId) => ajax(`roles/${roleId}`)
export const updateRole = (param) => ajax(`roles/${param.id}`, { roleName: param.roleName, roleDesc: param.roleDesc }, 'PUT')
export const deleteRoleRight = (roleId, rightId) => ajax(`roles/${roleId}/rights/${rightId}`, '', 'DELETE')
export const getAllRight = (type) => ajax(`rights/${type}`)
export const updateRights = (roleId, rids) => ajax(`roles/${roleId}/rights`, { rids }, 'POST')
export const updateUserRole = (userId, roleId) => ajax(`users/${userId}/role`, { rid: roleId }, 'PUT')
