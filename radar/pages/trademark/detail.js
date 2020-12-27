// pages/trademark/detail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: "",
        api: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id: options.id,
            api: options.api
        });
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
        const app = getApp();
        const endPointId = /shebiaowang/.test(this.data.api) ? "trademark.SBWDetail" : "trademark.trademarkDetail";
        wx.showLoading({title: "加载数据"});
        app.ajax(endPointId, {
            id: this.data.id
        }).then((resp) => {
            if(app.ajaxHandler(resp)) {
                this.setData({
                    data: resp.data
                });
            }
        }).catch((err) => {
            app.ajaxHandler(err);
        });
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

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

    }
})