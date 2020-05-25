//index.js
const app = getApp();

Page({
  data: {
    hasUserInfo: false,
    todo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    selectedImage: null,
    currentPhotoFrames: null,
    userInfo: {},
    photoFrames: [
      '../images/zjut-1.png',
      '../images/zjut-2.png',
      '../images/zjut-3.png',
      '../images/zjut-4.png',
      '../images/zjut-5.png'
    ],
  },
  setTodo: function () {
    if (this.data.selectedImage) {
      this.setData({
        currentPhotoFrames: null,
        todo: !this.data.todo
      });
    } else {
      wx.showToast({
        title: '请先选择头像',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
        success: (result) => {

        },
        fail: () => {},
        complete: () => {}
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
      } else if (this.data.canIUse) {
        app.userInfoReadyCallback = res => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
        }
      } else {
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            });
          }
        });
      }
      this.setData({
        selectedImage: this.data.userInfo.avatarUrl
      });
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
      fail: () => {},
      complete: () => {}
    });
  },
  showPhotoFrames: function (e) {
    this.setData({
      currentPhotoFrames: e.currentTarget.dataset.src
    });
  },
  saveImage: function () {
    if (this.data.currentPhotoFrames) {
      if (this.data.selectedImage.startsWith('https://wx.qlogo.cn')) {
        const currentPhotoFrames = this.data.currentPhotoFrames;
        setTimeout(() => {
          wx.downloadFile({
            url: this.data.selectedImage,
            success: function (res) {
              let cvsCtx = wx.createCanvasContext('avatarCanvas');
              cvsCtx.save();
              cvsCtx.arc(90, 90, 70, 0, 2 * Math.PI);
              cvsCtx.clip();
              cvsCtx.drawImage(res.tempFilePath, 33, 30, 118, 118);
              cvsCtx.restore();
              cvsCtx.drawImage(currentPhotoFrames, 0, 0, 180, 180);
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
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                  });
                },
                fail: function (res) {
                  console.log(res);
                },
              });
            }
          });
        }, 100);
      } else {
        setTimeout(() => {
          let cvsCtx = wx.createCanvasContext('avatarCanvas');
          cvsCtx.save();
          cvsCtx.arc(90, 90, 70, 0, 2 * Math.PI);
          cvsCtx.clip();
          cvsCtx.drawImage(this.data.selectedImage, 33, 30, 118, 118);
          cvsCtx.restore();
          cvsCtx.drawImage(this.data.currentPhotoFrames, 0, 0, 180, 180);
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
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
              });
            },
            fail: function (res) {
              console.log(res);
            },
          });
        }, 100);
      }
    } else {
      wx.showToast({
        title: '请先选择相框',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
        success: (result) => {

        },
        fail: () => {},
        complete: () => {}
      });
    }

  },
  onLoad: function () {},
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  }
})