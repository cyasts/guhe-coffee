const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  const { amount, products } = event;  // 获取支付金额和商品信息

  const timestamp = Date.now();  // 获取当前时间戳
  const randomNum = Math.floor(Math.random() * 1000);  // 生成随机数
  const orderId = `ORDER_${timestamp}_${randomNum}`;  // 生成订单ID

  try {
    const db = cloud.database();
    // ------------------ 开始事务 -------------------------
    const transaction = await db.startTransaction(); 

    // 1.插入订单表
    await transaction.collection('Order').add({
      data: {
        order_id : orderId,  // 唯一订单号,
        user_id: OPENID,
        order_payment: false,
        total_amount: amount, // 总金额
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
    
    // 将商品信息转成 JSON 字符串，传递给 attach 字段
    const attach = JSON.stringify({ orderId });

    // 调用 cloudPay.unifiedOrder 生成预支付订单
    const result = await cloud.cloudPay.unifiedOrder({
      body: '故禾咖啡',  // 商品描述
      outTradeNo: `ORDER_${Date.now()}`,  // 唯一订单号
      spbillCreateIp: '127.0.0.1',  // 用户IP
      totalFee: amount,  // 支付金额，单位分
      envId: 'coffee-guhe-0g72nnjpcb27842d',
      functionName: 'payNotify',  // 回调云函数名称
      tradeType: 'JSAPI',
      subMchId: '1689292539',
      openid: OPENID,
      attach: attach  // 自定义数据，传递商品信息
    });

    console.log(result)

    return {
      payment: result.payment
      // {
      //   timeStamp: result.payment.timeStamp,
      //   nonceStr: result.payment.nonceStr,
      //   package: result.payment.package,
      //   signType: result.payment.signType,
      //   paySign: result.payment.paySign,
      // }
    };
  } catch (err) {
    return {
      error: err.message
    };
  }
};
