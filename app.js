//app.js
App({
  onLaunch: function() {
    wx.cloud.init({
      env:'coffee-guhe-0g72nnjpcb27842d',
      traceUser: true
    })

    this.globalData.userInfo = wx.getStorageSync('userInfo') || []
    this.globalData.cartItem = wx.getStorageSync('cartItem') || []

    wx.cloud.callFunction({
      name: 'login', 
      success: res => {
        console.log('获取的 openid:', res.result.openid);  // 打印获取的 openid
        // 将 openid 存入 globalData
        this.globalData.userOpenId = res.result.openid;
        wx.cloud.database().collection("user").where({
          openid:res.result.openid
        }).get().then(r=>{
          if (r.data.length>0) {
            this.globalData.userRole = "admin"
          }else {
            this.globalData.userRole = "user"
          }
        })
      },
      fail: err => {
        console.error('获取 openid 失败', err);  // 打印错误信息
      }
    });
  },
  globalData: {
    userInfo: null,
    userRole:"user",
    userOpenId : null,
    cartItem : [],
    goods:{}
  }
})