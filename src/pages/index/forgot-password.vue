<template>
  <view class="forgot-password-container">
    <view class="header">
      <view class="back-btn" @click="goBack">
        <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
          <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
        </svg>
      </view>
      <text class="title">找回密码</text>
      <view class="placeholder-view"></view>
    </view>
    
    <view class="form">
      <view class="input-group">
        <input 
          type="text" 
          class="input" 
          placeholder="请输入注册邮箱" 
          v-model="email"
        />
      </view>
      
      <button class="submit-btn" @click="handleSubmit" :disabled="loading">
        {{ loading ? '提交中...' : '发送重置链接' }}
      </button>
      
      <text class="tip">重置链接将发送到您的邮箱，请注意查收</text>
      
      <text class="login-link" @click="goToLogin">返回登录</text>
    </view>
  </view>
</template>

<script>
import { userApi } from '@/api';

export default {
  data() {
    return {
      email: '',
      loading: false
    }
  },
  methods: {
    async handleSubmit() {
      try {
        // 表单验证
        if (!this.email) {
          uni.showToast({
            title: '请输入邮箱',
            icon: 'none'
          });
          return;
        }
        
        // 简单的邮箱格式验证
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.email)) {
          uni.showToast({
            title: '请输入有效的邮箱地址',
            icon: 'none'
          });
          return;
        }
        
        this.loading = true;
        
        // 调用忘记密码API
        const res = await userApi.forgotPassword({ email: this.email });
        
        if (res.code === 200) {
          uni.showToast({
            title: '重置链接已发送',
            icon: 'success'
          });
          
          // 提示用户查看邮箱
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/index/login'
            });
          }, 1500);
        } else {
          uni.showToast({
            title: res.message || '发送失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('发送重置链接失败:', error);
        uni.showToast({
          title: '发送失败，请重试',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    
    goBack() {
      uni.navigateBack();
    },
    
    goToLogin() {
      uni.navigateTo({
        url: '/pages/index/login'
      });
    }
  }
}
</script>

<style>
.forgot-password-container {
  min-height: 100vh;
  background-color: #f9f9fb;
  font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
}

.header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111118;
}

.back-icon {
  font-size: 24px;
  color: #100e1b;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #111018;
  flex: 1;
  text-align: center;
}

.placeholder-view {
  width: 40px;
}

.form {
  padding: 0 20px;
  margin-top: 20px;
}

.input-group {
  margin-bottom: 20px;
}

.input {
  width: 100%;
  height: 56px;
  background-color: #ebeaf1;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 16px;
  color: #111018;
  box-sizing: border-box;
}

.submit-btn {
  width: 100%;
  height: 48px;
  background-color: #3419e5;
  color: #ffffff;
  border-radius: 24px;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.015em;
  border: none;
  box-shadow: 0 4px 8px rgba(154, 127, 227, 0.3);
  margin-bottom: 16px;
}

.submit-btn:active {
  opacity: 0.9;
  transform: translateY(1px);
}

.submit-btn[disabled] {
  background-color: #cccccc;
  opacity: 0.7;
  color: #ffffff;
}

.tip {
  display: block;
  text-align: center;
  color: #625c8a;
  font-size: 14px;
  margin: 20px 0;
}

.login-link {
  display: block;
  text-align: center;
  color: #625c8a;
  font-size: 14px;
  margin-top: 30px;
  text-decoration: underline;
}

/* 图标样式 */
.icon-svg {
  width: 24px;
  height: 24px;
  fill: currentColor;
}
</style> 