const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 商家注册云函数入口函数
exports.main = async (event, context) => {
  // 获取基础信息
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { shopName, phone, address, openTime, closeTime, description } = event;

  // 初始化数据库
  const db = cloud.database();

  try {
    // 检查是否已经注册
    const existingShop = await db.collection('shops').where({
      userId: openid
    }).get();

    if (existingShop.data.length > 0) {
      return {
        success: false,
        message: '该用户已注册为商家'
      };
    }

    // 创建新商家记录
    const result = await db.collection('shops').add({
      data: {
        userId: openid,
        shopName,
        phone,
        address,
        openTime,
        closeTime,
        description,
        status: 'active',
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      }
    });

    // 更新用户角色
    const userResult = await db.collection('users').where({
      userId: openid
    }).update({
      data: {
        role: 'shop',
        shopId: result._id,
        updateTime: db.serverDate()
      }
    });

    return {
      success: true,
      shopId: result._id,
      redirect: 'shopManagement'
    };

  } catch (err) {
    console.error('[注册商家失败]', err);
    return {
      success: false,
      message: '注册失败，请重试'
    };
  }
};
