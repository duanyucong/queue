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

  // 查询商家表
  const shopRes = await db.collection('shops').where({
    userId: openid
  }).get();

  if (shopRes.data.length > 0) {
    // 如果在商家表中，返回商家管理页面的跳转信息
    return {
      redirect: 'shopManagement'
    };
  }

  // 查询用户表
  const userRes = await db.collection('users').where({
    userId: openid
  }).get();

  if (userRes.data.length > 0) {
    // 如果在用户表中，返回home页面的跳转信息
    return {
      redirect: 'home'
    };
  }

  // 如果都不在，返回默认信息
  return {
    redirect: 'default'
  };
};
