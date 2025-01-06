Page({
  data: {
    name: '',
    phone: '',
    gender: 'male',
    age: ''
  },

  radioChange(e) {
    this.setData({
      gender: e.detail.value
    });
  },

  submitForm() {
    const { name, phone, gender, age } = this.data;
    
    // 表单验证
    if (!name || !phone || !age) {
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

    // 年龄验证
    if (isNaN(age) || age < 0 || age > 120) {
      wx.showToast({
        title: '请输入正确的年龄',
        icon: 'none'
      });
      return;
    }

    // 提交数据到服务器
    wx.showLoading({
      title: '提交中...',
    });

    // 调用云函数注册用户
    wx.cloud.callFunction({
      name: 'user',
      data: {
        type: 'register',
        name,
        phone,
        gender,
        age: parseInt(age)
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
