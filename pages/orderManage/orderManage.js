// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    hasList: false,
    pageState: "making",
    curOrder: [],
    hisOrder: [],
    disOrder: [],
    inproducing : false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
   this.fetchData();
   if (typeof this.getTabBar === 'function' &&  this.getTabBar()) {
    let selected = 1;
    this.getTabBar().setData({
      selected
    })
  }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  changeState(e) {
    console.log(e)
    var state = e.currentTarget.dataset.state
    this.setData({
      pageState: state
    })
    if (state === "making") {
      this.setData({
        disOrder: this.data.making
      })
    } else if (state === "taking") {
      this.setData({
        disOrder: this.data.taking
      })
    } else {
      this.setData({
        disOrder: this.data.finish
      })
    }
    console.log(this.data.disOrder.length)
  },
  updateState: function (e) {
    if (this.data.inproducing ){
      return
    }
    this.data.inproducing = true
    console.log(e)
    var that = this
    const orderId = e.currentTarget.dataset.id
    var newState = 1;
    var pageState = this.data.pageState
    if (pageState === "taking") {
      newState = 2;
    }
    wx.cloud.callFunction({
      name: 'updateOrderState', // 云函数的名字
      data: {
        orderId: orderId,
        state: newState
      },
      success: res => {
        that.fetchData();
        this.data.inproducing = false
      },
      fail: err => {
        console.error('云函数调用失败', err)
        this.data.inproducing = false
      }
    })
  },
  fetchData: function (e) {
    var that = this
    wx.cloud.callFunction({
      name: 'getAllPaymentOrder', // 云函数的名字
      success: res => {
        if (res.result.success) {
          console.log('订单信息:', res.result.data)
          // 这里可以处理获取到的订单信息
          var orders = res.result.data
          const making = orders.filter(order => order.order_status === 0);
          const taking = orders.filter(order => order.order_status === 1)
          const finish = orders.filter(order => order.order_status === 2);

          that.setData({
            making,
            taking,
            finish
          })
          console.log(making)
          if (that.data.pageState === "making") {
            that.data.disOrder = making
          } else if (this.data.pageState === "taking") {
            that.data.disOrder = taking
          } else {
            that.data.disOrder = finish
          }
          that.setData({
            disOrder: that.data.disOrder
          })
        } else {
          console.error('查询订单失败:', res.result.errorMessage)
        }
      },
      fail: err => {
        console.error('云函数调用失败', err)
      }
    })
  }
})