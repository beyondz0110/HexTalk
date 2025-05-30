import request from '@/utils/request';

/**
 * 用户注册
 * @param {Object} data - 注册信息
 * @returns {Promise} - 返回Promise对象
 */
export function register(data) {
  return request.post('/users/register', data);
}

/**
 * 用户登录
 * @param {Object} data - 登录信息
 * @returns {Promise} - 返回Promise对象
 */
export function login(data) {
  return request.post('/users/login', data);
}

/**
 * 微信登录
 * @param {Object} data - 微信授权码
 * @returns {Promise} - 返回Promise对象
 */
export function wechatLogin(data) {
  return request.post('/users/login/wechat', data);
}

/**
 * QQ登录
 * @param {Object} data - QQ授权码
 * @returns {Promise} - 返回Promise对象
 */
export function qqLogin(data) {
  return request.post('/users/login/qq', data);
}

/**
 * 忘记密码
 * @param {Object} data - 邮箱信息
 * @returns {Promise} - 返回Promise对象
 */
export function forgotPassword(data) {
  return request.post('/users/forgot-password', data);
}

/**
 * 重置密码
 * @param {Object} data - 重置密码信息
 * @returns {Promise} - 返回Promise对象
 */
export function resetPassword(data) {
  return request.post('/users/reset-password', data);
}

/**
 * 获取用户信息
 * @returns {Promise} - 返回Promise对象
 */
export function getUserProfile() {
  return request.get('/users/profile');
}

/**
 * 更新用户信息
 * @param {Object} data - 更新的用户信息
 * @returns {Promise} - 返回Promise对象
 */
export function updateUserProfile(data) {
  return request.put('/users/profile', data);
}

/**
 * 修改密码
 * @param {Object} data - 密码信息
 * @returns {Promise} - 返回Promise对象
 */
export function changePassword(data) {
  return request.put('/users/change-password', data);
}

/**
 * 退出登录
 * @returns {Promise} - 返回Promise对象
 */
export function logout() {
  return request.post('/users/logout');
} 