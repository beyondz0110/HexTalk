import request from '@/utils/request';

/**
 * 上传图片
 * @param {Object} file - 文件对象或文件路径
 * @returns {Promise} - 返回Promise对象
 */
export function uploadImage(file) {
  // 如果传入的是文件路径而不是文件对象
  if (typeof file === 'string') {
    return new Promise((resolve, reject) => {
      const token = uni.getStorageSync('token') || '';
      
      uni.uploadFile({
        url: 'https://zcrosdarxuop.sealoshzh.site/api/v1/files/upload',
        filePath: file,
        name: 'file',
        header: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        success: (res) => {
          try {
            const data = JSON.parse(res.data);
            resolve(data);
          } catch (error) {
            reject(new Error('解析响应失败'));
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }
  
  // 创建FormData对象
  const formData = new FormData();
  formData.append('file', file);
  
  return request.request({
    url: '/files/upload',
    method: 'POST',
    // 使用FormData时需要设置特殊的Content-Type
    contentType: 'multipart/form-data',
    data: formData
  });
} 