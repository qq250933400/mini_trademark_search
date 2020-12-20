// pages/trademark/detail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: "",
        regno: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id: options.id,
            regno: options.regno
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
        wx.showLoading({title: "加载数据"});
        app.ajax("trademark.watchDetail", {
            id: this.data.id,
            regno: this.data.regno
        }).then((resp) => {
            if(app.ajaxHandler(resp, false, () => {
                wx.switchTab({
                    url: '/pages/watch/watch',
                });
            })) {
                this.setData({
                    data: resp.data
                });
            }
        }).catch((err) => {
            app.ajaxHandler(err, true, () => {
                wx.switchTab({
                  url: '/pages/watch/watch',
                });
            });
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