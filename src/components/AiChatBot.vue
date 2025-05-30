<template>
  <!-- 悬浮触发按钮 -->
  <view 
    v-if="showTrigger"
    class="ai-trigger"
    :class="{ 'has-result': showTrigger }"
    @click="toggleChat"
    ref="trigger"
  >
    <view class="yin-yang"></view>
  </view>

  <!-- 聊天窗口 -->
  <view v-if="showChat" class="ai-chat-container">
    <view class="chat-header">
      <text class="chat-title">HexTalk</text>
      <view class="header-actions">
        <view class="refresh-btn" @click="reanalyze" v-if="hasLoadedResult && !loading">↻</view>
        <view class="close-btn" @click="showChat = false">×</view>
      </view>
    </view>

    <view class="chat-messages" id="chat-messages">
      <view v-for="(msg, index) in messages" :key="index" class="message" :class="{ 'user-message': !msg.isBot }">
        <view class="message-content">{{ msg.content }}</view>
      </view>
      <view v-if="loading" class="loading"></view>
    </view>

    <!-- 添加用户输入区域 -->
    <view class="chat-input-area">
      <input 
        type="text" 
        class="user-input" 
        v-model="userInput" 
        placeholder="继续提问..." 
        :disabled="loading"
        @keyup.enter="sendUserMessage"
      />
      <view class="send-btn" @click="sendUserMessage" :class="{ 'disabled': loading || !userInput.trim() }">
        <text>发送</text>
      </view>
    </view>
  </view>
</template>

<script>
import difyApi from '@/utils/difyApi';

