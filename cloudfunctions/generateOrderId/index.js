// 云函数 generateOrderId
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
    const orderCounter = db.collection('OrderCounter');

    // 定义要使用的自定义字段
    const customOrderField = 'documentid';
    const customOrderIdValue = 'orderIdCounter';  // 自定义 orderId 值

    try {
        // 使用自定义字段更新订单号
        await orderCounter.where({
            [customOrderField]: customOrderIdValue
        }).update({
            data: {
                orderIdCounter: _.inc(1)  // 自增1
            }
        });

        // 查询更新后的订单号
        const counterRes = await orderCounter.where({
            [customOrderField]: customOrderIdValue
        }).get();

        const newOrderId = counterRes.data[0].orderIdCounter;

        // 返回成功结果和新生成的订单号
        return {
            success: true,
            orderId: newOrderId,
            openid: cloud.getWXContext().OPENID  // 返回用户的 openid
        };

    } catch (err) {
        console.error('订单号生成失败', err);

        // 返回错误信息
        return {
            success: false,
            errorMessage: err.message,
            openid: cloud.getWXContext().OPENID  // 返回 openid
        };
    }
};
