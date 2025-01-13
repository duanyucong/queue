Page({
  data: {
    days: [
      { name: '周一', value: 'MON' },
      { name: '周二', value: 'TUE' },
      { name: '周三', value: 'WED' },
      { name: '周四', value: 'THU' },
      { name: '周五', value: 'FRI' },
      { name: '周六', value: 'SAT' },
      { name: '周日', value: 'SUN' }
    ],
    selectedDays: [],
    minDate: new Date().getTime(),
    maxDate: new Date().setFullYear(new Date().getFullYear() + 1),
    dateRange: [],
    statusBarHeight: 0,
    calendarHeight: 618,
    weekSelectionEnabled: true,
    dateSelectionEnabled: true
  },

  onLoad(options) {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    const screenHeight = systemInfo.screenHeight;
    const statusBarHeight = systemInfo.statusBarHeight;

    // 创建 SelectorQuery 查询
    const query = wx.createSelectorQuery();
    
    // 查询导航栏、模式选择器和底部按钮的高度
    query.select('.nav-bar').boundingClientRect();
    query.select('.rest-box').boundingClientRect();
    query.select('.footer').boundingClientRect();

    // 执行查询
    query.exec((res) => {
      const navBarHeight = res[0].height;
      const restBoxHeight = res[1].height;
      const footerHeight = res[2].height;

      // 计算日历高度，预留底部空间
      const calendarHeight = screenHeight - 
        (statusBarHeight + navBarHeight + restBoxHeight + footerHeight + 90);

      this.setData({
        statusBarHeight: statusBarHeight,
        calendarHeight: calendarHeight
      });
    });

    
    // 获取店铺信息
    wx.cloud.callFunction({
      name: 'shop_manager',
      data: {
        type: 'getRestDays'
      },
      success: (res) => {
        if (res.result.code === 200) {
          const shopInfo = res.result.data;
          
          // 回显每周休息日
          if (shopInfo.weeklyRestDays) {
            this.setData({
              selectedDays: shopInfo.weeklyRestDays
            });
          }

          // 回显假期休息日
          if (shopInfo.holidayRestDays) {
            const startDate = new Date(shopInfo.holidayRestDays.startDate).getTime();
            const endDate = new Date(shopInfo.holidayRestDays.endDate).getTime();
            
            this.setData({
              dateRange: [startDate, endDate]
            });
          }

          console.log('获取店铺信息成功', shopInfo);
        } else {
          console.error('获取店铺信息失败：', res.result);
        }
      },
      fail: (err) => {
        console.error('调用云函数失败', err);
      }
    });
    
  },

  // 返回上一页
  navigateBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack({
        delta: 1
      });
    } else {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },

  // 处理星期选择
  toggleDaySelection(e) {
    const selectedValue = e.currentTarget.dataset.value;
    const selectedDays = this.data.selectedDays;
    const index = selectedDays.indexOf(selectedValue);

    if (index === -1) {
      selectedDays.push(selectedValue);
    } else {
      selectedDays.splice(index, 1);
    }

    this.setData({
      selectedDays: selectedDays
    });
  },

  // 处理日期选择
  onDateSelect(e) {
    this.dateRange = e.detail;
  },

  // 确认选择
  confirmSelection() {
    wx.cloud.callFunction({
      name: 'shop_manager',
      data: {
        type: 'saveRestDays',
        data: {
          weeklyRestDays: this.data.selectedDays.length > 0 ? this.data.selectedDays : null,
          holidayRestDays: this.dateRange ? {
            startDate: this.formatTimestamp(this.dateRange[0]),
            endDate: this.formatTimestamp(this.dateRange[1])
          } : null
        }
      }
    }).then(res => {
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];

      const restDays = {
        weekDays: this.data.selectedDays,
        dateRange: this.dateRange
      };

      if (prevPage) {
        prevPage.setData({
          restDays: restDays
        }, () => {
          wx.showToast({
            title: '保存成功',
            icon: 'success'
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            });
          }, 1500);
        });
      } else {
        console.error('无法获取上一页');
        wx.navigateBack({
          delta: 1
        });
      }
    }).catch(err => {
      console.error('保存休息日信息失败', err);
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    });
  },

  // 格式化时间戳为日期字符串
  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
});