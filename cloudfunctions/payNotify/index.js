const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  return {
    errcode: 0,
    errmsg: '付款成功'
  };
};