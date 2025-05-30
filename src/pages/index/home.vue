<template>
  <view class="home-container">
    <!-- 主页界面 -->
    <view v-if="!showDivinationPage">
      <!-- 顶部导航栏 -->
      <view class="header">
        <text class="title">Hex Talk</text>
      </view>
      
      <!-- 封面图片 -->
      <view class="cover-image"></view>
      
      <!-- 欢迎文本 -->
      <view class="welcome-section">
        <text class="welcome-title">欢迎使用 Hex Talk</text>
        <text class="welcome-desc">探索易经古老智慧，获取人生旅途的启示与指引。</text>
      </view>
      
      <!-- 问题输入区域 -->
      <view class="question-section">
        <input 
          type="text" 
          class="question-input" 
          placeholder="请输入您的问题" 
          v-model="question"
        />
      </view>
      
      <!-- 开始占卜按钮 -->
      <view class="button-section">
        <button class="divination-btn" @click="startDivination">开始占卜</button>
      </view>
    </view>

    <!-- 占卜界面 -->
    <view v-else class="divination-page">
      <!-- 顶部导航栏 -->
      <view class="header">
        <view class="back-btn" @click="backToHome">
          <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
          </svg>
        </view>
        <text class="title">六爻占卜</text>
        <view class="placeholder-view"></view>
      </view>

      <!-- 问题展示 -->
      <view class="question-display">
        <text class="question-label">您的问题：</text>
        <text class="question-text">{{ question }}</text>
      </view>

      <!-- 铜钱摇卦区域 -->
      <view class="coin-section">
        <view class="coins-container">
          <image class="coin" :src="coinImages[0]" mode="aspectFit"></image>
          <image class="coin" :src="coinImages[1]" mode="aspectFit"></image>
          <image class="coin" :src="coinImages[2]" mode="aspectFit"></image>
        </view>
        
        <view class="coin-buttons">
          <button 
            class="coin-btn" 
            @click="shakeCoin(currentShakeStep === 0 ? 1 : currentShakeStep)"
            :disabled="isShaking || currentShakeStep >= 6"
          >
            {{ currentShakeStep === 0 ? '摇第一次' : `摇第${currentShakeStep}次` }}
          </button>
          <button class="coin-btn stop-btn" @click="stopShaking" :disabled="!isShaking">
            停 止
          </button>
        </view>
      </view>

      <!-- 六爻表格 -->
      <view class="hexagram-section" :class="{ 'visible': currentShakeStep > 0 }">
        <text class="section-hint">六爻结果</text>
        
        <view class="hexagram-table">
          <view class="hexagram-row" v-for="(yao, index) in [...hexagramLines].reverse()" :key="5-index">
            <view class="yao-label">{{ ['六', '五', '四', '三', '二', '初'][index] }}爻</view>
            <view class="yao-value">
              <select v-model="hexagramLines[5-index]">
                <option value="1">少阳 ───</option>
                <option value="2">少阴 ─　─</option>
                <option value="3">老阳─── ○</option>
                <option value="0">老阴─　─ ╳</option>
              </select>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 卦象栏 -->
      <view class="hexagram-display-section" :class="{ 'visible': currentShakeStep >= 6 }">
        <text class="section-hint">卦象结果</text>
        
        <view class="hexagram-display">
          <view class="hexagram-block">
            <text class="hexagram-title">本卦：{{ mainHexagram.name }}卦</text>
            <text class="hexagram-subtitle">{{ mainHexagram.trigramName }}</text>
          </view>
          
          <view class="hexagram-block">
            <text class="hexagram-title" v-if="hasChangingYao">变卦：{{ changedHexagram.name }}卦</text>
            <text class="hexagram-subtitle" v-if="hasChangingYao">{{ changedHexagram.trigramName }}</text>
            <template v-else>
              <text class="hexagram-title" style="color: #636388">无变卦</text>
              <text class="hexagram-subtitle" style="color: #636388">六爻安静</text>
            </template>
          </view>
        </view>
      </view>


    </view>
    
    <!-- AI聊天机器人 -->
    <ai-chat-bot 
      ref="aiChatBot"
      :hex-results="{ 
        yaoTypes: yaoTypes, 
        mainHexagram: mainHexagram, 
        changedHexagram: hasChangingYao ? changedHexagram : null 
      }"
      :user-question="question"
      :show-trigger="showAiChatTrigger"
      @messages-updated="updateRecordMessages"
    ></ai-chat-bot>
    
    <!-- 底部导航栏 -->
    <view class="tab-bar">
      <view class="tab-item" @click="handleTabClick('history')">
        <view class="tab-icon">
          <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,128A96,96,0,0,1,62.11,197.82a8,8,0,1,1,11-11.64A80,80,0,1,0,71.43,71.43C67.9,75,64.58,78.51,61.35,82L77.66,98.34A8,8,0,0,1,72,112H32a8,8,0,0,1-8-8V64a8,8,0,0,1,13.66-5.66L50,70.7c3.22-3.49,6.54-7,10.06-10.55A96,96,0,0,1,224,128ZM128,72a8,8,0,0,0-8,8v48a8,8,0,0,0,3.88,6.86l40,24a8,8,0,1,0,8.24-13.72L136,123.47V80A8,8,0,0,0,128,72Z"></path>
          </svg>
        </view>
        <text class="tab-text">History</text>
      </view>
      
      <view class="tab-item" :class="{ 'active': !showDivinationPage, 'disabled': showDivinationPage }" @click="handleTabClick('home')">
        <view class="tab-icon">
          <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
            <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z"></path>
          </svg>
        </view>
        <text class="tab-text">☵☰ㄨ</text>
      </view>
      
      <view class="tab-item" @click="handleTabClick('profile')">
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
import AiChatBot from '@/components/AiChatBot.vue';

