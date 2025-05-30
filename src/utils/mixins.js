import * as api from '@/api'

export default {
  install(app) {
    // 添加全局mixin
    app.mixin({
      // 将API挂载到组件实例上
      created() {
        this.$api = api
      }
    })
  }
} 