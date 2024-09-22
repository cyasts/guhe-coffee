const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  const { amount, products } = event;  // 获取支付金额和商品信息

  try {
    // 将商品信息转成 JSON 字符串，传递给 attach 字段
    const attach = JSON.stringify(products);  // 商品信息包括商品ID、名称、数量等

    // 调用 cloudPay.unifiedOrder 生成预支付订单
    const result = await cloud.cloudPay.unifiedOrder({
      body: '故禾咖啡',  // 商品描述
      outTradeNo: `ORDER_${Date.now()}`,  // 唯一订单号
      spbillCreateIp: '127.0.0.1',  // 用户IP
      totalFee: amount,  // 支付金额，单位分
      envId: 'guhe-coffee-9gt2e9vm45166fdd',
      functionName: 'payNotify',  // 回调云函数名称
      tradeType: 'JSAPI',
      openid: OPENID,
      attach: attach  // 自定义数据，传递商品信息
    });

    console.log(result)

    return {
      payment: {
        timeStamp: result.timeStamp,
        nonceStr: result.nonceStr,
        package: result.package,
        signType: 'MD5',
        paySign: result.paySign,
      }
    };
  } catch (err) {
    return {
      error: err.message
    };
  }
};
