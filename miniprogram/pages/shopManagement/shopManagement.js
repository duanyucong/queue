Page({
  data: {
    statusBarHeight: 0,
    shopInfo: {
      shopName: '',
      status: 1,
      queueCount: 0,
      avgWaitTime: 0
    },
    todayStats: {
      totalCustomers: 0,
      avgWaitTime: 0,
      maxQueueLength: 0
    }
  },

  onLoad() {
    // 获取状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    });

    // 获取店铺信息
    this.getShopInfo();
    // 获取今日统计数据
    this.getTodayStats();
  },

  // 获取店铺信息
  async getShopInfo() {
    try {
      const db = wx.cloud.database();
      const userInfo = wx.getStorageSync('userInfo');
      
      console.log('userInfo', userInfo._openid)
      const res = await db.collection('shops').where({
        _openid: userInfo._openid
      }).get();

      if (res.data.length > 0) {
        this.setData({
          shopInfo: res.data[0]
        });
      }
    } catch (err) {
      console.error('获取店铺信息失败', err);
      wx.showToast({
        title: '获取店铺信息失败',
        icon: 'none'
      });
    }
  },

  // 获取今日统计数据
  async getTodayStats() {
    try {
      // TODO: 从数据库获取今日统计数据
      const todayStats = {
        totalCustomers: 25,
        avgWaitTime: 15,
        maxQueueLength: 8
      };
      
      this.setData({
        todayStats
      });
    } catch (err) {
      console.error('获取统计数据失败', err);
    }
  },

  // 切换店铺营业状态
  async toggleShopStatus() {
    try {
      const db = wx.cloud.database();
      const newStatus = this.data.shopInfo.status === 1 ? 0 : 1;
      
      await db.collection('shops').doc(this.data.shopInfo._id).update({
        data: {
          status: newStatus
        }
      });

      this.setData({
        'shopInfo.status': newStatus
      });

      wx.showToast({
        title: newStatus === 1 ? '已开始营业' : '已暂停营业',
        icon: 'success'
      });
    } catch (err) {
      console.error('切换营业状态失败', err);
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      });
    }
  },

  // 跳转到队列管理页面
  manageQueue() {
    wx.navigateTo({
      url: '../queueManagement/queueManagement'
    });
  },

  // 跳转到店铺信息编辑页面
  editShopInfo() {
    wx.navigateTo({
      url: '../shopEdit/shopEdit'
    });
  }
});
