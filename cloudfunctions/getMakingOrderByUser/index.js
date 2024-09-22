// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化云开发
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV  // 使用当前云环境
})

// 获取数据库引用
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()  // 获取微信调用上下文，包括 openid
  const openid = wxContext.OPENID         // 当前用户的 openid

  try {
    // 查询订单表中的订单
    const orderRes = await db.collection('Order')
      .where({
        user_id: openid,  // 根据 openid 过滤订单
        order_payment: true,
        order_status:_.in([0, 1])
      })
      .get()

    const orders = orderRes.data // 获取订单信息数组

    // 如果订单为空，直接返回
    if (orders.length === 0) {
      return {
        success: true,
        data: []
      }
    }

    // 提取所有订单的 orderId
    const orderIds = orders.map(order => order.order_id)

    // 查询订单详情表，获取与订单相关的详情
    const orderDetailsRes = await db.collection('Order_Detail')
      .where({
        order_id: _.in(orderIds)  // 根据 orderId 查询订单详情
      })
      .get()

    const orderDetails = orderDetailsRes.data  // 获取订单详情信息数组

    // 提取所有订单详情中的 productId
    const productIds = orderDetails.map(detail => detail.product_id)

    // 查询商品表，获取与订单详情中的商品相关的信息
    const productsRes = await db.collection('goods')
      .where({
        id: _.in(productIds)  // 根据 productId 查询商品详情
      })
      .get()

    const products = productsRes.data  // 获取商品信息数组

    // 将商品信息合并到订单详情
    const mergedOrderDetails = orderDetails.map(detail => {
      // 找到对应的商品信息
      const productInfo = products.find(product => product.id === detail.product_id)
      return {
        ...detail,
        goods: productInfo  // 将商品信息嵌入订单详情
      }
    })

    // 将订单详情合并到订单中
    const mergedOrders = orders.map(order => {
      return {
        ...order,
        details: mergedOrderDetails.filter(detail => detail.order_id === order.order_id)
      }
    })

    // 返回合并后的结果
    return {
      success: true,
      data: mergedOrders
    }

  } catch (err) {
    // 如果查询失败，返回错误信息
    return {
      success: false,
      errorMessage: err.message
    }
  }
}
