import Vue from 'vue'
import Router from 'vue-router'

// Components
const UserRegister = require('@/components/UserRegister').default
const AdminRegister = require('@/components/admin/AdminRegister').default
const UserLogin = require('@/components/UserLogin').default
const AdminLogin = require('@/components/admin/AdminLogin').default
const AdminHome = require('@/components/admin/AdminHome').default
const UserHome = require('@/components/user/UserHome').default

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '/user-register',
      component: UserRegister
    },
    {
      path: '/admin/register',
      name: 'admin-register',
      component: AdminRegister
    },
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/user/login',
      name: 'user-login',
      component: UserLogin
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLogin
    },
    {
      path: '/admin/home',
      name: 'admin-home',
      component: AdminHome
    },
    {
      path: '/user/home',
      name: 'user-home',
      component: UserHome
    }
  ]
})
