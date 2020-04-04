<template>
  <div>
    <el-card class="login-form-layout">
      <!--登陆表单,rules添加校验规则-->
      <el-form ref="loginFormRef" :model="loginForm" label-position="left" :rules="loginRules">
        <h2 class="login-title color-main">后台管理登陆</h2><br>
        <!--用户名密码,prop指定校验项-->
        <el-form-item  prop="username">
          <el-input prefix-icon="iconfont icon-icon-username" placeholder="请输入用户名" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item  prop="password">
          <el-input prefix-icon="iconfont icon-password" type="password" placeholder="请输入密码" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 10px;text-align: center">
          <el-checkbox>记住密码</el-checkbox>
          <el-checkbox>自动登陆</el-checkbox>
        </el-form-item>
        <el-form-item style="margin-bottom: 30px;text-align: center">
          <el-button type="primary" @click="login">立即登陆</el-button>
          <el-button type="info" @click="$router.push('/register')">注册帐号</el-button>
        </el-form-item>
      </el-form>
      <a href="#" @click="$router.back()">返回首页</a>
    </el-card>
  </div>
</template>

<script>
import { login } from '@/api'
import storageUtil from '@/util/localStorageUtil'
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: { // 登陆表单校验规则
        username: [
          { required: true, trigger: 'blur', message: '请输入用户名' },
          { min: 5, max: 16, trigger: 'blur', message: '用户名长度在5-16之间' }],
        password: [
          { required: true, trigger: 'blur', message: '请输入密码' },
          { min: 5, max: 16, trigger: 'blur', message: '密码长度在5-16之间' }]
      }
    }
  },
  methods: {
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (valid === false) {
          return
        }
        const result = await login(this.loginForm)
        // 判断登陆结果并提示相关信息
        if (result.meta.status !== 200) {
          return this.$message.error('用户名或密码错误')
        }
        this.$message.success('登陆成功')
        // 登陆成功后保存token
        storageUtil.save('token', result.data.token)
        // 跳转页面到 /dashboard
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login-form-layout {
    position: absolute;
    left: 50%;
    right: 50%;
    width: 360px;
    transform: translate(-50%,50%);
    border-top: 10px solid #409EFF;
  }
  .login-title {
    text-align: center;
  }
  .login-center-layout {
    background: #409EFF;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    margin-top: 200px;
  }
</style>
