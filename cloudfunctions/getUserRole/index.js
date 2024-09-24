// 云函数：getUserRole
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();  // 获取用户的 openid

  try {
    // 假设用户权限存储在 `userRoles` 集合中
    const userRoleData = await db.collection('user').where({
      openid: OPENID
    }).get();

    var role = "user"
    // 返回用户的权限信息
    if (userRoleData.data.length > 0) {
      role = "admin"
    } 
    return {
      success:true,
      role:role
    }
  } catch (err) {
    return { success: false, message: '数据库查询失败', error: err };
  }
};
