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
    selectionMode: 'week',
    minDate: new Date().getTime(),
    maxDate: new Date().setFullYear(new Date().getFullYear() + 1),
    dateRange: [],
    statusBarHeight: 0,
    showHelp: false,
    calendarHeight: 618
  },

  onLoad(options) {
    // 获取状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    const screenHeight = systemInfo.screenHeight;
    const statusBarHeight = systemInfo.statusBarHeight;
    const navBarHeight = 44;
    const modeSelectHeight = 80; // mode-selector 高度
    const footerHeight = 80; // 底部按钮高度

    // 计算日历高度
    const calendarHeight = screenHeight - 
      (statusBarHeight + navBarHeight + modeSelectHeight + footerHeight) - 34;

    this.setData({
      statusBarHeight: statusBarHeight,
      calendarHeight: Math.floor(calendarHeight)
    });
    
    // 如果有传入的数据，进行初始化
    if (options.restDays) {
      const restDays = JSON.parse(options.restDays);
      this.setData({
        selectionMode: restDays.mode,
        selectedDays: restDays.mode === 'week' ? restDays.data : [],
        dateRange: restDays.mode === 'date' ? [
          new Date(restDays.data.startDate).getTime(),
          new Date(restDays.data.endDate).getTime()
        ] : []
      });
    }
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

  // 切换选择模式
  switchMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({
      selectionMode: mode
    });
  },

  // 处理星期选择
  toggleDaySelection(e) {
    const value = e.currentTarget.dataset.value;
    const selectedDays = this.data.selectedDays;
    const index = selectedDays.indexOf(value);

    if (index === -1) {
      selectedDays.push(value);
    } else {
      selectedDays.splice(index, 1);
    }

    this.setData({
      selectedDays
    });
  },

  // 处理日期选择
  onDateSelect(e) {
    const { detail } = e;
    this.setData({
      dateRange: [
        new Date(detail[0]).getTime(), 
        new Date(detail[1]).getTime()
      ]
    });
  },

  // 确认选择
  confirmSelection() {
    const { selectionMode, selectedDays, dateRange } = this.data;
    
    const restDays = {
      mode: selectionMode,
      data: selectionMode === 'week' 
        ? selectedDays 
        : {
            startDate: this.formatTimestamp(dateRange[0]),
            endDate: this.formatTimestamp(dateRange[1])
          }
    };

    // 返回上一页并传递数据
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    prevPage.setData({
      restDays: restDays
    });

    wx.navigateBack({
      delta: 1
    });
  },

  // 格式化时间戳为日期字符串
  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  },

  // 显示帮助模态框
  showHelpModal() {
    this.setData({
      showHelp: true
    });
  },

  // 隐藏帮助模态框
  hideHelpModal() {
    this.setData({
      showHelp: false
    });
  },

  // 防止模态框内容冒泡
  preventTap() {
    // 空方法，用于阻止事件冒泡
  }
});