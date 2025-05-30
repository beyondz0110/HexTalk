<template>
  <view class="change-password-container">
    <view class="header">
      <view class="back-btn" @click="goBack">
        <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
          <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
        </svg>
      </view>
      <text class="title">修改密码</text>
      <view class="placeholder-view"></view>
    </view>
    
    <view class="form">
      <view class="form-item">
        <text class="form-label">当前密码</text>
        <input 
          type="password" 
          class="form-input" 
          v-model="passwordData.oldPassword" 
          placeholder="请输入当前密码"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">新密码</text>
        <input 
          type="password" 
          class="form-input" 
          v-model="passwordData.newPassword" 
          placeholder="请输入新密码"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">确认新密码</text>
        <input 
          type="password" 
          class="form-input" 
          v-model="passwordData.confirmPassword" 
          placeholder="请再次输入新密码"
        />
      </view>
      
      <text class="password-tips">密码长度至少为8位，且包含字母和数字</text>
      
      <button class="save-btn" @click="changePassword" :disabled="loading">
        {{ loading ? '提交中...' : '提交' }}
      </button>
    </view>
  </view>
</template>

<script>
import { userApi } from '@/api';

export default {
  data() {
    return {
      passwordData: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      loading: false
    }
  },
  methods: {
    async changePassword() {
      try {
        // 表单验证
        if (!this.passwordData.oldPassword) {
          uni.showToast({
            title: '请输入当前密码',
            icon: 'none'
          });
          return;
        }
        
        if (!this.passwordData.newPassword) {
          uni.showToast({
            title: '请输入新密码',
            icon: 'none'
          });
          return;
        }
        
        if (this.passwordData.newPassword.length < 8) {
          uni.showToast({
            title: '新密码长度至少为8位',
            icon: 'none'
          });
          return;
        }
        
        // 密码复杂度验证
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(this.passwordData.newPassword)) {
          uni.showToast({
            title: '密码必须包含字母和数字',
            icon: 'none'
          });
          return;
        }
        
        if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
          uni.showToast({
            title: '两次输入的密码不一致',
            icon: 'none'
          });
          return;
        }
        
        this.loading = true;
        
        // 调用修改密码API
        const res = await userApi.changePassword({
          oldPassword: this.passwordData.oldPassword,
          newPassword: this.passwordData.newPassword
        });
        
        if (res.code === 200) {
          uni.showToast({
            title: '密码修改成功',
            icon: 'success'
          });
          
          // 清空表单
          this.passwordData = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
          };
          
          // 返回个人中心页面
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        } else {
          uni.showToast({
            title: res.message || '密码修改失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('修改密码失败:', error);
        uni.showToast({
          title: '修改密码失败，请重试',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    
    goBack() {
      uni.navigateBack();
    }
  }
}
</script>

<style>
.change-password-container {
  min-height: 100vh;
  background-color: #f9f9fb;
  font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
}

.header {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
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
  font-size: 18px;
  font-weight: bold;
  color: #111018;
  flex: 1;
  text-align: center;
}

.placeholder-view {
  width: 32px;
}

.form {
  padding: 24px 16px;
  margin-top: 12px;
  background-color: #ffffff;
}

.form-item {
  margin-bottom: 20px;
}

.form-label {
  font-size: 14px;
  color: #6a6a81;
  margin-bottom: 8px;
  display: block;
}

.form-input {
  width: 100%;
  height: 48px;
  background-color: #f5f5f8;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 16px;
  color: #111018;
  border: 1px solid #e8e8ed;
}

.password-tips {
  display: block;
  font-size: 12px;
  color: #6a6a81;
  margin-bottom: 24px;
}

.save-btn {
  width: 100%;
  height: 48px;
  background-color: #3419e5;
  color: #ffffff;
  border-radius: 24px;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.015em;
  border: none;
  box-shadow: 0 4px 8px rgba(52, 25, 229, 0.3);
}

.save-btn:active {
  opacity: 0.9;
  transform: translateY(1px);
}

.save-btn[disabled] {
  background-color: #cccccc;
  opacity: 0.7;
  color: #ffffff;
}

/* 图标样式 */
.icon-svg {
  width: 24px;
  height: 24px;
  fill: currentColor;
}
</style> 