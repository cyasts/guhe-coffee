// 飞鹅云打印 API 调用
const cloud = require('wx-server-sdk');
const crypto = require('crypto');
const request = require('request');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 打印订单信息到云打印机
 exports.main = async (event, context) => {
   const {orderId} = event
   console.log(orderId)
  //--------------------获取数据----------------------------------
  const db = cloud.database();
  // 查询订单表，获取订单信息
  const orderRes = await db.collection('Order').where({
    order_id: orderId
  }).get();
  const order = orderRes.data[0]
  console.log(order)

  const orderDetailsResult = await db.collection('Order_Detail').where({
    order_id: orderId  // 根据订单 ID 过滤
  }).get();
  // 查询订单详情，获取所有商品
  const products = await Promise.all(orderDetailsResult.data.map(async detail => {
    console.log(detail)
    // 对每个商品ID进行查询，获取商品名称
    const product = await db.collection('goods').where({id:parseInt(detail.product_id)}).get();
    const productInfo = product.data[0]
    console.log(productInfo)
    const specPart = detail.product_config ? `(${detail.product_config})` : '';
    const productString = `${productInfo.name}${specPart} x ${detail.quantity} ${productInfo.price}元`;
    return productString;
  }));
  console.log(products)
  const order_number = order.order_number
  const price = (order.total_amount / 100).toFixed(2)
  const order_time = order.order_time

  const USER = '1559641703@qq.com';
  const UKEY = 'EtSSqyVqxyzRPyzV';
  const SN = '922382185';
  const timestamp = new Date().getTime();
  const content = `<CB>取单号: ${order_number}</CB><BR>
--------------------------------<BR>
商品:<BR>

${products.map(p => `${p}`).join('<BR>')}
--------------------------------<BR>
总计: ${price} 元<BR>
订单号：${orderId}<BR>
下单时间: ${order_time}`;

  //签名
  const hash = crypto.createHash('sha1');
  hash.update(`${USER}${UKEY}${timestamp}`);
  const sign = hash.digest('hex');  // 获取十六进制的哈希值

  const postData = {
    user: USER,
    stime: timestamp,
    sig: sign,
    sn: SN,
    content: content,
    times: 1  // 打印联数
  };

  // 发送请求到飞鹅云打印机
  return new Promise((resolve, reject) => {
    request.post({
      url: 'http://api.feieyun.cn/Api/Open/',
      form: {
        apiname: 'Open_printMsg',
        ...postData
      }
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        console.log('打印成功', body);
        resolve(body);
      } else {
        console.error('打印失败', error);
        reject(error);
      }
    });
  });
}
