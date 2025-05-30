<template>
  <view class="detail-container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
          <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
        </svg>
      </view>
      <text class="title">占卜详情</text>
      <view class="placeholder-view"></view>
    </view>
    
    <!-- 问题和时间 -->
    <view class="detail-section">
      <view class="detail-header">
        <text class="detail-time">{{ record.timestamp }}</text>
        <view class="rating-display">
          <text class="rating-label">评分：</text>
          <text v-if="record.rating > 0" class="rating-score">{{ record.rating }}</text>
          <text v-else class="rating-none">未评分</text>
        </view>
      </view>
      
      <view class="question-box">
        <text class="question-label">问题：</text>
        <text class="question-text">{{ record.question }}</text>
      </view>
    </view>
    
    <!-- 卦象信息 -->
    <view class="hexagram-section">
      <text class="section-title">卦象信息</text>
      <view class="hexagram-display">
        <view class="hexagram-block">
          <text class="hexagram-title">本卦：{{ record.mainHexagram.name }}卦</text>
          <text class="hexagram-subtitle">{{ record.mainHexagram.trigramName }}</text>
        </view>
        
        <view class="hexagram-block">
          <text class="hexagram-title" v-if="record.changedHexagram">变卦：{{ record.changedHexagram.name }}卦</text>
          <text class="hexagram-subtitle" v-if="record.changedHexagram">{{ record.changedHexagram.trigramName }}</text>
          <template v-else>
            <text class="hexagram-title" style="color: #636388">无变卦</text>
            <text class="hexagram-subtitle" style="color: #636388">六爻安静</text>
          </template>
        </view>
      </view>
    </view>
    
    <!-- 对话记录 -->
    <view class="messages-section">
      <text class="section-title">解析内容</text>
      
      <view class="messages-container">
        <view v-for="(msg, index) in record.messages" :key="index" class="message" :class="{ 'user-message': !msg.isBot }">
          <view class="message-content">{{ msg.content }}</view>
        </view>
      </view>
    </view>
    
    <!-- 评分区域 -->
    <view class="rating-section" v-if="!record.rating">
      <text class="section-title">为这次占卜评分</text>
      <view class="stars-container">
        <view 
          v-for="i in 5" 
          :key="i" 
          class="star" 
          :class="{ 'active': tempRating >= i }"
          @click="tempRating = i">
          <svg class="star-svg" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
            <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
          </svg>
        </view>
      </view>
      <view class="rating-desc">{{ getRatingDesc() }}</view>
      <button class="submit-rating-btn" @click="submitRating" :disabled="tempRating === 0">提交评分</button>
    </view>
    
    <!-- 已评分提示 -->
    <view class="rating-section" v-else>
      <text class="section-title">您的评分</text>
      <view class="stars-container">
        <view 
          v-for="i in 5" 
          :key="i" 
          class="star" 
          :class="{ 'active': record.rating >= i }">
          <svg class="star-svg" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
            <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
          </svg>
        </view>
      </view>
      <view class="rating-desc">{{ getRatingDescByScore(record.rating) }}</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      recordId: '',
      record: {
        id: '',
        timestamp: '',
        question: '',
        mainHexagram: { name: '', trigramName: '' },
        changedHexagram: null,
        messages: [],
        rating: 0
      },
      tempRating: 0
    }
  },
  onLoad(options) {
    // 接收从历史列表传来的记录ID
    if (options && options.id) {
      this.recordId = options.id;
      this.loadRecordDetails();
    } else {
      uni.showToast({
        title: '记录ID不存在',
        icon: 'none'
      });
      setTimeout(() => {
        this.goBack();
      }, 1500);
    }
  },
  methods: {
    loadRecordDetails() {
      try {
        // 从本地存储获取记录
        const divinationRecords = uni.getStorageSync('divinationRecords') || [];
        const record = divinationRecords.find(r => r.id === this.recordId);
        
        if (record) {
          this.record = record;
        } else {
          uni.showToast({
            title: '未找到相关记录',
            icon: 'none'
          });
          setTimeout(() => {
            this.goBack();
          }, 1500);
        }
      } catch(e) {
        console.error('加载记录失败:', e);
        uni.showToast({
          title: '加载记录失败',
          icon: 'none'
        });
      }
    },
    
    getRatingDesc() {
      return this.getRatingDescByScore(this.tempRating);
    },
    
    getRatingDescByScore(score) {
      switch(score) {
        case 1: return '很不满意';
        case 2: return '不满意';
        case 3: return '一般';
        case 4: return '满意';
        case 5: return '非常满意';
        default: return '请选择评分';
      }
    },
    
    submitRating() {
      if (this.tempRating === 0) return;
      
      try {
        // 获取所有记录
        const divinationRecords = uni.getStorageSync('divinationRecords') || [];
        
        // 找到当前记录并更新评分
        const updatedRecords = divinationRecords.map(record => {
          if (record.id === this.recordId) {
            return { ...record, rating: this.tempRating };
          }
          return record;
        });
        
        // 保存更新后的记录
        uni.setStorageSync('divinationRecords', updatedRecords);
        
        // 更新当前页面的记录
        this.record.rating = this.tempRating;
        
        uni.showToast({
          title: '评分成功',
          icon: 'success'
        });
      } catch(e) {
        console.error('保存评分失败:', e);
        uni.showToast({
          title: '保存评分失败',
          icon: 'none'
        });
      }
    },
    
    goBack() {
      // 使用navigateBack尝试返回上一页，如果失败则使用reLaunch跳转到history页面
      uni.navigateBack({
        fail: () => {
          uni.reLaunch({
            url: '/pages/index/history'
          });
        }
      });
    }
  }
}
</script>

