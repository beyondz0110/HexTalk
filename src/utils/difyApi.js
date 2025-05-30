/**
 * Dify API工具类
 * 用于与Dify API直接通信，与后端API分开处理
 */

/**
 * 发送占卜解析请求到Dify API
 * @param {Object} options - 请求配置
 * @returns {Promise} - 返回Promise对象
 */
export function sendDivinationAnalysis(options) {
  const { apiURL, apiKey, inputs, query, userId, responseMode = 'streaming' } = options;
  
  return new Promise((resolve, reject) => {
    uni.request({
      url: apiURL,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      data: {
        inputs,
        query,
        user: userId,
        response_mode: responseMode
      },
      responseType: 'text', // 确保以文本方式接收响应
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

/**
 * 发送后续聊天消息到Dify API
 * @param {Object} options - 请求配置
 * @returns {Promise} - 返回Promise对象
 */
export function sendChatMessage(options) {
  const { 
    apiURL, 
    apiKey, 
    inputs = {}, 
    query, 
    userId, 
    conversationId,
    responseMode = 'streaming'
  } = options;
  
  return new Promise((resolve, reject) => {
    uni.request({
      url: apiURL,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      data: {
        inputs,
        query,
        user: userId,
        conversation_id: conversationId,
        response_mode: responseMode
      },
      responseType: 'text', // 确保以文本方式接收响应
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

/**
 * 处理SSE响应文本
 * @param {String} responseText - SSE响应文本
 * @param {Function} onMessage - 消息事件回调
 * @param {Function} onMessageEnd - 消息结束事件回调
 * @param {Function} onError - 错误事件回调
 */
export function handleSSEResponse(responseText, { onMessage, onMessageEnd, onError }) {
  // SSE响应格式为多行data: {...}\n\n
  const lines = responseText.split('\n\n');
  
  // 检查是否为非SSE响应（例如普通JSON或错误消息）
  if (lines.length === 1 && !lines[0].startsWith('data: ')) {
    try {
      // 尝试解析为JSON
      const jsonResponse = JSON.parse(responseText);
      if (jsonResponse.error || jsonResponse.code) {
        // 处理错误
        if (onError) {
          onError(jsonResponse);
        }
        return;
      }
    } catch (e) {
      // 不是JSON，直接处理
      if (onMessage) {
        onMessage({
          answer: responseText,
          event: 'message'
        });
      }
      return;
    }
  }
  
  // 处理SSE格式的响应
  let fullAnswer = '';
  
  for (const line of lines) {
    if (!line.startsWith('data: ')) continue;
    
    try {
      // 提取JSON数据部分
      const jsonStr = line.substring(6); // 去掉 "data: " 前缀
      const data = JSON.parse(jsonStr);
      
      // 根据事件类型处理数据
      if (data.event === 'agent_message' || data.event === 'message') {
        if (data.answer) {
          fullAnswer += data.answer;
          
          if (onMessage) {
            onMessage({
              ...data,
              fullAnswer
            });
          }
        }
      } 
      else if (data.event === 'message_end') {
        if (onMessageEnd) {
          onMessageEnd({
            ...data,
            fullAnswer
          });
        }
      }
      else if (data.event === 'error') {
        if (onError) {
          onError(data);
        }
      }
    } catch (e) {
      console.error("解析SSE数据失败:", e);
      // 如果解析失败，但有部分数据，尝试使用已有数据
      if (fullAnswer && onMessage) {
        onMessage({
          event: 'message',
          answer: fullAnswer
        });
      }
    }
  }
}

export default {
  sendDivinationAnalysis,
  sendChatMessage,
  handleSSEResponse
}; 