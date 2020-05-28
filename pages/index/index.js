//index.js
const app = getApp();

Page({
  data: {
    hasUserInfo: false,
    todo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    selectedImage: null,
    currentNewPhotoFrames: null,
    canvasTempFilePath: null,
    userInfo: {},
    newPhotoFrames: [{
        url: '../images/zjut-round-1.png',
        type: 1
      },
      {
        url: '../images/zjut-round-2.png',
        type: 1
      },
      {
        url: '../images/zjut-round-3.png',
        type: 1
      },
      {
        url: '../images/zjut-round-4.png',
        type: 1
      },
      {
        url: '../images/zjut-round-5.png',
        type: 1
      },
      {
        url: '../images/zjut-round-6.png',
        type: 2
      },
      {
        url: '../images/zjut-round-7.png',
        type: 2
      },
      {
        url: '../images/zjut-rect-3.png',
        type: 2
      },
      {
        url: '../images/zjut-rect-5.png',
        type: 3
      },
      {
        url: '../images/zjut-rect-6.png',
        type: 3
      },
      {
        url: '../images/zjut-rect-7.png',
        type: 3
      },
      {
        url: '../images/zjut-rect-8.png',
        type: 3
      },
      {
        url: '../images/zjut-rect-9.png',
        type: 3
      },
      {
        url: '../images/zjut-1.png',
        type: 4
      },
      {
        url: '../images/zjut-2.png',
        type: 4
      },
      {
        url: '../images/zjut-heart-2.png',
        type: 5
      },
      {
        url: '../images/zjut-heart-3.png',
        type: 5
      },
      {
        url: '../images/zjut-rect-2.png',
        type: 5
      },
      {
        url: '../images/zjut-rect-4.png',
        type: 5
      }
    ]
  },
  setTodo: function () {
    if (this.data.selectedImage) {
      this.setData({
        cuurenNewPhotoFrames: null,
        canvasTempFilePath: null,
        todo: !this.data.todo
      });
    } else {
      wx.showToast({
        title: '请先选择头像',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
    }
  },
  getWechatAvatar: function () {
    if (this.data.hasUserInfo) {
      this.setData({
        selectedImage: this.data.userInfo.avatarUrl
      });
    } else {
      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        });
      } else {
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            });
            this.setData({
              selectedImage: this.data.userInfo.avatarUrl
            });
          }
        });
      }
    }
  },
  getLocalPhoto: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: (result) => {
        this.setData({
          selectedImage: result.tempFilePaths[0]
        });
      },
    });
  },
  showPhotoFrames: function (e) {
    const type = e.currentTarget.dataset.type;
    const src = e.currentTarget.dataset.src;
    this.setData({
      currentNewPhotoFrames: src
    });
    if (type === 1) {
      this.drawCanvas(26, 26, 130, 130);
    } else if (type === 2) {
      this.drawCanvas(12, 12, 160, 160);
    } else if (type === 3) {
      this.drawCanvas(0, 0, 180, 180);
    } else if (type === 4) {
      this.drawCanvas(8, 6, 164, 168);
    } else if (type === 5) {
      this.drawCanvas(16, 10, 150, 150);
    }
  },
  drawCanvas: function (ix, iy, iw, ih) {
    let that = this;
    const currentNewPhotoFrames = this.data.currentNewPhotoFrames;
    const selectedImage = this.data.selectedImage
    if (this.data.selectedImage.startsWith('https://wx.qlogo.cn')) {
      setTimeout(() => {
        wx.downloadFile({
          url: this.data.selectedImage,
          success: function (res) {
            let cvsCtx = wx.createCanvasContext('avatarCanvas');
            cvsCtx.save();
            cvsCtx.rect(0, 0, 180, 180, );
            cvsCtx.clip();
            cvsCtx.drawImage(res.tempFilePath, ix, iy, iw, ih);
            cvsCtx.restore();
            cvsCtx.drawImage(currentNewPhotoFrames, 0, 0, 180, 180);
            cvsCtx.draw();
            wx.canvasToTempFilePath({
              width: 180,
              heght: 180,
              destWidth: 720,
              destHeight: 720,
              canvasId: 'avatarCanvas',
              fileType: 'jpg',
              quality: 1,
              success: (res) => {
                that.setData({
                  canvasTempFilePath: res.tempFilePath
                });
              },
              fail: function (res) {
                console.log(res);
              }
            });
          }
        });
      }, 100);
    } else {
      setTimeout(() => {
        let cvsCtx = wx.createCanvasContext('avatarCanvas');
        cvsCtx.save();
        cvsCtx.rect(0, 0, 180, 180);
        cvsCtx.clip();
        cvsCtx.drawImage(selectedImage, ix, iy, iw, ih);
        cvsCtx.restore();
        cvsCtx.drawImage(currentNewPhotoFrames, 0, 0, 180, 180);
        cvsCtx.draw();
        wx.canvasToTempFilePath({
          width: 180,
          heght: 180,
          destWidth: 720,
          destHeight: 720,
          canvasId: 'avatarCanvas',
          fileType: 'jpg',
          quality: 1,
          success: (res) => {
            that.setData({
              canvasTempFilePath: res.tempFilePath
            });
          },
          fail: function (res) {
            console.log(res);
          }
        });
      }, 100);
    }
  },
  saveNewImage: function () {
    if (this.data.canvasTempFilePath) {
      wx.saveImageToPhotosAlbum({
        filePath: this.data.canvasTempFilePath,
      });
      wx.showToast({
        title: '保存头像成功！',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
    } else if (!this.data.currentNewPhotoFrames) {
      wx.showToast({
        title: '请先选择相框再保存哦！',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
    } else {
      wx.showToast({
        title: '系统繁忙，请稍后操作！',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
    }
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  }
})