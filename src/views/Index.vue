<template>
  <div>
    <div class="jumbotron">
      <h1>Hi,欢迎访问</h1><br>
      <p>这是一个基于Vue+Element+Bootstrap开发的示例网站</p><br>
      <p><a class="btn btn-primary btn-lg" role="button" @click="$router.push('/login')">探索更多</a></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home'
}
</script>

<style scoped>
  .jumbotron {
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, +50%);
  }
</style>