export default {
  name: 'AiChatBot',
  props: {
    hexResults: {
      type: Object,
      required: true,
      default: () => ({
        hex_1st: '', hex_2nd: '', hex_3rd: '', hex_4th: '',
        hex_5th: '', hex_6th: '', mainHexagram: {}, changedHexagram: {}
      })
    },
    userQuestion: {
      type: String,
      default: ''
    },
    showTrigger: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showChat: false,
      messages: [],
      loading: false,
      difyConfig: {
        apiURL: '/api/v1/chat-messages', // 与vite.config.js的代理配置保持一致
        apiKey: 'app-v0rhDHmqfvue5JTdurdnpyKI',
        conversationId: '', // 可以为空，API会自动创建
        userId: '' // 用户ID，用于保持对话连续性
      },
      chatStarted: false,
      hasLoadedResult: false, // 添加标志记录是否已经获取过解析结果
      currentHexagramId: '', // 记录当前卦象ID，用于判断卦象是否变化
      userInput: '', // 添加用户输入变量
    }
  },
  watch: {
    showTrigger: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.chatStarted = true;
          // 不使用DOM操作，直接通过类名控制显示
        }
      }
    },
    // 监听卦象结果变化
    hexResults: {
      handler(newVal) {
        // 检查卦象是否变化
        const hexId = newVal.mainHexagram ? newVal.mainHexagram.id || newVal.mainHexagram.name : '';
        if (hexId && hexId !== this.currentHexagramId) {
          // 卦象变化，重置状态
          this.currentHexagramId = hexId;
          this.hasLoadedResult = false;
          this.messages = [];
          
          // 重要：每次卦象变化都创建新会话
          this.difyConfig.conversationId = '';
          
          // 如果聊天窗口已经打开，则自动获取新卦象的解析
          if (this.showChat) {
            this.startChatSession();
            this.hasLoadedResult = true;
          }
        }
      },
      deep: true
    }
  },
  
  mounted() {
    // 组件挂载后，确保按钮可见性正确
    if (this.showTrigger) {
      this.chatStarted = true;
      
      // 初始化当前卦象ID
      this.currentHexagramId = this.hexResults.mainHexagram ? 
        this.hexResults.mainHexagram.id || this.hexResults.mainHexagram.name : '';
      
      // 检查全局状态中是否有保存的聊天状态
      const app = getApp();
      if (app.globalData && app.globalData.divinationState && app.globalData.divinationState.chatState) {
        console.log('恢复聊天状态', app.globalData.divinationState.chatState);
        // 恢复聊天状态
        this.messages = app.globalData.divinationState.chatState.messages || [];
        this.difyConfig.conversationId = app.globalData.divinationState.chatState.conversationId || '';
        this.hasLoadedResult = app.globalData.divinationState.chatState.hasLoadedResult || false;
      }
    }
  },
  methods: {
    // 添加清除会话状态的方法
    clearChatSession() {
      this.messages = [];
      this.difyConfig.conversationId = '';
      this.hasLoadedResult = false;
    },
    
    toggleChat() {
      this.showChat = !this.showChat;
      // 只有在第一次显示聊天窗口时才发起请求
      if (this.showChat && !this.hasLoadedResult) {
        this.startChatSession();
        this.hasLoadedResult = true; // 标记已经获取过解析结果
      }
    },
    
    // 添加重新解析方法
    reanalyze() {
      if (this.loading) return; // 如果正在加载，则不执行
      
      // 清空消息
      this.messages = [];
      // 重置会话ID
      this.difyConfig.conversationId = '';
      // 重新获取解析
      this.startChatSession();
    },
    
    // 添加发送用户消息的方法
    sendUserMessage() {
      if (this.loading || !this.userInput.trim()) return;
      
      // 添加用户消息到消息列表
      this.messages.push({
        content: this.userInput,
        isBot: false
      });
      
      // 保存用户输入并清空输入框
      const userQuery = this.userInput;
      this.userInput = '';
      
      // 滚动到底部
      this.$nextTick(() => {
        this.scrollToBottom();
      });
      
      // 通知父组件更新消息记录
      this.$emit('messages-updated');
      
      // 发送消息到API
      this.sendContinuedMessage(userQuery);
    },
    
    // 发送后续消息
    sendContinuedMessage(query) {
      try {
        this.loading = true;
        
        // 添加一个机器人空消息，稍后会更新它
        this.messages.push({
          content: '思考中...',
          isBot: true
        });
        
        // 使用与初次卦象解析相同的用户ID格式，保持对话的连续性
        // 注意：必须保持用户ID的一致性才能维持同一个对话
        const userId = this.difyConfig.userId || "user_" + Math.random().toString(36).substring(2, 10);
        
        // 发送请求到Dify API - 只需要发送查询，不需要重新发送卦象数据
        // 重要：为了保持对话的连续性，这里不应该传递完整的卦象数据
        difyApi.sendChatMessage({
          apiURL: this.difyConfig.apiURL,
          apiKey: this.difyConfig.apiKey,
          inputs: {}, // 继续对话不需要重复发送卦象数据
          query: query,
          userId: userId,
          conversationId: this.difyConfig.conversationId // 关键：使用已有会话ID，保持对话连续性
        })
        .then(responseText => {
          // 处理SSE响应
          this.handleDifySSEResponse(responseText);
        })
        .catch(err => {
          console.error('API Error:', err);
              
              // 如果错误是会话不存在，尝试重新发送完整卦象数据创建新会话
          if (err.statusCode === 404 && 
              err.data && 
              (err.data.message === 'Conversation Not Exists.' || 
              err.data.code === 'not_found')) {
                
                console.log("会话不存在，尝试重新发送卦象数据创建新会话");
                // 清除会话ID
                this.difyConfig.conversationId = '';
                
                // 重新使用startChatSession发送完整卦象数据并附带用户问题
                this.restartWithQuestion(query);
                return;
              }
              
              this.updateLastMessage('回答失败，请重试');
            this.loading = false;
        });
      } catch (error) {
        console.error('API Error:', error);
        this.updateLastMessage('回答失败，请重试');
        this.loading = false;
      }
    },
    
    // 当会话ID无效时，重新使用完整卦象数据开始新会话并附带用户问题
    restartWithQuestion(query) {
      try {
        // 准备输入数据
        const yaoTypes = this.getYaoTypes();
        const inputs = {
          hex_1st: yaoTypes[0] || '',
          hex_2nd: yaoTypes[1] || '',
          hex_3rd: yaoTypes[2] || '',
          hex_4th: yaoTypes[3] || '',
          hex_5th: yaoTypes[4] || '',
          hex_6th: yaoTypes[5] || '',
          mainHexagram: this.hexResults.mainHexagram.name || '',
          changedHexagram: this.hexResults.changedHexagram ? this.hexResults.changedHexagram.name : '无变卦'
        };
        
        // 更新最后一条消息内容
        this.updateLastMessage("正在重新连接对话...");
        
        // 生成一个固定的用户ID并保存
        const userId = "user_" + Math.random().toString(36).substring(2, 10);
        this.difyConfig.userId = userId;
        
        // 使用完整卦象数据发送请求
        difyApi.sendDivinationAnalysis({
          apiURL: this.difyConfig.apiURL,
          apiKey: this.difyConfig.apiKey,
          inputs: inputs,
          query: query, // 使用用户的后续问题
          userId: userId
        })
        .then(responseText => {
          // 处理SSE响应
          this.handleDifySSEResponse(responseText);
        })
        .catch(err => {
          console.error("重新创建会话失败:", err);
            this.updateLastMessage('重新连接失败，请点击刷新按钮重试');
            this.loading = false;
        });
      } catch (error) {
        console.error('重新创建会话错误:', error);
        this.updateLastMessage('重新连接失败，请点击刷新按钮重试');
        this.loading = false;
      }
    },
    
    async startChatSession() {
      try {
        this.loading = true;
        
        // 准备输入数据
        const yaoTypes = this.getYaoTypes();
        const inputs = {
          hex_1st: yaoTypes[0] || '',
          hex_2nd: yaoTypes[1] || '',
          hex_3rd: yaoTypes[2] || '',
          hex_4th: yaoTypes[3] || '',
          hex_5th: yaoTypes[4] || '',
          hex_6th: yaoTypes[5] || '',
          mainHexagram: this.hexResults.mainHexagram.name || '',
          changedHexagram: this.hexResults.changedHexagram ? this.hexResults.changedHexagram.name : '无变卦',
          is_initial: true // 标记为初始分析
        };
        
        console.log("发送数据:", {
          query: this.userQuestion || '请解读这个卦象',
          inputs: inputs
        });
        
        // 添加一个空消息，稍后会更新它
        this.messages.push({
          content: '正在解析卦象...',
          isBot: true
        });
        
        // 生成随机用户ID并保存以保持会话连续性
        const userId = "user_" + Math.random().toString(36).substring(2, 10);
        this.difyConfig.userId = userId; // 保存用户ID以便后续使用
        
        // 发送请求到Dify API
        difyApi.sendDivinationAnalysis({
          apiURL: this.difyConfig.apiURL,
          apiKey: this.difyConfig.apiKey,
          inputs: inputs,
          query: this.userQuestion || '请解读这个卦象',
          userId: userId
        })
        .then(responseText => {
          // 处理SSE响应
          this.handleDifySSEResponse(responseText);
        })
        .catch(err => {
            console.error('API Error:', err);
            this.updateLastMessage('卦象解析失败，请重试');
            this.loading = false;
        });
      } catch (error) {
        console.error('API Error:', error);
        this.updateLastMessage('卦象解析失败，请重试');
        this.loading = false;
      }
    },
    
    handleDifySSEResponse(responseText) {
      difyApi.handleSSEResponse(responseText, {
        onMessage: (data) => {
            if (data.answer) {
              // 格式化文本，处理特殊标记
            const formattedText = this.formatText(data.fullAnswer || data.answer);
              this.updateLastMessage(formattedText);
            }
            
          // 保存会话ID
          if (data.conversation_id) {
            this.difyConfig.conversationId = data.conversation_id;
            console.log("获取会话ID:", data.conversation_id);
            }
        },
        onMessageEnd: (data) => {
          console.log("消息结束，完整回复:", data.fullAnswer);
            
            // 保存会话ID
            if (data.conversation_id) {
              this.difyConfig.conversationId = data.conversation_id;
            }
            
            // 通知父组件更新消息记录
            this.$emit('messages-updated');
          this.loading = false;
        },
        onError: (data) => {
            console.error("API错误:", data);
            this.updateLastMessage('解析出错: ' + (data.message || '未知错误'));
            
            // 如果是会话ID错误，重置会话ID
            if (data.code === 'conversation_not_exists' || 
                data.code === 'not_found' || 
                (data.message && data.message.includes('Conversation'))) {
              console.log("会话不存在，重置会话ID");
              this.difyConfig.conversationId = '';
            }
          
          this.loading = false;
          }
      });
    },
    
    formatText(text) {
      if (!text) return '';
      
      // 清理常见的乱码和特殊字符
      let cleanedText = text;
      
      // 替换多余的markdown符号和特殊格式
      cleanedText = cleanedText.replace(/#{1,6}\s+\*\*/g, '【'); // 替换 ### ** 等格式
      cleanedText = cleanedText.replace(/\*\*(?=\S)/g, ''); // 删除开始的**
      cleanedText = cleanedText.replace(/(?<=\S)\*\*/g, ''); // 删除结束的**
      
      // 清理乱码但保留标题
      cleanedText = cleanedText.replace(/【\s*(\d+)天补救关键建议.*?】/g, '【$1天补救关键建议】');
      
      // 清理重复的符号
      cleanedText = cleanedText.replace(/---+/g, '');
      cleanedText = cleanedText.replace(/\*\*\*+/g, '');
      cleanedText = cleanedText.replace(/#{3,}/g, '');
      
      // 清理包含明显乱码的行
      cleanedText = cleanedText.replace(/.*YI BE JU.*\n?/g, '');
      cleanedText = cleanedText.replace(/.*不考虑.*解矛.*\n?/g, '');
      cleanedText = cleanedText.replace(/.*防微杜渐.*\n?/g, '');
      
      // 处理标题【断言】【潮因】【速言】等格式
      cleanedText = cleanedText.replace(/【(.*?)】/g, '\n【$1】 ');
      
      // 处理数字列表
      cleanedText = cleanedText.replace(/(\d+)[\.、]/g, '\n$1. ');
      
      // 确保段落之间有适当的空行，但不要太多
      cleanedText = cleanedText.replace(/([。！？])\s*/g, '$1\n');
      
      // 删除多余的空行，最多保留一个空行
      cleanedText = cleanedText.replace(/\n{2,}/g, '\n');
      
      // 去除开头和结尾的空白
      cleanedText = cleanedText.trim();
      
      return cleanedText;
    },
    
    updateLastMessage(content) {
      if (this.messages.length > 0) {
        this.messages[this.messages.length - 1].content = content;
        // 添加延时，确保DOM更新后再滚动
        setTimeout(() => {
          this.scrollToBottom();
        }, 50);
      }
    },
    
    scrollToBottom() {
      // 获取聊天消息容器
      const messagesContainer = document.getElementById('chat-messages');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    },
    
    getYaoTypes() {
      // 从hexResults中获取爻的类型
      if (this.hexResults.yaoTypes && Array.isArray(this.hexResults.yaoTypes)) {
        return this.hexResults.yaoTypes;
      }
      return ['少阳', '少阳', '少阳', '少阳', '少阳', '少阳'];
    }
  }
}
</script>

<style>
.ai-trigger {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #2c3e50;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  z-index: 1000;
  animation: fadeIn 0.5s ease forwards;
}

.has-result {
  /* 不再需要animation-play-state */
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.yin-yang {
  width: 40px;
  height: 40px;
  background: linear-gradient(90deg, #fff 50%, #000 50%);
  border-radius: 50%;
  position: relative;
}

.yin-yang:before,
.yin-yang:after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  top: 0;
}

.yin-yang:before {
  left: 0;
  background: #fff;
  border: 10px solid #000;
}

.yin-yang:after {
  left: 20px;
  background: #000;
  border: 10px solid #fff;
}

.ai-chat-container {
  position: fixed;
  bottom: 140px;
  right: 20px;
  width: 310px;
  height: 430px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  z-index: 999;
}

.chat-header {
  padding: 16px;
  background: #2c3e50;
  color: white;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-title {
  font-size: 16px;
  font-weight: bold;
  color: white;
  letter-spacing: 0.015em;
  font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
}

.header-actions {
  display: flex;
  align-items: center;
}

.refresh-btn {
  font-size: 22px;
  color: white;
  padding: 0 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.refresh-btn:hover {
  transform: rotate(180deg);
}

.close-btn {
  font-size: 24px;
  color: white;
  padding: 0 8px;
  cursor: pointer;
}

.chat-messages {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  background: #f8f8fa;
  font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
}

.user-message {
  background: #e3f2fd;
  align-self: flex-end;
  margin-left: auto;
  max-width: 85%;
  border-radius: 12px 4px 12px 12px;
}

.message {
  margin: 10px 0;
  padding: 10px 14px;
  background: white;
  border-radius: 4px 12px 12px 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.message-content {
  font-size: 14px;
  line-height: 1.4;
  word-break: break-word;
  white-space: pre-line;
  text-align: justify;
  font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
  letter-spacing: 0.015em;
  color: #111118;
}

.message-content p {
  margin: 8px 0;
}

.message-content h3, 
.message-content h4 {
  margin: 10px 0 6px 0;
  font-weight: bold;
}

.message-content strong {
  font-weight: bold;
}

.loading {
  padding: 12px;
  text-align: center;
  color: #636388;
  font-size: 14px;
  font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
  letter-spacing: 0.015em;
}

/* 添加用户输入区样式 */
.chat-input-area {
  display: flex;
  padding: 10px;
  background: white;
  border-top: 1px solid #eee;
  border-radius: 0 0 12px 12px;
}

.user-input {
  flex: 1;
  height: 36px;
  border: 1px solid #dcdce5;
  border-radius: 18px;
  padding: 0 12px;
  font-size: 14px;
  font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  color: #111118;
  background: #f5f5f5;
}

.send-btn {
  width: 60px;
  height: 36px;
  margin-left: 8px;
  background: #1919e5;
  color: white;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  letter-spacing: 0.015em;
  cursor: pointer;
}

.send-btn.disabled {
  background: #cccccc;
  cursor: not-allowed;
}

/* 移动设备上的响应式布局 */
@media screen and (max-width: 480px) {
  .ai-chat-container {
    width: 90%;
    height: 70vh;
    right: 5%;
    bottom: 100px;
  }
  
  .ai-trigger {
    right: 10px;
  }
}
</style> 