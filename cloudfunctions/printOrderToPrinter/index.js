// 飞鹅云打印 API 调用
const request = require('request');

// 打印订单信息到云打印机
async function printOrderToPrinter(orderId, products, totalFee) {
  const USER = '你的飞鹅云打印用户ID';
  const UKEY = '你的飞鹅云打印UKEY';
  const SN = '你的打印机编号';
  const timestamp = Math.floor(new Date().getTime() / 1000);
  const content = `
    订单编号: ${orderId}\n
    --------------------------------\n
    商品:\n
    ${products.map(p => `${p.productName} x ${p.quantity}`).join('\n')}\n
    --------------------------------\n
    总计: ${(totalFee / 100).toFixed(2)} 元\n
    时间: ${new Date().toLocaleString()}
  `;

  const sign = md5(`${USER}${UKEY}${SN}${timestamp}`);  // 签名

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
