const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 用户注册云函数入口函数
exports.main = async (event, context) => {
  // 获取基础信息
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { name, phone, gender, age } = event;

  // 初始化数据库
  const db = cloud.database();

  try {
    // 检查是否已经注册
    const existingUser = await db.collection('users').where({
      _openid: openid
    }).get();

    if (existingUser.data.length > 0) {
      return {
        success: false,
        message: '该用户已注册'
      };
    }

    // 创建新用户记录
    const result = await db.collection('users').add({
      data: {
        _openid: openid,
        nickName: name,
        phone,
        gender,
        age: parseInt(age),
        userType: 0,
        status: 1,
        createTime: db.serverDate(),
        updateTime: db.serverDate(),
        lastLoginTime: db.serverDate()
      }
    });

    return {
      success: true,
      userId: result._id,
      redirect: 'home'
    };

  } catch (err) {
    console.error('[注册用户失败]', err);
    return {
      success: false,
      message: '注册失败，请重试'
    };
  }
};
