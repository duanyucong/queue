Page({
  data: {
    statusBarHeight: 0,
    shopName: '',
    phone: '',
    address: '',
    openTime: '09:00',
    closeTime: '21:00',
    description: ''
  },

  onLoad() {
    // 获取状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    });
  },

  bindOpenTimeChange(e) {
    this.setData({
      openTime: e.detail.value
    });
  },

  bindCloseTimeChange(e) {
    this.setData({
      closeTime: e.detail.value
    });
  },

  submitForm() {
    const { shopName, phone, address, openTime, closeTime, description } = this.data;
    
    // 表单验证
    if (!shopName || !phone || !address) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    // 手机号验证
    if (!/^1\d{10}$/.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }

    // 提交数据到服务器
    wx.showLoading({
      title: '提交中...',
    });

    // 调用云函数注册商家
    wx.cloud.callFunction({
      name: 'user',
      data: {
        type: 'registerShop',
        shopName,
        phone,
        address,
        openTime,
        closeTime,
        description
      },
      success: res => {
        wx.hideLoading();
        if (res.result && res.result.success) {
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 2000,
            success: () => {
              // 根据返回的redirect进行页面跳转
              setTimeout(() => {
                wx.redirectTo({
                  url: `/pages/${res.result.redirect}/${res.result.redirect}`
                });
              }, 2000);
            }
          });
        } else {
          wx.showToast({
            title: res.result.message || '注册失败，请重试',
            icon: 'none'
          });
        }
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({
          title: '注册失败，请重试',
          icon: 'none'
        });
        console.error('[注册失败]', err);
      }
    });
  }
});
