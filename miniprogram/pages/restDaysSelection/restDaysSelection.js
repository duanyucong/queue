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
        (statusBarHeight + navBarHeight + restBoxHeight + footerHeight + 70);

      this.setData({
        statusBarHeight: statusBarHeight,
        calendarHeight: calendarHeight
      });
    });

    // 处理从上一页传递的休息日数据
    if (options.restDays) {
      const restDays = JSON.parse(options.restDays);
      this.setData({
        selectedDays: restDays.weekDays || [],
        dateRange: restDays.dateRange || []
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
    this.setData({
      dateRange: e.detail
    });
  },

  // 确认选择
  confirmSelection() {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];

    const restDays = {
      weekDays: this.data.selectedDays,
      dateRange: this.data.dateRange
    };

    console.log('确认选择:', {
      pages: pages.length,
      prevPage: prevPage,
      restDays: restDays
    });

    if (prevPage) {
      prevPage.setData({
        restDays: restDays
      }, () => {
        wx.navigateBack({
          delta: 1
        });
      });
    } else {
      console.error('无法获取上一页');
      wx.navigateBack({
        delta: 1
      });
    }
  },

  // 格式化时间戳为日期字符串
  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
});