const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  const {
    resultCode,
    returnCode,
    attach,
  } = event

  console.log("resultcode:" + resultCode)
  console.log("returncode:" + returnCode)
  console.log("开始回调")
  const orderId = JSON.parse(attach).orderId
  console.log("orderId:" + orderId)
  if (returnCode === 'SUCCESS' && resultCode === 'SUCCESS') {
    try {
      // 解析 attach 字段中的商品信息
      const db = cloud.database();
      // 获取当前时间
      let date = new Date();
      // 格式化创建时间为 2020-05-09 21:30
      var creat_date_time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' +
       date.getHours() + ':' + date.getMinutes();
       console.log("time"+creat_date_time)

      const res = await cloud.callFunction({
        name: 'generateOrderId',
      });
      console.log("getNumber:")
      console.log(res)
      const orderNumber = parseInt(res.result.orderId); // 生成取单号
      console.log("orderNumber:")
      console.log(orderNumber)
      await db.collection('Order').where({
        order_id: orderId
      }).update({
        data:{
          order_number: orderNumber,
          order_payment: true,
          order_time: creat_date_time
        }
      })
      // 通知商家
      // await notifyMerchant(orderId, products, totalFee);

      // 打印订单
      await cloud.callFunction({
        name:'printOrderToPrinter',
        data:{
          orderId:orderId
        }
      })
    } catch (err) {
      console.error('处理订单失败', err);
    }
  } else {
    console.error(`订单 ${orderId} 支付失败`);
  }
  return {
    errcode: 0,
    errmsg: '订单已保存并通知商家'
  };
};