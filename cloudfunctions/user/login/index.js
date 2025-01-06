const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 获取openId云函数入口函数
exports.main = async (event, context) => {
  // 获取基础信息
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  // 初始化数据库
  const db = cloud.database();

  try {
    // 查询商家表
    const shopRes = await db.collection('shops').where({
      _openid: openid
    }).get();

    if (shopRes.data.length > 0) {
      // 更新最后登录时间
      await db.collection('users').where({
        _openid: openid
      }).update({
        data: {
          lastLoginTime: db.serverDate()
        }
      });

      // 如果在商家表中，返回商家信息和跳转信息
      return {
        success: true,
        data: shopRes.data[0],
        userType: 1,
        redirect: 'shopManagement'
      };
    }

    // 查询用户表
    const userRes = await db.collection('users').where({
      _openid: openid
    }).get();

    if (userRes.data.length > 0) {
      // 更新最后登录时间
      await db.collection('users').where({
        _openid: openid
      }).update({
        data: {
          lastLoginTime: db.serverDate()
        }
      });

      // 如果在用户表中，返回用户信息和跳转信息
      return {
        success: true,
        data: userRes.data[0],
        userType: 0,
        redirect: 'home'
      };
    }

    // 如果都不在，返回注册页面
    return {
      success: true,
      redirect: 'register'
    };

  } catch (err) {
    return {
      success: false,
      message: err.message
    };
  }
};
