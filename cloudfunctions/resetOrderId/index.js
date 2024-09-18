// 云函数 resetOrderId
const cloud = require('wx-server-sdk');
cloud.init();

const db = cloud.database();

exports.main = async (event, context) => {
  const orderCounter = db.collection('orderCounter');
  
  // 定义要使用的自定义字段
  const customOrderField = 'documentid';
  const customOrderIdValue = 'orderIdCounter';  // 自定义 orderId 值

  // 获取当前日期
  const today = new Date();
  const todayStr = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');

  try {
    // 重置订单号
    await orderCounter.where({
            [customOrderField]: customOrderIdValue
        }).update({
      data: {
        currentOrderId: 1,  // 重置为1
        lastResetDate: todayStr  // 更新重置日期
      }
    });

    return {
      success: true
    };
  } catch (err) {
    console.error('订单号重置失败', err);
    return {
      success: false,
      errorMessage: err.message
    };
  }
};
