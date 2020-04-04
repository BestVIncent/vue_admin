export const usernameValidator = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入用户名'))
  } else if (value.length < 4 || value.length > 16) {
    return callback(new Error('用户名长度在4-16之间'))
  } else {
    callback()
  }
}

export const passwordValidator = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入密码'))
  } else if (value.length < 6 || value.length > 16) {
    return callback(new Error('密码长度在6-16之间'))
  } else {
    callback()
  }
}

export const emailValidator = (rule, value, callback) => {
  const reg = /^\w+@[a-zA-Z0-9]{2,}(?:\.[a-z]{2,4}){1,3}$/
  if (!value) { // 允许为空值
    callback()
  }
  if (!reg.test(value)) {
    return callback(new Error('邮箱格式错误'))
  }
  callback()
}

export const mobileValidator = (rule, value, callback) => {
  const reg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/
  if (!value) { // 允许为空值
    callback()
  }
  if (!reg.test(value)) {
    return callback(new Error('手机号无效'))
  }
  callback()
}
