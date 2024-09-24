// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
   // 开始事务
  const wxContext = cloud.getWXContext()
  const {goods} = event;

   for (const product of goods) {
    const gid = product.id
    const num = parseInt(product.buyCount)
    await db.collection("goods").where({
      id: gid
    }).update({
      data:{
        inventory:db.command.inc(-num),
        sales:db.command.inc(num)
      }
    })
  }
  // 提交事务
  
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}