import request from '@/utils/request';

/**
 * 发送占卜解析请求
 * @param {Object} data - 占卜数据和问题
 * @returns {Promise} - 返回Promise对象
 */
export function sendDivinationAnalysis(data) {
  return request.post('/ai/divination-analysis', data);
}

/**
 * 发送后续聊天消息
 * @param {Object} data - 聊天消息数据
 * @returns {Promise} - 返回Promise对象
 */
export function sendChatMessage(data) {
  return request.post('/ai/chat-messages', data);
}

/**
 * 获取聊天历史记录
 * @param {Object} params - 查询参数
 * @returns {Promise} - 返回Promise对象
 */
export function getChatHistory(params) {
  return request.get('/ai/chat-messages', params);
}

/**
 * 停止响应
 * @param {String} taskId - 任务ID
 * @param {Object} data - 用户标识
 * @returns {Promise} - 返回Promise对象
 */
export function stopResponse(taskId, data) {
  return request.post(`/ai/chat-messages/${taskId}/stop`, data);
}

/**
 * 消息反馈（点赞）
 * @param {String} messageId - 消息ID
 * @param {Object} data - 反馈数据
 * @returns {Promise} - 返回Promise对象
 */
export function feedbackMessage(messageId, data) {
  return request.post(`/ai/messages/${messageId}/feedbacks`, data);
} 