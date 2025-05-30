<template>
  <view class="edit-profile-container">
    <view class="header">
      <view class="back-btn" @click="goBack">
        <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
          <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
        </svg>
      </view>
      <text class="title">修改个人信息</text>
      <view class="placeholder-view"></view>
    </view>
    
    <view class="avatar-section">
      <image class="avatar" :src="userInfo.avatar || defaultAvatar" mode="aspectFill"></image>
      <view class="avatar-actions">
        <view class="change-avatar-btn" @click="changeAvatar">更换头像</view>
        <view class="default-avatar-btn" @click="showDefaultAvatars">使用系统头像</view>
      </view>
    </view>
    
    <!-- 默认头像选择面板 -->
    <view class="default-avatars-panel" v-if="showDefaultAvatarsPanel">
      <view class="panel-header">
        <text class="panel-title">选择系统头像</text>
        <view class="panel-close" @click="hideDefaultAvatars">×</view>
      </view>
      <view class="avatars-list">
        <view 
          class="avatar-item" 
          v-for="(avatar, index) in defaultAvatars" 
          :key="index"
          @click="selectDefaultAvatar(avatar)"
        >
          <image class="avatar-preview" :src="avatar" mode="aspectFill"></image>
          <text class="avatar-label">{{ index === 0 ? '男生头像' : '女生头像' }}</text>
        </view>
      </view>
    </view>
    
    <view class="form">
      <view class="form-item">
        <text class="form-label">用户名</text>
        <input 
          type="text" 
          class="form-input" 
          v-model="userInfo.username" 
          placeholder="请输入用户名"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">昵称</text>
        <input 
          type="text" 
          class="form-input" 
          v-model="userInfo.nickname" 
          placeholder="请输入昵称"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">邮箱</text>
        <input 
          type="text" 
          class="form-input" 
          v-model="userInfo.email" 
          placeholder="请输入邮箱"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">手机号</text>
        <input 
          type="text" 
          class="form-input" 
          v-model="userInfo.phone" 
          placeholder="请输入手机号"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">个人简介</text>
        <textarea 
          class="form-textarea" 
          v-model="userInfo.bio" 
          placeholder="请输入个人简介"
        />
      </view>
      
      <button class="save-btn" @click="saveProfile" :disabled="loading">
        {{ loading ? '保存中...' : '保存' }}
      </button>
    </view>
  </view>
</template>

<script>
import { userApi } from '@/api';
import { fileApi } from '@/api';

