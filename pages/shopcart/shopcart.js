// pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carts: [],
    // 判断购物车是否有数据
    hasList: false,
    selectAllStatus: false,
    totalPrice: ''
  },
  

  // bindlogpress长按删除数据
 

 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.cloud.callFunction({
      name: 'getMakingOrderByUser',  // 云函数的名字
      success: res => {
        if (res.result.success) {
          console.log('订单信息:', res.result.data)
          // 这里可以处理获取到的订单信息
        } else {
          console.error('查询订单失败:', res.result.errorMessage)
        }
      },
      fail: err => {
        console.error('云函数调用失败', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})