/**
 * 封装uni-app的网络请求
 * @param {Object} options - 请求配置
 * @returns {Promise} - 返回Promise对象
 */
const request = (options) => {
  // 获取本地存储的token
  const token = uni.getStorageSync('token') || '';
  
  // 创建请求URL
  const baseURL = 'https://zcrosdarxuop.sealoshzh.site/api/v1';
  const url = options.url.startsWith('http') ? options.url : baseURL + options.url;
  
  return new Promise((resolve, reject) => {
    uni.request({
      url,
      data: options.data,
      method: options.method || 'GET',
      header: {
        'Content-Type': options.contentType || 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.header
      },
      success: (res) => {
        // 请求成功
        if (res.statusCode === 200) {
          resolve(res.data);
        } 
        // 未授权，需要登录
        else if (res.statusCode === 401) {
          uni.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none'
          });
          // 清除本地token
          uni.removeStorageSync('token');
          // 跳转到登录页面
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/index/login'
            });
          }, 1500);
          reject(res);
        } else {
          // 其他错误
          uni.showToast({
            title: res.data.message || '请求失败',
            icon: 'none'
          });
          reject(res);
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
};

/**
 * GET请求
 * @param {String} url - 请求地址
 * @param {Object} data - 请求参数
 * @param {Object} options - 其他配置
 * @returns {Promise} - 返回Promise对象
 */
const get = (url, data = {}, options = {}) => {
  return request({
    url,
    data,
    method: 'GET',
    ...options
  });
};

/**
 * POST请求
 * @param {String} url - 请求地址
 * @param {Object} data - 请求参数
 * @param {Object} options - 其他配置
 * @returns {Promise} - 返回Promise对象
 */
const post = (url, data = {}, options = {}) => {
  return request({
    url,
    data,
    method: 'POST',
    ...options
  });
};

/**
 * PUT请求
 * @param {String} url - 请求地址
 * @param {Object} data - 请求参数
 * @param {Object} options - 其他配置
 * @returns {Promise} - 返回Promise对象
 */
const put = (url, data = {}, options = {}) => {
  return request({
    url,
    data,
    method: 'PUT',
    ...options
  });
};

/**
 * DELETE请求
 * @param {String} url - 请求地址
 * @param {Object} data - 请求参数
 * @param {Object} options - 其他配置
 * @returns {Promise} - 返回Promise对象
 */
const del = (url, data = {}, options = {}) => {
  return request({
    url,
    data,
    method: 'DELETE',
    ...options
  });
};

export default {
  request,
  get,
  post,
  put,
  delete: del
}; 