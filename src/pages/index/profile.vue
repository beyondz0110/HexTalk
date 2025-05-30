<template>
  <view class="profile-container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="placeholder-view"></view>
      <text class="title">个人中心</text>
      <view class="placeholder-view"></view>
    </view>
    
    <!-- 用户信息区域 -->
    <view class="user-info-section">
      <image class="avatar" :src="userInfo.avatar || defaultAvatar" mode="aspectFill"></image>
      <view class="user-details">
        <text class="username">{{ userInfo.nickname || userInfo.username || 'Hex用户' }}</text>
        <text class="email">{{ userInfo.email || '未设置邮箱' }}</text>
      </view>
    </view>
    
    <!-- 功能列表 -->
    <view class="menu-list">
      <!-- 修改个人信息 -->
      <view class="menu-item" @click="editProfile">
        <view class="menu-icon">
          <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
          </svg>
        </view>
        <text class="menu-text">修改个人信息</text>
      </view>
      
      <!-- 修改密码 -->
      <view class="menu-item" @click="changePassword">
        <view class="menu-icon">
          <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Zm-68-56a12,12,0,1,1-12-12A12,12,0,0,1,140,152Z"></path>
          </svg>
        </view>
        <text class="menu-text">修改密码</text>
      </view>
      
      <!-- 设置 -->
      <view class="menu-item" @click="openSettings">
        <view class="menu-icon">
          <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"></path>
          </svg>
        </view>
        <text class="menu-text">设置</text>
      </view>
      
      <!-- 关于我们 -->
      <view class="menu-item" @click="aboutUs">
        <view class="menu-icon">
          <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"></path>
          </svg>
        </view>
        <text class="menu-text">关于我们</text>
      </view>
    </view>
    
    <!-- 退出登录按钮 -->
    <view class="logout-section">
      <button class="logout-btn" @click="logout">退出登录</button>
    </view>
    
    <!-- 底部导航栏 -->
    <view class="tab-bar">
      <view class="tab-item" @click="goToHistory">
        <view class="tab-icon">
          <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,128A96,96,0,0,1,62.11,197.82a8,8,0,1,1,11-11.64A80,80,0,1,0,71.43,71.43C67.9,75,64.58,78.51,61.35,82L77.66,98.34A8,8,0,0,1,72,112H32a8,8,0,0,1-8-8V64a8,8,0,0,1,13.66-5.66L50,70.7c3.22-3.49,6.54-7,10.06-10.55A96,96,0,0,1,224,128ZM128,72a8,8,0,0,0-8,8v48a8,8,0,0,0,3.88,6.86l40,24a8,8,0,1,0,8.24-13.72L136,123.47V80A8,8,0,0,0,128,72Z"></path>
          </svg>
        </view>
        <text class="tab-text">History</text>
      </view>
      
      <view class="tab-item" @click="goToHome">
        <view class="tab-icon">
          <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
            <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z"></path>
          </svg>
        </view>
        <text class="tab-text">☵☰ㄨ</text>
      </view>
      
      <view class="tab-item active">
        <view class="tab-icon">
          <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
            <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
          </svg>
        </view>
        <text class="tab-text">Profile</text>
      </view>
    </view>
  </view>
</template>

<script>
import { userApi } from '@/api';

export default {
  data() {
    return {
      userInfo: {
        username: '',
        nickname: '',
        email: '',
        avatar: ''
      },
      defaultAvatar: '/static/images/male.png'
    }
  },
  onShow() {
    // 每次页面显示时重新获取用户信息
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      try {
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
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    },
    
    editProfile() {
      uni.navigateTo({
        url: '/pages/index/edit-profile'
      });
    },
    
    changePassword() {
      uni.navigateTo({
        url: '/pages/index/change-password'
      });
    },
    
    openSettings() {
      uni.showToast({
        title: '设置功能开发中...',
        icon: 'none'
      });
    },
    
    aboutUs() {
      uni.showToast({
        title: '关于我们功能开发中...',
        icon: 'none'
      });
    },
    
    logout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            // 完全清除全局状态，确保下次登录回到首页初始状态
            const app = getApp();
            if (app.globalData) {
              // 重置全局状态
              app.globalData = {
                currentPage: 'login',
                divinationState: null
              };
              
              console.log('全局状态已重置:', app.globalData);
            }
            
            // 先清除缓存再跳转
            try {
              uni.clearStorageSync();
              console.log('本地缓存已清除');
            } catch (e) {
              console.error('清除缓存失败:', e);
            }
            
            uni.reLaunch({
              url: '/pages/index/login'
            });
          }
        }
      });
    },
    
    goToHome() {
      // 使用reLaunch直接跳转到首页，而不是navigateBack
      uni.reLaunch({
        url: '/pages/index/home'
      });
    },
    
    goToHistory() {
      uni.reLaunch({
        url: '/pages/index/history'
      });
    }
  }
}
</script>

<style>
.profile-container {
  min-height: 100vh;
  background-color: #ffffff;
  font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  display: flex;
  flex-direction: column;
  padding-bottom: 60px; /* 为固定的底部导航栏留出空间 */
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #ffffff;
}

.placeholder-view {
  width: 24px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: #121216;
  text-align: center;
  flex: 1;
}

.user-info-section {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 128px;
  height: 128px;
  border-radius: 50%;
  border: 2px solid #ebeaf1;
  overflow: hidden;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.username {
  font-size: 22px;
  font-weight: bold;
  color: #121216;
}

.email {
  font-size: 16px;
  color: #6a6a81;
}

.menu-list {
  margin-top: 16px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  gap: 16px;
}

.menu-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #f1f1f4;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #121216;
}

.menu-text {
  font-size: 16px;
  color: #121216;
  flex: 1;
}

.logout-section {
  padding: 12px 16px;
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.logout-btn {
  height: 40px;
  min-width: 84px;
  max-width: 480px;
  padding: 0 16px;
  background-color: #f1f1f4;
  color: #121216;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  letter-spacing: 0.015em;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 8px 16px 12px;
  border-top: 1px solid #f0f0f4;
  background-color: #ffffff;
  z-index: 100;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  color: #6a6a81;
}

.tab-item.active {
  color: #121216;
}

.tab-icon {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
}

.tab-text {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.015em;
}

.icon-svg {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

/* 底部安全区域 */
.safe-area {
  height: 20px;
  background-color: #ffffff;
}
</style> 