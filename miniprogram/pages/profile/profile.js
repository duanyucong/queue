Page({
  data: {
    userInfo: {}
  },

  onLoad() {
    // 移除自动获取用户信息的调用
  },

  getUserInfo() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo
        });
        // 可以将用户信息保存到本地存储
        wx.setStorageSync('userInfo', res.userInfo);
      },
      fail: (err) => {
        console.log('获取用户信息失败', err);
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        });
      }
    });
  },

  handleMyOrders() {
    wx.navigateTo({
      url: '/pages/orders/orders'
    });
  },

  handleMyAddress() {
    wx.navigateTo({
      url: '/pages/address/address'
    });
  },

  handleSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  }
}); 