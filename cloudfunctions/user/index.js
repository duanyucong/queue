const login = require('./login/index');
const register = require('./register/index');
const registerShop = require('./registerShop/index');

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'login':
      return await login.main(event, context);
    case 'register':
      return await register.main(event, context);
    case 'registerShop':
      return await registerShop.main(event, context);
    default:
  }
};
        
