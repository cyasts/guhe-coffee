// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {orderId, state} = event
  try {
    // 更新订单状态
    const res = await db.collection('Order').where({order_id:orderId}).update({
      data: {
        order_status: parseInt(state)
      }
    })
    return {
      success: true,
      data: res
    }
  } catch (err) {
    return {
      success: false,
      error: err
    }
  }
}