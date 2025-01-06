// index.js
Page({
  data: {},

  onLoad() {
    // 检查是否需要自动跳转
    this.checkAutoRedirect()
  },

  goToHome() {
    console.log('goToHome')
    wx.switchTab({
      url: '/pages/home/home'
    })
  },

  checkAutoRedirect() {
    // 检查是否首次启动，如果不是则直接跳转
    const isFirstLaunch = wx.getStorageSync('isFirstLaunch')
    console.log('isFirstLaunch', isFirstLaunch)
    if (!isFirstLaunch) {
      wx.setStorageSync('isFirstLaunch', true)
    } else {
      this.loginAndRedirect();
    }
  },

  async loginAndRedirect() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'user',
        data: {
          type: 'login'
        }
      });

      const redirectPage = res.result.redirect;
      console.log('redirectPage', redirectPage)
      if (redirectPage === 'shopManagement') {
        wx.navigateTo({
          url: '/pages/shopManagement/shopManagement'
        });
      } else if (redirectPage === 'home') {
        this.goToHome();
      } else {
        console.log('跳转到注册')
        // 如果未注册商家和用户，跳转到注册页面
        wx.navigateTo({
          url: '/pages/register/register' // 假设注册页面路径为 /pages/register/register
        });
      }
    } catch (error) {
      console.error('调用云函数失败', error);
    }
  },

  handleStart() {
    // 修改跳转方式，使用 switchTab 而不是 navigateTo
    this.checkAutoRedirect()
  }
})