<style>
.detail-container {
  min-height: 100vh;
  background-color: #f8f8fa;
  font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #ffffff;
}

.back-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #121216;
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

.detail-section {
  margin: 12px;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 12px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.detail-time {
  font-size: 14px;
  color: #6a6a81;
}

.rating-display {
  display: flex;
  align-items: center;
}

.rating-label {
  font-size: 14px;
  color: #6a6a81;
  margin-right: 4px;
}

.rating-score {
  font-size: 16px;
  font-weight: bold;
  color: #ff9500;
}

.rating-none {
  font-size: 14px;
  color: #6a6a81;
}

.question-box {
  margin-top: 8px;
}

.question-label {
  font-size: 14px;
  color: #6a6a81;
  margin-bottom: 4px;
  display: block;
}

.question-text {
  font-size: 16px;
  color: #121216;
  font-weight: 500;
  word-break: break-all;
}

.hexagram-section, .messages-section, .rating-section {
  margin: 0 12px 12px;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #121216;
  margin-bottom: 12px;
  display: block;
}

.hexagram-display {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 12px;
  background-color: #f8f8fa;
  border-radius: 8px;
}

.hexagram-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hexagram-title {
  font-size: 18px;
  font-weight: bold;
  color: #121216;
  padding: 10px 10px 5px 10px;
  text-align: center;
  font-family: "楷体", KaiTi, serif;
}

.hexagram-subtitle {
  font-size: 14px;
  color: #6a6a81;
  padding: 0 10px 5px 10px;
  text-align: center;
  font-family: "楷体", KaiTi, serif;
}

.messages-container {
  max-height: 300px;
  overflow-y: auto;
}

.message {
  margin: 8px 0;
  padding: 10px 14px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  background-color: #f1f1f4;
}

.user-message {
  background-color: #e3f2fd;
  align-self: flex-end;
  margin-left: auto;
  max-width: 85%;
}

.message-content {
  font-size: 15px;
  line-height: 1.4;
  word-break: break-word;
  white-space: pre-line;
  text-align: justify;
}

.stars-container {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.star {
  width: 40px;
  height: 40px;
  color: #dddddd;
  margin: 0 4px;
  cursor: pointer;
}

.star.active {
  color: #ff9500;
}

.star-svg {
  width: 36px;
  height: 36px;
}

.rating-desc {
  text-align: center;
  font-size: 14px;
  color: #6a6a81;
  margin-bottom: 16px;
}

.submit-rating-btn {
  width: 200px;
  height: 40px;
  margin: 0 auto;
  background-color: #1919e5;
  color: #ffffff;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  border: none;
}

.submit-rating-btn:disabled {
  background-color: #9999e5;
}

.icon-svg {
  width: 24px;
  height: 24px;
  fill: currentColor;
}
</style> 