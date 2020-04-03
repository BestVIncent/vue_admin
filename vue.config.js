module.exports = {
  publicPath: '/',
  baseURL: '/',
  devServer: {
    proxy: {
      '/api': { // 匹配所有以/api开头的请求地址
        target: 'http://localhost',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
