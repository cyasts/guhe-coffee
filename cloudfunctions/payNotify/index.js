const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  const {
    returnCode,
    resultCode,
    outTradeNo,
    totalFee,
    openid
  } = event; // 微信回调参数

  if (returnCode === 'SUCCESS' && resultCode === 'SUCCESS') {
    try {
      // 解析 attach 字段中的商品信息
      const products = JSON.parse(attach); // 商品信息（在 unifiedOrder 中通过 attach 传递）
      const db = cloud.database();

      // ------------------ 开始事务 -------------------------
      const transaction = await db.startTransaction(); 

      const res = await cloud.callFunction({
        name: 'generateOrderId',
      });
      const orderNumber = res.result.orderId; // 获取生成的订单ID

       // 获取当前时间
      let date = new Date();
      // 以当前完整日期和
      var orderId = "" + data.getFullYear() + (data.getMonth()+ 1) + data.getDate() + orderNumber;

      // 格式化创建时间为 2020-05-09 21:30
      var creat_date_time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' +
         date.getHours() + ':' + date.getMinutes();

      // 1.插入订单表
      await transaction.collection('Order').add({
        data: {
          order_id : orderId,
          order_number: orderNumber,
          user_id: openid,
          total_amount: totalFee, // 总金额
          order_time: creat_date_time,
          order_status: 0
        }
      });

      // 2.插入订单详情表
      for (let product of products) {
        await transaction.collection('Order_Detail').add({
          data: {
            order_id: orderId,
            unit_price: product.price,
            quantity: product.buyCount,
            product_id: product.id,
            product_config: product.selectstr
          }
        });
      }

      //提交事务
      await transaction.commit();

      // 通知商家
      // await notifyMerchant(orderId, products, totalFee);

      // 打印订单
      // await printOrderToPrinter(orderId, products, totalFee);

      return {
        errcode: 0,
        errmsg: '订单已保存并通知商家'
      };
    } catch (err) {
      console.error('处理订单失败', err);
      return {
        errcode: -1,
        errmsg: '订单保存失败'
      };
    }
  } else {
    console.error(`订单 ${outTradeNo} 支付失败`);
    return {
      errcode: -1,
      errmsg: '支付失败'
    };
  }
};