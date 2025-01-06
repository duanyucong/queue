Page({
  data: {
    queueCount: 0,
    waitingTime: 0,
    images: []
  },

  onLoad(options) {
    wx.cloud.callFunction({
      name: 'user',
      data: {
        type: 'login'
      }
    }).then((resp) => {
      console.log(resp)
    }).catch((e) => {
      console.log(e)
    })
  },

  startQueue() {
    wx.showLoading({
      title: '正在排队中...',
    })
  }
}) 