// 云函数：保存店铺休息日信息
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数：保存店铺休息日信息
exports.main = async (event, context) => {
  try {
    // 获取用户的openid
    const { OPENID } = cloud.getWXContext();
    
    const { weeklyRestDays, holidayRestDays } = event.data;

    // // 处理每周固定休息日
    // let weeklyRestData = {
    //   mode: 'week',
    //   data: weeklyRestDays
    // };

    // // 处理假期休息日
    // let holidayRestData = {
    //   mode: 'holiday',
    //   data: {
    //     startDate: holidayRestDays.startDate,
    //     endDate: holidayRestDays.endDate
    //   }
    // };

    // 准备更新的数据
    const updateData = {
      weeklyRestDays,
      holidayRestDays
    };

    // 更新店铺信息中的休息日设置
    const result = await db.collection('shops')
      .where({
        _openid: OPENID
      })
      .update({
        data: updateData
      });

    // 检查更新结果
    if (result.stats.updated === 0) {
      return {
        code: 404,
        message: '未找到店铺信息，无法更新休息日',
        data: null
      };
    }

    return {
      code: 200,
      message: '休息日设置成功',
      data: updateData
    };
  } catch (error) {
    console.error('保存休息日失败：', error);
    return {
      code: 500,
      message: '保存休息日失败',
      data: null
    };
  }
};
