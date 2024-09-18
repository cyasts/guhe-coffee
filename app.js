//app.js
App({
  onLaunch: function() {
    wx.cloud.init({
      env:'guhe-coffee-9gt2e9vm45166fdd',
      traceUser: true
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.globalData.userInfo = wx.getStorageSync('userInfo') || []
    this.globalData.cartItem = wx.getStorageSync('cartItem') || []

    wx.cloud.callFunction({
      name: 'login', 
      success: res => {
        console.log(res)
        console.log('获取的 openid:', res.result.openid);  // 打印获取的 openid
        // 将 openid 存入 globalData
        this.globalData.userOpenId = res.result.openid;
      },
      fail: err => {
        console.error('获取 openid 失败', err);  // 打印错误信息
      }
    });
  },
  globalData: {
    userInfo: null,
    userOpenId : null,
    cartItem : []
  }
})