// 云函数获取店铺信息逻辑
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 获取店铺信息
async function getShopInfo(event, context) {
  try {
    // 获取用户的openid
    const { OPENID } = cloud.getWXContext();
    
    // 根据openid查询店铺信息
    const shopInfo = await db.collection('shops')
      .where({
        _openid: OPENID
      })
      .get();

    // 如果没有找到店铺信息
    if (!shopInfo.data || shopInfo.data.length === 0) {
      return {
        code: 404,
        message: '未找到店铺信息',
        data: null
      };
    }

    return {
      code: 200,
      message: '获取店铺信息成功',
      data: shopInfo.data[0]
    };
  } catch (error) {
    console.error('获取店铺信息失败：', error);
    return {
      code: 500,
      message: '获取店铺信息失败',
      data: null
    };
  }
}

// 保存店铺休息日信息
async function saveRestDays(event) {
  try {
    // 获取用户的openid
    const { OPENID } = cloud.getWXContext();
    
    const { restDays, restMode } = event.data;

    // 更新店铺信息中的休息日设置
    const result = await db.collection('shops')
      .where({
        _openid: OPENID
      })
      .update({
        data: {
          restDays,
          restMode
        }
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
      data: { restDays, restMode }
    };
  } catch (error) {
    console.error('保存休息日失败：', error);
    return {
      code: 500,
      message: '保存休息日失败',
      data: null
    };
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    switch (event.type) {
      case 'getShopInfo':
        return await getShopInfo(event, context);
      case 'saveRestDays':
        return await saveRestDays(event);
      default:
        return {
          code: 400,
          message: '未知的操作类型',
          data: null
        };
    }
  } catch (error) {
    console.error('云函数执行失败：', error);
    return {
      code: 500,
      message: '云函数执行失败',
      data: null
    };
  }
};
