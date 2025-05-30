<template>
  <view class="login-container" v-if="isLoginPage">
    <!-- 登录界面 -->
    <view class="login-section">
      <view class="header">
        <text class="title">Hex talk</text>
      </view>
      
      <view class="form">
        <view class="input-group">
          <input 
            type="text" 
            class="input" 
            placeholder="用户名/手机号/邮箱" 
            v-model="loginData.username"
          />
        </view>
        
        <view class="input-group">
          <input 
            type="password" 
            class="input" 
            placeholder="密码" 
            v-model="loginData.password"
          />
        </view>
        
        <text class="forgot-password" @click="goToForgotPassword">忘记密码?</text>
        
        <button class="login-btn" @click="handleLogin" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
        
        <view class="divider">
          <text class="divider-text">或使用以下方式登录</text>
        </view>
        
        <view class="third-party">
          <button class="third-party-btn wechat" @click="handleWechatLogin">
            <text>微信</text>
          </button>
          <button class="third-party-btn qq" @click="handleQQLogin">
            <text>QQ</text>
          </button>
        </view>
        
        <text class="signup-link" @click="goToSignup">没有账号？立即注册</text>
      </view>
    </view>
  </view>
  
  <!-- 注册界面 -->
  <view class="register-container" v-else>
    <view class="register-section">
      <view class="header">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">&#8592;</text>
        </view>
        <text class="title">注册</text>
        <view class="placeholder-view"></view>
      </view>
      
      <view class="form">
        <view class="input-group">
          <input 
            type="text" 
            class="input" 
            placeholder="用户名" 
            v-model="registerData.username"
          />
        </view>
        
        <view class="input-group">
          <input 
            type="text" 
            class="input" 
            placeholder="邮箱" 
            v-model="registerData.email"
          />
        </view>
        
        <view class="input-group">
          <input 
            type="password" 
            class="input" 
            placeholder="密码" 
            v-model="registerData.password"
          />
        </view>
        
        <view class="input-group">
          <input 
            type="password" 
            class="input" 
            placeholder="确认密码" 
            v-model="registerData.confirmPassword"
          />
        </view>
        
        <button class="register-btn" @click="handleRegister" :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>
        
        <text class="signin-link" @click="goToLogin">已有账号？立即登录</text>
      </view>
    </view>
  </view>
</template>

<script>
import { userApi } from '@/api';

