// 飞鹅云打印 API 调用
const cloud = require('wx-server-sdk');
const crypto = require('crypto');
const request = require('request');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

function getByteLength(str) {
  let byteLength = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    // 判断字符是否为中文字符（范围在 0x4E00-0x9FA5）
    if (charCode >= 0x4E00 && charCode <= 0x9FA5) {
      byteLength += 2; // 中文字符占用 2 个字节
    } else {
      byteLength += 1; // 英文字符占用 1 个字节
    }
  }
  return byteLength;
}

function formatItem(name, quantity, price) {
  
  const paddedName = name + ' '.repeat(22 - getByteLength(name));  // 填充空格  名字占用20个字符
  var end = 32 - price.length
  if (end > 28) end = 28 //保证价格最少占用4个空格
  const paddedNumber = quantity + ' '.repeat(end-22-quantity.length)
  const paddedprice  = price + ' '.repeat(32-end-price.length)
  return `${paddedName}${paddedNumber}${paddedprice}<BR>`;
}

// 打印订单信息到云打印机
 exports.main = async (event, context) => {
   const {
     orderId,
     orderNumber,
     orderPrice,
     orderTime,
     goods
    } = event
   console.log(orderId)
   console.log(goods)
  //--------------------获取数据----------------------------------

  const price = (orderPrice/100).toFixed(2)
  const USER = '1559641703@qq.com';
  const UKEY = 'EtSSqyVqxyzRPyzV';
  const SN = '922382185';
  const timestamp = new Date().getTime();
  var content = `<CB>取单号: ${orderNumber}</CB><BR>`;
  content += '--------------------------------<BR>';
  content += '商品:<BR>';
  content += '--------------------------------<BR>';
  content += '名称                数量    单价<BR>';
  content += '--------------------------------<BR>';
  for(var i=0; i<goods.length; ++i) {
    var good = goods[i]
    var name = good.name
    if (good.selectstr) name += "("+good.selectstr+")"
    content+= formatItem(name, good.buyCount.toString(), good.price.toString())
  }
  content += '--------------------------------<BR>';
  content += `总计: ￥${price} 元<BR>`;
  content += `订单号：${orderId}<BR>`;
  content += `下单时间: ${orderTime}`;
  console.log(content)

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
