// const { EShareRecordState } = require("XrFrame");
const app = getApp()
// pages/buy/buy.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vertToView: 'b1',
    RIGHT_BAR_HEIGHT: 20,
    RIGHT_ITEM_HEIGHT: 98,

    category: [],
    goodslist: {},
    goods: {},
    good: {},
    cart: [],
    cartPopupVisible: false,
    buyCount: 1,
    totalPrice: 0,

    ishiddenmodal: true,
    selectionTopArr: [],
    containerTop: 0,
    activeType: 1, //默认选中的左列哪一项

    show: false, // 底部pupop
  },
  // 加入购物车
  addcart(e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    console.log(id)
    console.log(typeof id)
    var cart = this.data.cart

    var good = this.data.good

    if (typeof id === "number") {
      good = this.data.goods[id]
    }
    console.log(good)
    var res = this.findCartItem(good.id, good.select)
    console.log(res)
    var exist = res.exist
    var index = res.index

    if (exist) {
      var buyCount = parseInt(this.data.buyCount) || 1;
      //如果存在，则增加该商品的购买数量
      cart[index].buyCount = (parseInt(cart[index].buyCount) || 0) + buyCount
    } else {
      // 如果不存在，传入该商品信息
      good.buyCount = 0
      good.buyCount = this.data.buyCount
      console.log(good)
      if (good.useconfig) {
        good.selectstr = ""
        var init = false
        for (var key in good.select) {
          if (init) {
            good.selectstr += "/"
          }
          good.selectstr += good.select[key]
          init = true
        }
      }
      cart.push(good)
    }
    this.setData({
      ishiddenmodal: true,
      buyCount: 1,
      cart: cart
    })
    this.calCartPrice()
    // wx.setStorageSync('cartItems', this.data.cart) 
    try {
      //添加购物车的消息提示框
      wx.showToast({
        title: "成功添加购物车",
        icon: "success",
        durantion: 2000
      })
    } catch (e) {
      wx.showToast({
        title: "添加失败，请检查网络",
        icon: "fail",
      })
    }
  },
  choose: function (e) {
    var good = this.data.good
    good.select[e.detail.name] = e.detail.id
    this.data.good = good
    console.log(this.data.cart)
    // good.selectd[e.currentTarget.id] = e._relatedInfo.anchorTargetText
  },
  jian() {
    if (--this.data.buyCount < 1) this.data.buyCount = 1
    this.setData({
      buyCount: this.data.buyCount,
    })
  },
  jia() {
    this.setData({
      buyCount: ++this.data.buyCount
    })
  },
  closemodal(e) {
    console.log(e.detail)
    this.setData({
      ishiddenmodal: true,
      buyCount: 1, //重置为零
      good: {}
      // itemCount: 0,
    })
  },
  // 点击跳转详情
  showmodal(e) {
    var id = e.currentTarget.dataset.id
    var good = JSON.parse(JSON.stringify(this.data.goods[id]));
    good.select = {}
    this.setData({
      ishiddenmodal: false,
      good: good
    })
  },
  // 左侧分类跳转
  changeType(e) {
    console.log(e);
    this.setData({
      activeType: e.currentTarget.dataset.index, //取到当前数组对象的自定义type更新到activeType中
      vertToView: e.currentTarget.dataset.id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  vertScroll(e) {
    console.log(e.detail);
    var horScrollHeight = e.detail.scrollTop
    var paneHeight = this.data.asideheight - 100
    var category = this.data.category //数组，包含所有商品和该分类下商品
    var goodslist = this.data.goodslist
    var sumHeight = 0;
    for (var index in category) { //循环所有商品和商品
      var goods = goodslist[index]; //商品
      var itemSize = 0
      if (typeof goods != 'undefined') { //每个商品下的所有商品 
        itemSize = goods.length
      }
      var tHeight = this.data.RIGHT_BAR_HEIGHT + itemSize * this.data.RIGHT_ITEM_HEIGHT; //计算商品高度
      if (tHeight < paneHeight) {
        tHeight = paneHeight
      }
      sumHeight += tHeight
      console.log(index, "scrollheight当前项到顶部的高度", horScrollHeight, "sumheight右侧菜单及所有商品的一共高度", sumHeight)
      if (horScrollHeight <= sumHeight) {
        console.log("滑动够多了 可以切左边了！")
        this.setData({
          activeType: category[index].id
        })
        break;
      }
    }
  },
  horiScroll(e) {

  },
  onLoad: function (options) {
    var that = this; //回调函数保存作用域
    this.fetchData()
    wx.getSystemInfo({
      success(res) {
        console.log("成功获取高度：", res.windowHeight)
        console.log("宽度", res.windowWidth)
        var asideheight = res.windowHeight
        var asidewidth = res.windowWidth
        var asideheight1 = 0;
        that.setData({
          asideheight: asideheight,
          asidewidth: asidewidth,
          // scrollheight: res.windowHeight
        })
      },
      fail: () => {
        console.log("无法获取显示器高度，请检查网络连接")
      }
    })
    var cart = wx.getStorageSync('cartItems')
    if (cart) {
      this.setData({
        // cart:wx.getStorageSync('cartItems')
      })
    }
    this.setData({
      cartPopupVisible: true
    })


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  fetchData: function () {
    const db = wx.cloud.database()
    db.collection("category").orderBy("id", "asc").get()
      .then(res => {
        console.log(res.data)
        this.data.category = res.data
        this.setData({
          category: res.data
        })
        for (var i = 0; i < res.data.length; ++i) {
          var id = res.data[i].id;
          this.fetchGoodsByCategory(id)
        }
      })
  },
  fetchGoodsByCategory: function (cid) {
    var that = this
    const db = wx.cloud.database()
    db.collection("goods").where({
      goods_type: cid
    }).get().then(res => {
      var goods = res.data
      for (var i = 0; i < goods.length; ++i) {
        var id = goods[i].id
        that.data.goods[id] = goods[i];
      }
      that.data.goodslist[cid] = goods
      that.setData({
        goodslist: that.data.goodslist
      })
    })
  },
  openCartPopup: function () {
    var show = !this.data.cartPopupVisible
    console.log(show)
    this.setData({
      cartPopupVisible: show
    })
    this.data.cartPopupVisible = show
  },
  calCartPrice: function () {
    var cart = this.data.cart
    var price = 0
    for (var i = 0; i < cart.length; ++i) {
      price = price + cart[i].buyCount * cart[i].price
    }
    this.data.totalPrice = price
    this.setData({
      totalPrice: price
    })
  },
  showPopup() {
    const show = !this.data.show
    this.setData({
      show
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },
  findCartItem: function (id, select) {
    var cart = this.data.cart
    console.log(cart)
    for (var i = 0; i < cart.length; ++i) {
      if (cart[i].id !== id) {
        continue
      }
      console.log(cart[i])
      var selectequal = true;
      if (cart[i].useconfig) {
        for (var key in select) {
          if (cart[i].select[key] !== select[key]) {
            selectequal = false;
            break
          }
        }
      }
      if (selectequal) {
        return {
          exist: true,
          index: i
        }
      }
    }
    return {
      exist: false,
      index: -1
    }
  },
  increaseCartItem: function (e) {
    console.log(e)
    var res = this.findCartItem(e.currentTarget.dataset.id, e.currentTarget.dataset.select)
    var cart = this.data.cart
    var index = res.index
    cart[index].buyCount++
    this.setData({
      cart: cart
    })
    this.calCartPrice()
  },
  decreaseCartItem: function (e) {
    console.log(e)
    var res = this.findCartItem(e.currentTarget.dataset.id, e.currentTarget.dataset.select)
    var cart = this.data.cart
    var index = res.index
    cart[index].buyCount--
    if (cart[index].buyCount == 0) {
      cart.splice(index, 1)
    }
    var visible = true
    if (cart.length <= 0) {
      visible = false
    }
    this.setData({
      cart: cart,
      show: visible
    })
    this.calCartPrice()
  },
  emptyCart: function () {
    this.setData({
      cart: [],
      show: false
    })
  },
  toPay: function () {
    const that = this;
    wx.cloud.callFunction({
      name: 'payOrder',  // 调用云函数生成预支付订单
      data: {
        amount: that.data.totalPrice * 100,  // 支付金额
        products: that.data.cart  // 商品信息
      },
      success: res => {
        const payment = res.result.payment;
        console.log(payment)
        wx.requestPayment({
          ...payment,  // 传递支付参数
          success: (res) => {
            this.setData({
              cart: []
            })
            console.log('支付成功', res);
          },
          fail: (err) => {
            console.error('支付失败', err);
          }
        });
      },
      fail: err => {
        console.error('云函数调用失败', err);
      }
    });
  }
})