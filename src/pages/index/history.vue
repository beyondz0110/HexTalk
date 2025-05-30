<template>
  <view class="history-container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="placeholder-view"></view>
      <text class="title">History</text>
      <view class="placeholder-view"></view>
    </view>
    
    <!-- 无记录提示 -->
    <view class="empty-history" v-if="!hasRecords">
      <view class="empty-icon">
        <svg class="icon-svg-large" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
          <path d="M224,128A96,96,0,0,1,62.11,197.82a8,8,0,1,1,11-11.64A80,80,0,1,0,71.43,71.43C67.9,75,64.58,78.51,61.35,82L77.66,98.34A8,8,0,0,1,72,112H32a8,8,0,0,1-8-8V64a8,8,0,0,1,13.66-5.66L50,70.7c3.22-3.49,6.54-7,10.06-10.55A96,96,0,0,1,224,128ZM128,72a8,8,0,0,0-8,8v48a8,8,0,0,0,3.88,6.86l40,24a8,8,0,1,0,8.24-13.72L136,123.47V80A8,8,0,0,0,128,72Z"></path>
        </svg>
      </view>
      <text class="empty-text">暂无占卜记录</text>
      <button class="empty-btn" @click="goToHome">去占卜</button>
    </view>
    
    <block v-else>
      <!-- 今日历史记录 -->
      <view class="history-section" v-if="todayRecords.length > 0">
        <text class="section-title">今天</text>
        
        <view class="history-item" 
          v-for="record in todayRecords" 
          :key="record.id" 
          @click="viewHistoryDetail(record.id)">
          <view class="history-icon" :class="{'rated': record.rating > 0}">
            <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM40,128a88.1,88.1,0,0,1,88-88,40,40,0,0,1,0,80A56,56,0,0,0,77.39,200,88,88,0,0,1,40,128Zm88,88a40,40,0,0,1,0-80,56,56,0,0,0,50.61-79.95A88,88,0,0,1,128,216Zm12-40a12,12,0,1,1-12-12A12,12,0,0,1,140,176ZM116,80a12,12,0,1,1,12,12A12,12,0,0,1,116,80Z"></path>
            </svg>
          </view>
          <view class="history-content">
            <text class="history-time">{{ formatTime(record.timestamp) }}</text>
            <text class="history-desc">{{ truncateText(record.question, 20) }}</text>
          </view>
          <view class="history-rating" v-if="record.rating > 0">
            <text class="rating-value">{{ record.rating }}</text>
          </view>
        </view>
      </view>
      
      <!-- 更早历史记录 -->
      <view class="history-section" v-if="earlierRecords.length > 0">
        <text class="section-title">更早</text>
        
        <view class="history-item" 
          v-for="record in earlierRecords" 
          :key="record.id" 
          @click="viewHistoryDetail(record.id)">
          <view class="history-icon" :class="{'rated': record.rating > 0}">
            <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM40,128a88.1,88.1,0,0,1,88-88,40,40,0,0,1,0,80A56,56,0,0,0,77.39,200,88,88,0,0,1,40,128Zm88,88a40,40,0,0,1,0-80,56,56,0,0,0,50.61-79.95A88,88,0,0,1,128,216Zm12-40a12,12,0,1,1-12-12A12,12,0,0,1,140,176ZM116,80a12,12,0,1,1,12,12A12,12,0,0,1,116,80Z"></path>
            </svg>
          </view>
          <view class="history-content">
            <text class="history-time">{{ formatDate(record.timestamp) }}</text>
            <text class="history-desc">{{ truncateText(record.question, 20) }}</text>
          </view>
          <view class="history-rating" v-if="record.rating > 0">
            <text class="rating-value">{{ record.rating }}</text>
          </view>
        </view>
      </view>
    </block>
    
    <!-- 底部导航栏 -->
    <view class="tab-bar">
      <view class="tab-item active">
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
      
      <view class="tab-item" @click="goToProfile">
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
export default {
  data() {
    return {
      divinationRecords: []
    }
  },
  computed: {
    hasRecords() {
      return this.divinationRecords.length > 0;
    },
    
    // 获取今天的记录
    todayRecords() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return this.divinationRecords.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate >= today;
      }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },
    
    // 获取更早的记录
    earlierRecords() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return this.divinationRecords.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate < today;
      }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
  },
  onLoad() {
    this.loadDivinationRecords();
  },
  onShow() {
    // 每次显示页面时都重新加载记录，确保评分变更能够及时显示
    this.loadDivinationRecords();
  },
  methods: {
    loadDivinationRecords() {
      try {
        const records = uni.getStorageSync('divinationRecords') || [];
        this.divinationRecords = records;
      } catch(e) {
        console.error('加载记录失败:', e);
        this.divinationRecords = [];
      }
    },
    
    viewHistoryDetail(id) {
      uni.navigateTo({
        url: `/pages/index/history-detail?id=${id}`
      });
    },
    
    goToHome() {
      // 使用reLaunch直接跳转到首页，而不是navigateBack
      uni.reLaunch({
        url: '/pages/index/home'
      });
    },
    
    goToProfile() {
      uni.navigateTo({
        url: '/pages/index/profile'
      });
    },
    
    // 格式化时间为 HH:MM 格式
    formatTime(timestamp) {
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    },
    
    // 格式化日期为 MM-DD 格式
    formatDate(timestamp) {
      const date = new Date(timestamp);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${month}-${day}`;
    },
    
    // 截断文本，避免过长
    truncateText(text, maxLength) {
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
  }
}
</script>

<style>
.history-container {
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

.empty-history {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  margin-top: 60px;
}

.empty-icon {
  margin-bottom: 16px;
  color: #cccccc;
}

.icon-svg-large {
  width: 64px;
  height: 64px;
}

.empty-text {
  font-size: 16px;
  color: #6a6a81;
  margin-bottom: 20px;
}

.empty-btn {
  height: 40px;
  min-width: 120px;
  background-color: #1919e5;
  color: #ffffff;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  border: none;
}

.history-section {
  padding: 0 16px;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #121216;
  padding: 16px 0 8px 0;
  display: block;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 0;
  min-height: 72px;
}

.history-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background-color: #f1f1f4;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #121216;
  flex-shrink: 0;
}

.history-icon.rated {
  background-color: #fff8e1;
  color: #ff9500;
}

.history-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
}

.history-time {
  font-size: 16px;
  font-weight: 500;
  color: #121216;
  margin-bottom: 4px;
}

.history-desc {
  font-size: 14px;
  color: #6a6a81;
}

.history-rating {
  background-color: #ff9500;
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  color: #636388;
  cursor: pointer;
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
</style> 