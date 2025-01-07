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
    statusBarHeight: 0
  },

  onLoad(options) {
    // 获取状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
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
    this.calendar = this.selectComponent("#calendar");
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
  switchMode() {
    const newMode = this.data.selectionMode === 'week' ? 'date' : 'week';
    this.setData({
      selectionMode: newMode
    });
  },

  // 处理星期选择
  toggleDaySelection(e) {
    const { value } = e.currentTarget.dataset;
    const selectedDays = [...this.data.selectedDays];
    const index = selectedDays.indexOf(value);

    if (index > -1) {
      selectedDays.splice(index, 1);
    } else {
      selectedDays.push(value);
    }

    this.setData({ selectedDays });
  },

  // 处理开始日期变化
  onStartDateChange(e) {
    this.setData({
      dateRange: [new Date(e.detail.value).getTime(), this.data.dateRange[1] || new Date(e.detail.value).getTime()]
    });
  },

  // 处理结束日期变化
  onEndDateChange(e) {
    this.setData({
      dateRange: [this.data.dateRange[0] || new Date(e.detail.value).getTime(), new Date(e.detail.value).getTime()]
    });
  },

  // 格式化时间戳为日期字符串
  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  },

  confirmSelection() {
    const { selectionMode, selectedDays, dateRange } = this.data;
    const restDaysData = {
      mode: selectionMode,
      data: selectionMode === 'week' ? selectedDays : {
        startDate: this.formatTimestamp(dateRange[0]),
        endDate: this.formatTimestamp(dateRange[1])
      }
    };

    wx.navigateBack({
      delta: 1,
      success: function (res) {
        const pages = getCurrentPages();
        const prevPage = pages[pages.length - 2];
        prevPage.setData({
          'shopInfo.restDays': restDaysData
        });
      }
    });
  },

  onDateSelect(e) {
    const { start, end } = e.detail;
    this.setData({
      dateRange: [new Date(start).getTime(), new Date(end).getTime()]
    });
  }
});