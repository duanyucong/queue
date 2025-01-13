// 云函数：保存店铺休息日信息
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 保存店铺休息日信息
exports.main = async (event, context) => {
  try {
    // 获取用户的openid
    const { OPENID } = cloud.getWXContext();
    
    const { weeklyRestDays, holidayRestDays } = event.data;

    // 处理每周固定休息日
    let weeklyRestData = null;
    if (weeklyRestDays === null) {
      // 如果显式传入null，则清空每周休息日
      weeklyRestData = null;
    } else if (weeklyRestDays && Array.isArray(weeklyRestDays)) {
      if (weeklyRestDays.length === 0) {
        return {
          code: 400,
          message: '每周休息日选择不能为空数组',
          data: null
        };
      }
      weeklyRestData = {
        mode: 'week',
        data: weeklyRestDays
      };
    }

    // 处理假期休息日
    let holidayRestData = null;
    if (holidayRestDays === null) {
      // 如果显式传入null，则清空假期休息日
      holidayRestData = null;
    } else if (holidayRestDays && holidayRestDays.startDate && holidayRestDays.endDate) {
      holidayRestData = {
        mode: 'holiday',
        data: {
          startDate: holidayRestDays.startDate,
          endDate: holidayRestDays.endDate
        }
      };
    }

    // 准备更新的数据
    const updateData = {
      weeklyRestDays: weeklyRestData,
      holidayRestDays: holidayRestData
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
