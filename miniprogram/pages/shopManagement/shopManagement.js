Page({
  data: {
    statusBarHeight: 0,
    shopInfo: {
      shopName: '',
      status: 1,
      queueCount: 0,
      avgWaitTime: 0,
      restDays: []
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
      wx.showLoading({
        title: '加载中...',
      });

      const { result } = await wx.cloud.callFunction({
        name: 'shop_manager',
        data: {
          type: 'getShopInfo'
        }
      });

      if (result.code === 200 && result.data) {
        this.setData({
          shopInfo: {
            shopName: result.data.shopName || '',
            status: result.data.status || 1,
            queueCount: result.data.queueCount || 0,
            avgWaitTime: result.data.avgWaitTime || 0
          }
        });
      } else {
        wx.showToast({
          title: result.message || '获取店铺信息失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('获取店铺信息失败：', error);
      wx.showToast({
        title: '获取店铺信息失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
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
    const newStatus = this.data.shopInfo.status === 1 ? 0 : 1;

    if (newStatus === 0) {
      // 如果要暂停营业，询问是否设置休息日
      wx.showActionSheet({
        itemList: ['设置休息日', '直接暂停营业'],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.setRestDays();
          } else {
            this.updateShopStatus(newStatus);
          }
        }
      });
    } else {
      this.updateShopStatus(newStatus);
    }
  },

  // 更新店铺状态
  async updateShopStatus(newStatus) {
    try {
      const db = wx.cloud.database();
      
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

  // 设置休息日
  setRestDays() {
    wx.navigateTo({
      url: '../restDaysSelection/restDaysSelection' // 跳转到休息日选择页面
    });
  },

  // 自定义休息日期
  customRestDays() {
    wx.showModal({
      title: '自定义休息日期',
      content: '请输入休息日期范围（例如：2023-10-01到2023-10-05）',
      editable: true,
      success: (res) => {
        if (res.confirm) {
          const customRange = res.content;
          this.data.shopInfo.restDays.push(customRange);
          this.setData({
            'shopInfo.restDays': this.data.shopInfo.restDays
          });
          wx.showToast({
            title: `已设置休息日期：${customRange}`,
            icon: 'success'
          });
        }
      }
    });
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
