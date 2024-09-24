const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  const { orderId, amount } = event;  // 获取支付金额和商品信息

    // 调用 cloudPay.unifiedOrder 生成预支付订单
    const result = await cloud.cloudPay.unifiedOrder({
      body: '故禾咖啡',  // 商品描述
      outTradeNo: orderId,  // 唯一订单号
      spbillCreateIp: '127.0.0.1',  // 用户IP
      totalFee: amount,  // 支付金额，单位分
      envId: 'coffee-guhe-0g72nnjpcb27842d',
      functionName: 'payNotify',  // 回调云函数名称
      tradeType: 'JSAPI',
      subMchId: '1689292539',
      openid: OPENID
    });

    return {
      payment: result.payment
    }
};