export default {
  components: {
    AiChatBot
  },
  data() {
    return {
      question: '',
      showDivinationPage: false,
      isShaking: false,
      currentShakeStep: 0,
      hexagramLines: [1, 1, 1, 1, 1, 1], // 默认全部为少阳
      coinImages: [
        '/static/images/coin_front.png',
        '/static/images/coin_front.png',
        '/static/images/coin_front.png'
      ],
      coinFrontImage: '/static/images/coin_front.png',
      coinBackImage: '/static/images/coin_back.png',
      shakingTimer: null,
      showAiChatTrigger: false,
      currentRecordId: '' // 添加当前记录ID
    }
  },
  
  computed: {
    // 将数值转换为爻的类型
    yaoTypes() {
      return this.hexagramLines.map(value => {
        switch(parseInt(value)) {
          case 0: return '老阴'; // 老阴 ─　─ ╳
          case 1: return '少阳'; // 少阳 ───
          case 2: return '少阴'; // 少阴 ─　─
          case 3: return '老阳'; // 老阳 ─── ○
          default: return '少阳';
        }
      });
    },
    
    // 判断是否存在变爻
    hasChangingYao() {
      return this.yaoTypes.some(yao => yao === '老阳' || yao === '老阴');
    },
    
    // 生成本卦
    mainHexagram() {
      return this.generateHexagram(false);
    },
    
    // 生成变卦
    changedHexagram() {
      return this.generateHexagram(true);
    }
  },
  
  onLoad() {
    // 页面首次加载时执行
    console.log('Home page loaded');
    // 重置到初始状态
    this.resetToInitialState();
  },
  
  onShow() {
    // 从全局状态恢复占卜界面状态
    const globalData = getApp().globalData || {};
    console.log('Home page shown, currentPage:', globalData.currentPage);
    
    // 如果是从登录页面过来，或者没有指定当前页面，确保重置到初始状态
    if (globalData.currentPage === 'login' || !globalData.currentPage) {
      console.log('Resetting to initial state');
      this.resetToInitialState();
      // 更新当前页面状态
      globalData.currentPage = 'home';
      return;
    }
    
    // 只有在有保存的状态才恢复状态
    if (globalData.divinationState) {
      console.log('Restoring divination state');
      this.showDivinationPage = globalData.divinationState.showDivinationPage;
      this.question = globalData.divinationState.question;
      this.currentShakeStep = globalData.divinationState.currentShakeStep;
      this.hexagramLines = globalData.divinationState.hexagramLines;
      this.coinImages = globalData.divinationState.coinImages;
      
      // 无论从哪个页面返回，都保持AI聊天机器人的显示状态
      this.showAiChatTrigger = globalData.divinationState.showAiChatTrigger;
      
      // 确保从profile或history页面返回时，AI聊天状态保持一致
      if (globalData.currentPage === 'profile' || globalData.currentPage === 'history') {
        console.log('Returning from profile or history, preserving chat state');
        // 不需要重新初始化聊天，保持现有状态
      }
    }
    
    // 更新当前页面状态为home
    globalData.currentPage = 'home';
  },
  
  onHide() {
    // 保存当前占卜界面状态到全局
    const app = getApp();
    if (!app.globalData) {
      app.globalData = {};
    }
    
    // 在隐藏页面前，保存当前的聊天消息到记录中
    this.updateRecordMessages();
    
    // 保存AI聊天组件的状态
    let chatState = null;
    if (this.$refs.aiChatBot) {
      chatState = {
        messages: this.$refs.aiChatBot.messages || [],
        conversationId: this.$refs.aiChatBot.difyConfig.conversationId || '',
        hasLoadedResult: this.$refs.aiChatBot.hasLoadedResult || false
      };
    }
    
    // 只保存状态，不重置状态
    app.globalData.divinationState = {
      showDivinationPage: this.showDivinationPage,
      question: this.question,
      currentShakeStep: this.currentShakeStep,
      hexagramLines: [...this.hexagramLines],
      coinImages: [...this.coinImages],
      // 保存AI聊天机器人的显示状态
      showAiChatTrigger: this.showAiChatTrigger,
      // 保存聊天状态
      chatState: chatState
    };
    
    // 记录当前页面
    app.globalData.currentPage = 'home';
  },
  methods: {
    // 生成卦象的核心逻辑
    generateHexagram(isChanged) {
      // 八卦对应表
      const TRIGRAMS = [
        { binary: '111', name: '乾', number: 1 },
        { binary: '110', name: '兑', number: 2 },
        { binary: '101', name: '离', number: 3 },
        { binary: '100', name: '震', number: 4 },
        { binary: '011', name: '巽', number: 5 },
        { binary: '010', name: '坎', number: 6 },
        { binary: '001', name: '艮', number: 7 },
        { binary: '000', name: '坤', number: 8 }
      ];
      
      // 爻类型映射表
      const YAO_MAPPING = {
        '老阳': { binary: 1, isChanging: true },
        '少阳': { binary: 1, isChanging: false },
        '少阴': { binary: 0, isChanging: false },
        '老阴': { binary: 0, isChanging: true }
      };
      
      // 64卦名称对照表
      const HEXAGRAM_NAMES = {
        "乾乾": "乾",
        "兑乾": "夬",
        "离乾": "大有",
        "震乾": "大壮",
        "巽乾": "小畜",
        "坎乾": "需",
        "艮乾": "大畜",
        "坤乾": "泰",
        
        "乾兑": "履",
        "兑兑": "兑",
        "离兑": "睽",
        "震兑": "归妹",
        "巽兑": "中孚",
        "坎兑": "节",
        "艮兑": "损",
        "坤兑": "临",
        
        "乾离": "同人",
        "兑离": "革",
        "离离": "离",
        "震离": "丰",
        "巽离": "家人",
        "坎离": "既济",
        "艮离": "贲",
        "坤离": "明夷",
        
        "乾震": "无妄",
        "兑震": "随",
        "离震": "噬嗑",
        "震震": "震",
        "巽震": "益",
        "坎震": "屯",
        "艮震": "颐",
        "坤震": "复",
        
        "乾巽": "姤",
        "兑巽": "大过",
        "离巽": "鼎",
        "震巽": "恒",
        "巽巽": "巽",
        "坎巽": "井",
        "艮巽": "蛊",
        "坤巽": "升",
        
        "乾坎": "讼",
        "兑坎": "困",
        "离坎": "未济",
        "震坎": "解",
        "巽坎": "涣",
        "坎坎": "坎",
        "艮坎": "蒙",
        "坤坎": "师",
        
        "乾艮": "遁",
        "兑艮": "咸",
        "离艮": "旅",
        "震艮": "小过",
        "巽艮": "渐",
        "坎艮": "蹇",
        "艮艮": "艮",
        "坤艮": "谦",
        
        "乾坤": "否",
        "兑坤": "萃",
        "离坤": "晋",
        "震坤": "豫",
        "巽坤": "观",
        "坎坤": "比",
        "艮坤": "剥",
        "坤坤": "坤"
      };
      
      const binaryStr = this.yaoTypes.map(yao => {
        if (isChanged && YAO_MAPPING[yao].isChanging) {
          // 仅处理动爻的变化
          return YAO_MAPPING[yao].binary === 1 ? 0 : 1;
        }
        return YAO_MAPPING[yao].binary;
      }).join('');
      
      const lowerTrigram = binaryStr.slice(0, 3);
      const upperTrigram = binaryStr.slice(3);
      
      const findTrigram = (binary) => 
        TRIGRAMS.find(t => t.binary === binary) || { name: '未知', number: 0 };
      
      const lower = findTrigram(lowerTrigram);
      const upper = findTrigram(upperTrigram);
      
      // 获取卦名
      const trigramKey = `${upper.name}${lower.name}`;
      const hexagramName = HEXAGRAM_NAMES[trigramKey] || trigramKey;
      
      return {
        name: hexagramName,
        trigramName: trigramKey,
        number: upper.number * 10 + lower.number
      };
    },
    
    startDivination() {
      if (!this.question.trim()) {
        uni.showToast({
          title: '请输入您的问题',
          icon: 'none'
        });
        return;
      }
      
      // 完全重置所有状态
      this.showDivinationPage = true;
      this.currentShakeStep = 0;
      this.hexagramLines = [1, 1, 1, 1, 1, 1];
      
      // 清除占卜结果和AI聊天状态
      this.showAiChatTrigger = false;
      
      // 如果AI聊天组件存在，清除其会话状态
      if (this.$refs.aiChatBot && typeof this.$refs.aiChatBot.clearChatSession === 'function') {
        this.$refs.aiChatBot.clearChatSession();
      }
      
      // 清除全局保存的占卜状态
      const app = getApp();
      if (app.globalData && app.globalData.divinationState) {
        app.globalData.divinationState = null;
      }
    },
    
    backToHome() {
      // 重置显示状态
      this.showDivinationPage = false;
      this.stopShaking();
      
      // 重置占卜相关状态 - 不再重置AI聊天状态
      this.currentShakeStep = 0;
      // 保存hexagramLines和其他结果，但不重置它们
      // this.hexagramLines = [1, 1, 1, 1, 1, 1]; 
      
      // 重置UI状态
      this.isShaking = false;
      this.showCoinResult = false;
      this.showHexagramResult = false;
      
      // 不清除全局保存的占卜状态，以便保留AI聊天结果
      // const app = getApp();
      // if (app.globalData && app.globalData.divinationState) {
      //   app.globalData.divinationState = null;
      // }
    },
    
    shakeCoin(step) {
      if (this.isShaking) return;
      
      this.isShaking = true;
      this.currentShakeStep = step;
      
      // 模拟铜钱摇动
      this.shakingTimer = setInterval(() => {
        this.coinImages = this.coinImages.map(() => {
          return Math.random() > 0.5 ? this.coinFrontImage : this.coinBackImage;
        });
      }, 100);
    },
    
    stopShaking() {
      if (!this.isShaking) return;
      
      clearInterval(this.shakingTimer);
      this.isShaking = false;
      
      // 确定当前爻的结果
      const coinResults = this.coinImages.map(img => img === this.coinFrontImage ? 'front' : 'back');
      const frontCount = coinResults.filter(result => result === 'front').length;
      
      // 根据正面数量确定爻的类型
      // 3正面=0老阴，2正面=1少阳，1正面=2少阴，0正面=3老阳
      let yaoValue;
      switch(frontCount) {
        case 3: yaoValue = 0; break; // 老阴
        case 2: yaoValue = 1; break; // 少阳
        case 1: yaoValue = 2; break; // 少阴
        case 0: yaoValue = 3; break; // 老阳
      }
      
      // 更新对应爻位的值（从下往上，第一爻到第六爻）
      if (this.currentShakeStep >= 1 && this.currentShakeStep <= 6) {
        // 爻位从下到上，数组索引从0到5
        this.hexagramLines[this.currentShakeStep - 1] = yaoValue;
      }
      
      // 准备下一次摇卦
      if (this.currentShakeStep < 6) {
        this.currentShakeStep++;
      }
      
      // 如果已经是第6次摇卦，显示提示并激活AI聊天机器人
      if (this.currentShakeStep === 6) {
        uni.showToast({
          title: '六爻已全部完成',
          icon: 'success'
        });
        
        // 保存占卜记录到本地存储
        this.saveDivinationRecord();
        
        // 延迟显示AI聊天机器人，给用户一些时间查看卦象
        setTimeout(() => {
          this.showAiChatTrigger = true;
        }, 1000);
      }
    },
    
    handleTabClick(tab) {
      // 如果点击的是当前标签页中的home，不做任何操作
      if (tab === 'home' && !this.showDivinationPage) {
        return;
      }
      
      // 在占卜页面时，点击home按钮显示提示
      if (tab === 'home' && this.showDivinationPage) {
        uni.showToast({
          title: '请使用左上角返回按钮',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      
      // 导航到其他页面
      if (tab === 'history') {
        // 在导航前保存当前页面状态
        const app = getApp();
        if (app.globalData) {
          app.globalData.currentPage = 'history';
        }
        
        uni.navigateTo({
          url: '/pages/index/history'
        });
      } else if (tab === 'profile') {
        // 在导航前保存当前页面状态
        const app = getApp();
        if (app.globalData) {
          app.globalData.currentPage = 'profile';
        }
        
        uni.navigateTo({
          url: '/pages/index/profile'
        });
      }
    },
    
    // 添加重置到初始状态的方法
    resetToInitialState() {
      // 重置所有状态到初始值
      this.showDivinationPage = false;
      this.question = '';
      this.currentShakeStep = 0;
      this.hexagramLines = [1, 1, 1, 1, 1, 1];
      this.coinImages = [
        '/static/images/coin_front.png',
        '/static/images/coin_front.png',
        '/static/images/coin_front.png'
      ];
      // 不再隐藏AI聊天机器人触发器
      // this.showAiChatTrigger = false;
      this.isShaking = false;
      this.showCoinResult = false;
      this.showHexagramResult = false;
    },
    
    // 在methods中添加保存占卜记录的方法
    saveDivinationRecord() {
      try {
        // 生成唯一ID
        const recordId = 'record_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
        
        // 获取现有记录
        const existingRecords = uni.getStorageSync('divinationRecords') || [];
        
        // 创建新记录
        const newRecord = {
          id: recordId,
          timestamp: new Date().toISOString(),
          question: this.question,
          yaoTypes: this.yaoTypes,
          hexagramLines: [...this.hexagramLines],
          mainHexagram: {...this.mainHexagram},
          changedHexagram: this.hasChangingYao ? {...this.changedHexagram} : null,
          messages: [], // 初始时消息为空，稍后会更新
          rating: 0 // 初始评分为0，表示未评分
        };
        
        // 将新记录添加到列表开头
        existingRecords.unshift(newRecord);
        
        // 保存到本地存储
        uni.setStorageSync('divinationRecords', existingRecords);
        
        // 保存记录ID，以便后续更新聊天消息
        this.currentRecordId = recordId;
        
        console.log('占卜记录已保存，ID:', recordId);
      } catch(e) {
        console.error('保存占卜记录失败:', e);
      }
    },
    
    // 在methods中添加更新记录消息的方法
    updateRecordMessages() {
      // 只有当已经有记录ID且AI聊天机器人组件存在时才更新
      if (!this.currentRecordId || !this.$refs.aiChatBot) return;
      
      try {
        // 获取现有记录
        const existingRecords = uni.getStorageSync('divinationRecords') || [];
        
        // 找到当前记录
        const recordIndex = existingRecords.findIndex(r => r.id === this.currentRecordId);
        if (recordIndex === -1) return;
        
        // 更新消息
        existingRecords[recordIndex].messages = [...this.$refs.aiChatBot.messages];
        
        // 保存更新后的记录
        uni.setStorageSync('divinationRecords', existingRecords);
        
        console.log('记录消息已更新, ID:', this.currentRecordId, '消息数量:', this.$refs.aiChatBot.messages.length);
      } catch(e) {
        console.error('更新记录消息失败:', e);
      }
    }
  }
}
</script>

<style>
.home-container {
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
  justify-content: center;
  padding: 16px;
  padding-bottom: 8px;
  background-color: #ffffff;
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: #111118;
  letter-spacing: -0.015em;
  text-align: center;
  flex: 1;
}

.back-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111118;
}

.placeholder-view {
  width: 24px;
}

.cover-image {
  width: 100%;
  height: 218px;
  background-image: url('/static/images/首页硬币图.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.welcome-section {
  padding: 20px 16px;
  text-align: center;
}

.welcome-title {
  font-size: 24px;
  font-weight: bold;
  color: #111118;
  letter-spacing: -0.015em;
  margin-bottom: 16px;
  display: block;
}

.welcome-desc {
  font-size: 16px;
  color: #333333;
  line-height: 1.6;
  display: block;
  margin: 0 auto;
  max-width: 90%;
}

.question-section {
  padding: 12px 16px;
}

.question-input {
  width: 100%;
  height: 56px;
  background-color: #ffffff;
  border: 1px solid #dcdce5;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 16px;
  color: #111118;
  font-family: inherit;
  box-sizing: border-box;
}

.question-input::placeholder {
  color: #636388;
}

.button-section {
  padding: 12px 16px;
  display: flex;
  justify-content: center;
}

.divination-btn {
  height: 48px;
  background-color: #1919e5;
  color: #ffffff;
  border-radius: 24px;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.015em;
  padding: 0 20px;
  min-width: 84px;
  border: none;
  font-family: inherit;
  cursor: pointer;
}

.divination-btn:hover {
  background-color: #1414c8;
}

.divination-btn:active {
  opacity: 0.9;
  transform: translateY(1px);
}

.divination-btn:disabled {
  background-color: #9999e5;
  cursor: not-allowed;
}

/* 占卜页面样式 */
.divination-page {
  display: flex;
  flex-direction: column;
}

.question-display {
  padding: 16px;
  background-color: #f8f8fa;
  border-radius: 12px;
  margin: 12px 16px;
}

.question-label {
  font-size: 14px;
  color: #636388;
  margin-bottom: 8px;
  display: block;
}

.question-text {
  font-size: 16px;
  color: #111118;
  font-weight: 500;
}

.coin-section {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.coins-container {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
}

.coin {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f1f1f4;
}

.coin-buttons {
  display: flex;
  gap: 12px;
}

.coin-btn {
  height: 40px;
  background-color: #1919e5;
  color: #ffffff;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  padding: 0 16px;
  border: none;
  font-family: inherit;
}

.stop-btn {
  background-color: #e51919;
}

.coin-btn:disabled {
  background-color: #9999e5;
  cursor: not-allowed;
}

.hexagram-section, .hexagram-display-section {
  padding: 0 16px;
  margin-top: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.hexagram-section.visible, .hexagram-display-section.visible {
  opacity: 1;
}

.section-hint {
  font-size: 16px;
  font-weight: bold;
  color: #111118;
  margin-bottom: 12px;
  display: block;
  text-align: center;
}

.hexagram-display {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f8f8fa;
  border-radius: 12px;
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
  color: #111118;
  padding: 10px 10px 5px 10px;
  text-align: center;
  font-family: "楷体", KaiTi, serif;
}

.hexagram-subtitle {
  font-size: 14px;
  color: #636388;
  padding: 0 10px 5px 10px;
  text-align: center;
  font-family: "楷体", KaiTi, serif;
}

.hexagram-table {
  border: 1px solid #dcdce5;
  border-radius: 12px;
  overflow: hidden;
}

.hexagram-row {
  display: flex;
  border-bottom: 1px solid #dcdce5;
}

.hexagram-row:last-child {
  border-bottom: none;
}

.hexagram-row:nth-child(even) {
  background-color: #f8f8fa;
}

.yao-label {
  width: 30%;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #111118;
  border-right: 1px solid #dcdce5;
}

.yao-value {
  width: 70%;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.yao-value select {
  width: 100%;
  height: 36px;
  border: 1px solid #dcdce5;
  border-radius: 6px;
  padding: 0 8px;
  font-size: 14px;
  color: #111118;
  background-color: #ffffff;
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
  color: #111118;
}

.tab-item.disabled {
  color: #9999e5;
  cursor: not-allowed;
}

.tab-icon {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
}

.icon-placeholder {
  font-size: 24px;
}

.tab-text {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.015em;
}

/* 底部安全区域 */
.safe-area {
  height: 20px;
  background-color: #ffffff;
}

/* 图标样式 */
.icon-svg {
  width: 24px;
  height: 24px;
  fill: currentColor;
}
</style> 