// pages/login/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        verifyCode: "",
        mobile: "",
        sendEnabled: false,
        sendButtonText: "获取验证码",
        sendHandler: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        wx.setNavigationBarColor({
          backgroundColor: '#ffffff',
          frontColor: '#000000',
        });
        wx.removeStorageSync("toLogin");
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        wx.setNavigationBarColor({
            backgroundColor: '#ffffff',
            frontColor: '#e9e9e9',
        });
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    onSendSMS: function() {
        const app = getApp();
        wx.showLoading({
          title: '获取验证码',
        });
        app.ajax("trademark.sendSMS", {
            mobile: this.data.mobile
        }).then((resp) => {
            if(app.ajaxHandler(resp)) {
                this.sendButtonProcess();
            }
        }).catch((err) => {
            app.ajaxHandler(err, true);
        });
    },
    onVerifyCodeInput: function(evt) {
        this.setData({
            verifyCode: evt.detail.value
        });
    },
    onMobileInput: function(evt) {
        this.setData({
            mobile: evt.detail.value
        });
    },
    sendButtonProcess() {
        if(!this.data.sendEnabled) {
            let time = 60;
            this.sendHandler = setInterval(() => {
                if(time - 1 > 0) {
                    time -= 1;
                    this.setData({
                        sendButtonText: `已获取(${time}s)`,
                        sendEnabled: true
                    });
                } else {
                    this.setData({
                        sendButtonText: "获取验证码",
                        sendEnabled: false
                    });
                    clearInterval(this.sendHandler);
                }
            },1000);
            this.setData({
                sendButtonText: `已获取(60s)`,
                sendEnabled: true
            });
        }
    },
    onLogin() {
        const app = getApp();
        wx.showLoading({
          title: '登录',
        });
        app.ajax("trademark.login", {
            mobile: this.data.mobile,
            verifyCode: this.data.verifyCode
        }).then((resp) => {
            if(app.ajaxHandler(resp)) {
                wx.setStorageSync('trademarkType', resp.data.trademarkTypes);
                wx.setStorageSync('mobile', this.data.mobile);
                app.loadCompany(() => {
                    wx.switchTab({
                        url: '/pages/index/index',
                    });
                });
            }
        }).catch((err) => {
            app.ajaxHandler(err, true);
        });
    }
})