// pages/order/order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    orderDetails: {},
    hasList: false,
    pageState: 0,
    curOrder: [],
    hisOrder: [],
    disOrder: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const app = getApp();
    const role = app.globalData.userRole;
    if (role === 'admin') {
      wx.redirectTo({
        url: '/pages/orderManage/orderManage'
      });
    }
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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      let selected = 1;
      this.getTabBar().setData({
        selected
      })
    }
    this.data.goods = app.globalData.goods
    this.setData({
      goods:this.data.goods
    })
    this.fetchOrder()
  },
  fetchOrder() {
    var that = this
    const db = wx.cloud.database();
    const openid = app.globalData.userOpenId
    db.collection("Order").where({
      user_id: openid
    }).get().then(res => {
      var orders = res.data
      that.data.orders = orders
      for (var i = 0; i < orders.length; ++i) {
        that.fetchOrderDetailsById(orders[i].order_id)
      }
      const curOrder = orders.filter(order => order.order_status !== 2);
      const hisOrder = orders.filter(order => order.order_status === 2);
      that.data.curOrder = curOrder
      that.data.hisOrder = hisOrder
      if (that.data.pageState !== 2) {
        that.data.disOrder = curOrder
      } else {
        that.data.disOrder = hisOrder
      }
      that.setData({
        disOrder: that.data.disOrder
      })
    })
  },
  fetchOrderDetailsById(orderId) {
    var that = this
    const db = wx.cloud.database();
    db.collection("Order_Detail").where({
      order_id: orderId
    }).get().then(res => {
      var orderDetails = this.data.orderDetails
      var detail = res.data
      orderDetails[orderId] = detail
      console.log(orderDetails)
      that.setData({
        orderDetails
      })
    })
  },
  changeState(e) {
    console.log(e)
    var state = e.currentTarget.dataset.id
    this.setData({
      pageState: parseInt(state)
    })
    if (state !== "2") {
      this.data.disOrder = this.data.curOrder
    } else {
      this.data.disOrder = this.data.hisOrder
    }
    this.setData({
      disOrder: this.data.disOrder
    })
  }
})