export default {
  data() {
    return {
      userInfo: {
        username: '',
        nickname: '',
        email: '',
        phone: '',
        bio: '',
        avatar: ''
      },
      defaultAvatar: '/static/images/male.png',
      defaultAvatars: [
        '/static/images/male.png',
        '/static/images/female.png'
      ],
      showDefaultAvatarsPanel: false,
      loading: false
    }
  },
  onLoad() {
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      try {
        this.loading = true;
        
        // 获取本地存储的用户信息
        const userInfoStorage = uni.getStorageSync('userInfo');
        if (userInfoStorage) {
          this.userInfo = {...this.userInfo, ...userInfoStorage};
        }
        
        // 从服务器获取最新用户信息
        const res = await userApi.getUserProfile();
        
        if (res.code === 200) {
          this.userInfo = {...this.userInfo, ...res.data};
          // 更新本地存储
          uni.setStorageSync('userInfo', res.data);
        } else {
          uni.showToast({
            title: res.message || '获取用户信息失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
        uni.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    
    showDefaultAvatars() {
      this.showDefaultAvatarsPanel = true;
    },
    
    hideDefaultAvatars() {
      this.showDefaultAvatarsPanel = false;
    },
    
    selectDefaultAvatar(avatarUrl) {
      // 添加时间戳防止缓存
      this.userInfo.avatar = avatarUrl + '?t=' + new Date().getTime();
      this.hideDefaultAvatars();
      
      uni.showToast({
        title: '已选择系统头像',
        icon: 'success'
      });
    },
    
    changeAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          
          // 显示上传中的提示
          uni.showLoading({
            title: '上传中...',
            mask: true  // 添加遮罩防止用户点击
          });
          
          // 直接使用uni.uploadFile上传
          uni.uploadFile({
            url: 'https://zcrosdarxuop.sealoshzh.site/api/v1/files/upload',
            filePath: tempFilePath,
            name: 'file',
            header: {
              'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
            },
            success: (uploadRes) => {
              try {
                // 确保隐藏加载提示
                uni.hideLoading();
                
                const data = JSON.parse(uploadRes.data);
                if (data.code === 200) {
                  // 更新头像URL，添加时间戳防止缓存
                  this.userInfo.avatar = data.data.url + '?t=' + new Date().getTime();
                  uni.showToast({
                    title: '头像上传成功',
                    icon: 'success'
                  });
                } else {
                  uni.showToast({
                    title: data.message || '头像上传失败',
                    icon: 'none'
                  });
                }
              } catch (error) {
                console.error('解析上传响应失败:', error);
                uni.showToast({
                  title: '头像上传失败',
                  icon: 'none'
                });
              }
            },
            fail: (error) => {
              console.error('头像上传请求失败:', error);
              uni.showToast({
                title: '头像上传失败',
                icon: 'none'
              });
            },
            complete: () => {
              // 确保在任何情况下都隐藏加载提示
              uni.hideLoading();
            }
          });
        }
      });
    },
    
    async saveProfile() {
      try {
        // 表单验证
        if (!this.userInfo.username) {
          uni.showToast({
            title: '请输入用户名',
            icon: 'none'
          });
          return;
        }
        
        if (!this.userInfo.email) {
          uni.showToast({
            title: '请输入邮箱',
            icon: 'none'
          });
          return;
        }
        
        // 邮箱格式验证
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.userInfo.email)) {
          uni.showToast({
            title: '请输入有效的邮箱地址',
            icon: 'none'
          });
          return;
        }
        
        uni.showLoading({
          title: '保存中...',
          mask: true
        });
        
        // 处理头像URL，移除可能的时间戳参数
        let avatarUrl = this.userInfo.avatar || '';
        if (avatarUrl.includes('?t=')) {
          avatarUrl = avatarUrl.split('?t=')[0];
        }
        
        // 构造更新数据，只包含需要更新的字段
        const updateData = {
          username: this.userInfo.username,
          nickname: this.userInfo.nickname,
          email: this.userInfo.email,
          phone: this.userInfo.phone,
          bio: this.userInfo.bio,
          avatar: avatarUrl
        };
        
        // 调用更新用户信息API
        const res = await userApi.updateUserProfile(updateData);
        
        uni.hideLoading();
        
        if (res.code === 200) {
          // 更新本地存储
          uni.setStorageSync('userInfo', {...this.userInfo, ...res.data});
          
          uni.showToast({
            title: '保存成功',
            icon: 'success'
          });
          
          // 返回个人中心页面
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        } else {
          uni.showToast({
            title: res.message || '保存失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('保存个人信息失败:', error);
        uni.hideLoading();
        uni.showToast({
          title: '保存失败',
          icon: 'none'
        });
      }
    },
    
    goBack() {
      uni.navigateBack();
    }
  }
}
</script>

<style>
.edit-profile-container {
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

.avatar-section {
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  margin-bottom: 12px;
}

.avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  margin-bottom: 12px;
  border: 2px solid #ebeaf1;
  overflow: hidden;
}

.avatar-actions {
  display: flex;
  gap: 16px;
}

.change-avatar-btn, .default-avatar-btn {
  color: #3419e5;
  font-size: 14px;
  font-weight: 500;
}

/* 默认头像选择面板 */
.default-avatars-panel {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 16px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.panel-title {
  font-size: 16px;
  font-weight: bold;
  color: #111018;
}

.panel-close {
  font-size: 24px;
  color: #6a6a81;
  padding: 8px;
}

.avatars-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  padding-bottom: 24px;
}

.avatar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #ebeaf1;
  overflow: hidden;
}

.avatar-label {
  font-size: 12px;
  color: #6a6a81;
}

.form {
  padding: 16px;
  background-color: #ffffff;
}

.form-item {
  margin-bottom: 16px;
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

.form-textarea {
  width: 100%;
  height: 120px;
  background-color: #f5f5f8;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  color: #111018;
  border: 1px solid #e8e8ed;
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
  margin-top: 24px;
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