export default {
  data() {
    return {
      loginData: {
        username: '',
        password: ''
      },
      registerData: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      isLoginPage: true,
      loading: false
    }
  },
  methods: {
    async handleLogin() {
      try {
        // 表单验证
        if (!this.loginData.username) {
          uni.showToast({
            title: '请输入用户名或邮箱',
            icon: 'none'
          });
          return;
        }
        
        if (!this.loginData.password) {
          uni.showToast({
            title: '请输入密码',
            icon: 'none'
          });
          return;
        }
        
        this.loading = true;
        
        // 调用登录API
        const res = await userApi.login(this.loginData);
        
        if (res.code === 200) {
          // 保存用户信息和token
          uni.setStorageSync('token', res.data.token);
          uni.setStorageSync('userInfo', res.data);
          
          uni.showToast({
            title: '登录成功',
            icon: 'success'
          });
          
          // 登录成功后跳转到首页
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/index/home'
            });
          }, 1500);
        } else {
          uni.showToast({
            title: res.message || '登录失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('登录失败:', error);
        uni.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    
    async handleRegister() {
      try {
        // 表单验证
        if (!this.registerData.username) {
          uni.showToast({
            title: '请输入用户名',
            icon: 'none'
          });
          return;
        }
        
        if (!this.registerData.email) {
          uni.showToast({
            title: '请输入邮箱',
            icon: 'none'
          });
          return;
        }
        
        if (!this.registerData.password) {
          uni.showToast({
            title: '请输入密码',
            icon: 'none'
          });
          return;
        }
        
        if (this.registerData.password !== this.registerData.confirmPassword) {
          uni.showToast({
            title: '两次密码输入不一致',
            icon: 'none'
          });
          return;
        }
        
        this.loading = true;
        
        // 调用注册API
        const res = await userApi.register(this.registerData);
        
        if (res.code === 200) {
          // 保存用户信息和token
          uni.setStorageSync('token', res.data.token);
          uni.setStorageSync('userInfo', res.data);
          
          uni.showToast({
            title: '注册成功',
            icon: 'success'
          });
          
          // 注册成功后跳转到首页
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/index/home'
            });
          }, 1500);
        } else {
          uni.showToast({
            title: res.message || '注册失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('注册失败:', error);
        uni.showToast({
          title: '注册失败，请重试',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    
    async handleWechatLogin() {
      try {
        this.loading = true;
        
        // 获取微信授权码
        uni.login({
          provider: 'weixin',
          success: async (loginRes) => {
            if (loginRes.code) {
              // 调用微信登录API
              const res = await userApi.wechatLogin({
                code: loginRes.code
              });
              
              if (res.code === 200) {
                // 保存用户信息和token
                uni.setStorageSync('token', res.data.token);
                uni.setStorageSync('userInfo', res.data);
                
                uni.showToast({
                  title: '登录成功',
                  icon: 'success'
                });
                
                // 登录成功后跳转到首页
                setTimeout(() => {
                  uni.reLaunch({
                    url: '/pages/index/home'
                  });
                }, 1500);
              } else {
                uni.showToast({
                  title: res.message || '微信登录失败',
                  icon: 'none'
                });
              }
            } else {
              uni.showToast({
                title: '获取微信授权失败',
                icon: 'none'
              });
            }
          },
          fail: () => {
            uni.showToast({
              title: '微信登录失败',
              icon: 'none'
            });
          },
          complete: () => {
            this.loading = false;
          }
        });
      } catch (error) {
        console.error('微信登录失败:', error);
        uni.showToast({
          title: '微信登录失败，请重试',
          icon: 'none'
        });
        this.loading = false;
      }
    },
    
    async handleQQLogin() {
      try {
        this.loading = true;
        
        // 获取QQ授权码
        uni.login({
          provider: 'qq',
          success: async (loginRes) => {
            if (loginRes.code) {
              // 调用QQ登录API
              const res = await userApi.qqLogin({
                code: loginRes.code
              });
              
              if (res.code === 200) {
                // 保存用户信息和token
                uni.setStorageSync('token', res.data.token);
                uni.setStorageSync('userInfo', res.data);
                
                uni.showToast({
                  title: '登录成功',
                  icon: 'success'
                });
                
                // 登录成功后跳转到首页
                setTimeout(() => {
                  uni.reLaunch({
                    url: '/pages/index/home'
                  });
                }, 1500);
              } else {
                uni.showToast({
                  title: res.message || 'QQ登录失败',
                  icon: 'none'
                });
              }
            } else {
              uni.showToast({
                title: '获取QQ授权失败',
                icon: 'none'
              });
            }
          },
          fail: () => {
            uni.showToast({
              title: 'QQ登录失败',
              icon: 'none'
            });
          },
          complete: () => {
            this.loading = false;
          }
        });
      } catch (error) {
        console.error('QQ登录失败:', error);
        uni.showToast({
          title: 'QQ登录失败，请重试',
          icon: 'none'
        });
        this.loading = false;
      }
    },
    
    goToForgotPassword() {
      uni.navigateTo({
        url: '/pages/index/forgot-password'
      });
    },
    
    goToSignup() {
      // 切换到注册页面
      this.isLoginPage = false;
    },
    
    goToLogin() {
      // 切换到登录页面
      this.isLoginPage = true;
    },
    
    goBack() {
      // 返回登录页面
      this.isLoginPage = true;
    }
  }
}
</script>

<style>
/* 登录页样式 */
.login-container {
  min-height: 100vh;
  background-color: #f9f9fb;
  font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
}

.login-section {
  padding: 20px;
}

.header {
  padding: 20px 0;
  text-align: center;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #111018;
  letter-spacing: -0.015em;
}

.form {
  margin-top: 20px;
}

.input-group {
  margin-bottom: 15px;
}

.input {
  width: 100%;
  height: 56px;
  background-color: #ebeaf1;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 16px;
  color: #111018;
  box-sizing: border-box;
}

.forgot-password {
  display: block;
  text-align: center;
  color: #625c8a;
  font-size: 14px;
  margin: 10px 0 20px;
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  height: 48px;
  background-color: #3419e5;
  color: #ffffff;
  border-radius: 24px;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.015em;
  border: none;
  box-shadow: 0 4px 8px rgba(154, 127, 227, 0.3);
}

.login-btn:active {
  opacity: 0.9;
  transform: translateY(1px);
}

.login-btn[disabled] {
  background-color: #cccccc;
  opacity: 0.7;
  color: #ffffff;
}

.divider {
  display: flex;
  align-items: center;
  margin: 25px 0;
}

.divider-text {
  width: 100%;
  text-align: center;
  color: #625c8a;
  font-size: 14px;
}

.third-party {
  display: flex;
  justify-content: space-between;
}

.third-party-btn {
  width: 48%;
  height: 40px;
  background-color: #ebeaf1;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  color: #111018;
  border: none;
}

.third-party-btn:active {
  opacity: 0.8;
}

.signup-link {
  display: block;
  text-align: center;
  color: #625c8a;
  font-size: 14px;
  margin-top: 30px;
  text-decoration: underline;
}

/* 注册页样式 */
.register-container {
  min-height: 100vh;
  background-color: #f9f8fc;
  font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
}

.register-section {
  padding: 20px;
}

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 24px;
  color: #100e1b;
}

.placeholder-view {
  width: 40px;
}

.register-btn {
  width: 100%;
  height: 48px;
  background-color: #3419e5;
  color: #ffffff;
  border-radius: 24px;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.015em;
  border: none;
  box-shadow: 0 4px 8px rgba(52, 25, 229, 0.3);
  margin-top: 10px;
}

.register-btn:active {
  opacity: 0.9;
  transform: translateY(1px);
}

.register-btn[disabled] {
  background-color: #cccccc;
  opacity: 0.7;
  color: #ffffff;
}

.signin-link {
  display: block;
  text-align: center;
  color: #584e97;
  font-size: 14px;
  margin-top: 30px;
  text-decoration: underline;
}

/* 注册页的header样式 */
.register-container .header {
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
}

.register-container .title {
  text-align: center;
  flex: 1;
}
</style> 