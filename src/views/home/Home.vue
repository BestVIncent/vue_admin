<template>
    <el-container class="home-container">
      <!--头部组件-->
      <el-header>
        <div>
          <img src="../../assets/logo.png" style="height: 60px; width: 60px"/>
          <h3>后台管理系统</h3>
        </div>
        <el-dropdown>
          <a class="el-dropdown-link" href="#">admin<i class="el-icon-arrow-down el-icon--right"></i></a>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.prevent="">个人信息</el-dropdown-item>
            <el-dropdown-item divided></el-dropdown-item>
            <el-dropdown-item @click.prevent="logout">注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <!--侧边栏-->
        <el-aside :width="isCollapse?'60px':'200px'">
          <el-button @click="collapseMenu" :icon="menuStateIcon" style="margin-top: 10px; background:#313743;border: 0"></el-button>
          <hr/>
          <!--菜单-->
          <el-menu background-color="#313743"
                   text-color="#fff"
                   :collapse="isCollapse"
                   active-text-color="#3b98ff"
                   unique-opened
                   :collapse-transition="false"
                   :router="true"
                   :default-active="navState">
            <!--一级菜单-->
            <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <!--一级菜单图标-->
                <i :class="iconObj[item.id]"></i>
                <!--一级菜单标题-->
                <span>{{item.authName}}</span>
              </template>
              <!--二级菜单-->
              <el-menu-item @click="saveNavState('/home/'+subItem.path)" :index="'/home/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!--主体-->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
import storageUtil from '@/util/localStorageUtil'
import { getMenuList } from '@/api'
import sessionStorageUtil from '@/util/sessionStorageUtil'

export default {
  name: 'Home',
  mounted () {
    // 动态获取菜单列表
    this.setMenuList()
    this.navState = sessionStorageUtil.read('navState')
  },
  data () {
    return {
      isCollapse: false,
      menuList: [],
      iconObj: { // 菜单id对应的图标
        125: 'iconfont icon-seeuser',
        103: 'iconfont icon-tiji-',
        101: 'iconfont icon-shangpin-',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiaokaobei'
      },
      navState: ''
    }
  },
  methods: {
    logout () {
      // 清除token内容
      storageUtil.remove('token')
      // 提示消息
      this.$message.success('注销成功')
      // 转发到登陆页面
      this.$router.push('/login')
    },
    collapseMenu () {
      this.isCollapse = !this.isCollapse
    },
    async setMenuList () {
      const res = await getMenuList()
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menuList = res.data
    },
    saveNavState (curPath) {
      sessionStorageUtil.save('navState', curPath)
      this.navState = curPath
    }
  },
  computed: {
    menuStateIcon () {
      const flag = this.isCollapse
      return flag ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background: #313743;
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 30px;
  align-items: center;
  color: #ffffff;
  > div {
    display: flex;
    align-items: center;
    h3 {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background: #313743;
  border-right: none;
  overflow: hidden;
}
.el-main {
  background: #e9edf1;
}

.el-menu{
  border-right-width: 0;
}
.iconfont {
  margin-right: 10px;
}
</style>
