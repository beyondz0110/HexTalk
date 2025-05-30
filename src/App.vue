<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
    // 初始化全局状态
    getApp().globalData = {
      currentPage: 'login' // 默认显示登录页
    }
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    currentPage: 'login' // 默认显示登录页
  }
}
</script>

<style>
/*每个页面公共css */
</style>
