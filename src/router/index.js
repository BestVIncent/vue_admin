import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/Login'
import Register from '../views/login/Register'
import Index from '@/views/Index'
import Home from '@/views/home/Home'
import storageUtil from '@/util/localStorageUtil'
import Welcome from '@/views/home/Welcome'
import Users from '@/views/home/user/Users'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index',
    meta: {
      title: '欢迎光临', // 标题信息
      auth: false // 是否需要身份认证
    }
  },
  {
    path: '/home',
    component: Home,
    redirect: '/home/welcome',
    meta: {
      title: '首页-后台管理',
      auth: true
    },
    children: [
      {
        path: 'welcome',
        component: Welcome
      },
      {
        path: 'users',
        component: Users
      }
    ]
  },
  {
    path: '/login',
    component: Login,
    meta: {
      title: '登陆-后台管理系统',
      auth: false
    }
  },
  {
    path: '/register',
    component: Register,
    meta: {
      title: '注册帐户',
      auth: false
    }
  },
  {
    path: '/index',
    component: Index,
    meta: {
      title: '欢迎光临',
      auth: false
    }
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  if (!to.meta.auth) { // 判断是否需要token认证
    return next()
  }
  const tokenStr = storageUtil.read('token')
  if (!tokenStr) { // 判断token是否有效
    return next('/login')
  }
  next()
})

export default router
