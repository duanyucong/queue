// 店铺管理云函数入口文件
const shopInfo = require('./shopInfo/index');
const restDays = require('./restDays/index');

// 云函数入口函数
exports.main = async (event, context) => {

  // 根据type调用不同的处理函数
  switch (event.type) {
    case 'getShopInfo':
      return await shopInfo.main(event, context);
    case 'saveRestDays':
      return await restDays.main(event, context);
    default:
      return {
        code: 400,
        message: '未知的操作类型',
        data: null
      };
  }
};
