// 飞鹅云打印 API 调用
const request = require('request');
const crypto = require('crypto');

// 打印订单信息到云打印机
exports.main = async (event, context) => {
  const { orderId, products, totalFee } = event;  // 获取支付金额和商品信息
  const USER = '1559641703@qq.com';
  const UKEY = 'EtSSqyVqxyzRPyzV';
  const SN = '922382185';
  const timestamp = new Date().getTime();
  const content = `
    订单编号: ${orderId}\n
    --------------------------------\n
    商品:\n
    ${products.map(p => `${p.name} x ${p.quantity}`).join('\n')}\n
    --------------------------------\n
    总计: ${(totalFee / 100).toFixed(2)} 元\n
    时间: ${new Date().toLocaleString()}
  `;

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
