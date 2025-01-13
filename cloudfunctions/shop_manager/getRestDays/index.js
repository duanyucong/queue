const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

// 获取店铺休息日信息
exports.main = async (event, context) => {
  try {
    // 获取用户的openid
    const { OPENID } = cloud.getWXContext();
    
    // 查询店铺信息
    const shopResult = await db.collection('shops')
      .where({
        _openid: OPENID
      })
      .get();

    // 检查查询结果
    if (shopResult.data.length === 0) {
      return {
        code: 404,
        message: '未找到店铺信息',
        data: null
      };
    }

    const shopInfo = shopResult.data[0];
    
    // 准备返回的数据
    const restDaysData = {
      weeklyRestDays: shopInfo.weeklyRestDays,
      holidayRestDays: shopInfo.holidayRestDays
    };

    return {
      code: 200,
      message: '获取休息日信息成功',
      data: restDaysData
    };
  } catch (error) {
    console.error('获取休息日失败：', error);
    return {
      code: 500,
      message: '获取休息日失败',
      data: null
    };
  }
};