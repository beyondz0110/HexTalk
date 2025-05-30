import request from '@/utils/request';

/**
 * 创建占卜记录
 * @param {Object} data - 占卜数据
 * @returns {Promise} - 返回Promise对象
 */
export function createDivination(data) {
  return request.post('/divinations', data);
}

/**
 * 获取占卜记录列表
 * @param {Object} params - 分页参数
 * @returns {Promise} - 返回Promise对象
 */
export function getDivinationList(params) {
  return request.get('/divinations', params);
}

/**
 * 获取占卜记录详情
 * @param {String} id - 占卜记录ID
 * @returns {Promise} - 返回Promise对象
 */
export function getDivinationDetail(id) {
  return request.get(`/divinations/${id}`);
}

/**
 * 评分占卜记录
 * @param {String} id - 占卜记录ID
 * @param {Object} data - 评分数据
 * @returns {Promise} - 返回Promise对象
 */
export function rateDivination(id, data) {
  return request.put(`/divinations/${id}/rating`, data);
}

/**
 * 删除占卜记录
 * @param {String} id - 占卜记录ID
 * @returns {Promise} - 返回Promise对象
 */
export function deleteDivination(id) {
  return request.delete(`/divinations/${id}`);
} 