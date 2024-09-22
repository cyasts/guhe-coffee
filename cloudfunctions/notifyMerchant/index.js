// 云函数 payNotify
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 微信消息推送函数
async function notifyMerchant(orderId, products, totalFee) {
  const merchantOpenId = '商家的openid'; // 商家微信的 openid

  try {
    await cloud.openapi.subscribeMessage.send({
      touser: merchantOpenId,
      templateId: '你的订阅消息模板ID',
      page: 'pages/order/detail',  // 点击消息跳转的页面
      data: {
        orderId: {
          value: orderId
        },
        productInfo: {
          value: products.map(product => product.productName).join(', ')
        },
        totalFee: {
          value: (totalFee / 100).toFixed(2) + '元'
        },
        orderTime: {
          value: new Date().toLocaleString()
        }
      }
    });
    console.log('商家通知发送成功');
  } catch (err) {
    console.error('商家通知发送失败', err);
  }
}
