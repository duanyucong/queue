Page({
  data: {},

  onLoad() {
    // 页面加载时的逻辑
  },

  registerAsShop() {
    // 跳转到商家注册页面
    wx.navigateTo({
      url: '/pages/shopRegister/shopRegister' // 假设商家注册页面路径为 /pages/shopRegister/shopRegister
    });
  },

  registerAsUser() {
    // 跳转到用户注册页面
    wx.navigateTo({
      url: '/pages/userRegister/userRegister' // 假设用户注册页面路径为 /pages/userRegister/userRegister
    });
  }
}); 