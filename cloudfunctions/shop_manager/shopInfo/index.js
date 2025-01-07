// 云函数获取店铺信息逻辑
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 获取店铺信息
exports.main = async (event, context) => {
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
