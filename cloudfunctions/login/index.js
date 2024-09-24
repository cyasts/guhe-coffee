// 云函数 login/index.js
const cloud = require('wx-server-sdk')
// 初始化云开发
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV  // 使用当前云环境
})
const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}