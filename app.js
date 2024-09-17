//app.js
App({
  onLaunch: function() {
    wx.cloud.init({
      env:'guhe-coffee-9gt2e9vm45166fdd'
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    this.autoLogin()
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    wx.getUserProfile({
      success : res => {
        console.log(res)
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserProfile({
            success: res => {
              console.log(res);
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  autoLogin : function () {
    const that = this;
    wx.login({
      success(res) {
        if (res.code) {
          // 发起网络请求，将 code 发送到服务器或调用云函数
          console.log(res)
          that.getUserProfile(); // 成功获取 code 后，获取用户信息
        } else {
          console.log('登录失败！' + res.errMsg);
          that.exitApp(); // 如果登录失败，调用退出程序
        }
      },
      fail() {
        console.log('微信登录失败');
        that.exitApp(); // 如果 wx.login 失败，调用退出程序
      }
    });
  },
  getUserProfile() {
    const that = this;

    wx.getUserProfile({
      desc: '获取您的昵称、头像等信息',
      success: function (res) {
        console.log('获取用户信息成功:', res.userInfo);
        // 将用户信息存储到全局变量中
        that.globalData.userInfo = res.userInfo;
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 2000
        });
      },
      fail: function () {
        console.log('获取用户信息失败');
        that.exitApp(); // 如果获取用户信息失败，调用退出程序
      }
    });
  },
  exitApp() {
    wx.showToast({
      title: '登录失败，程序即将退出',
      icon: 'none',
      duration: 2000,
      complete() {
        setTimeout(() => {
          wx.exitMiniProgram(); // 调用退出程序 API
        }, 2000); // 显示提示信息后 2 秒退出
      }
    });
  },
  globalData: {
    userInfo: null,
    cartItem : []
  }
})