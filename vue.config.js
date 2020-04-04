module.exports = {
  publicPath: '/',
  devServer: {
    proxy: {
      '/api': { // 匹配所有以/api开头的请求地址
        target: 'http://localhost:8888',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
