<template>
  <div>
    <el-button type="info" @click="logout">注销</el-button>
  </div>
</template>

<script>
import storageUtil from '@/util/storageUtil'

export default {
  name: 'Dashboard',
  methods: {
    logout () {
      // 清除token内容
      storageUtil.remove('token')
      // 提示消息
      this.$message.success('注销成功')
      // 转发到登陆页面
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>
