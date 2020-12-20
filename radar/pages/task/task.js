// pages/task/task.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isAll: false
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
        const apiData = wx.getStorageSync('taskStorage');
        if(apiData) {
            this.setData(apiData);
        } else {
            this.ajaxLoadLatestData();
        }
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

    },
    onCompanyChange() {
        const isAll = this.data.isAll;
        if(!isAll) {
            this.ajaxLoadLatestData();
        } else {
            this.ajaxLoadAllData();
        }
    },
    onTabChange(evt) {
        const isAll = evt.currentTarget.dataset.all;
        this.setData({
            isAll
        });
        if(!isAll) {
            this.ajaxLoadLatestData();
        } else {
            this.ajaxLoadAllData();
        }
    },
    ajaxLoadAllData() {
        const app = getApp();
        const company = wx.getStorageSync('company');
        const companyId = company ? company.id : -1;
        wx.showLoading();
        app.ajax("trademark.allTask", {
            companyId
        }).then((resp) => {
            if(app.ajaxHandler(resp)) {console.log(resp.data);
                this.setData({
                    apiResponse: resp.data
                });
                wx.setStorageSync('taskStorage', {
                    isAll: this.data.isAll,
                    apiResponse: resp.data
                });
            }
        }).catch((err) => {
            app.ajaxHandler(err);
        });
    },
    ajaxLoadLatestData() {
        const app = getApp();
        const company = wx.getStorageSync('company');
        const companyId = company ? company.id : -1;
        wx.showLoading();
        app.ajax("trademark.latestTask", {
            companyId
        }).then((resp) => {
            if(app.ajaxHandler(resp)) {console.log(resp.data);
                this.setData({
                    apiResponse: resp.data
                });
                wx.setStorageSync('taskStorage', {
                    isAll: this.data.isAll,
                    apiResponse: resp.data
                });
            }
        }).catch((err) => {
            app.ajaxHandler(err);
        });
    },
    onLinkTap(evt) {
        const file = evt.currentTarget.dataset.file;
        const url = file.url;
        if(/\.(jpeg|jpg|png|svg)$/i.test(url)) {
            wx.previewImage({
              urls: [url],
            });
        } else {
            wx.navigateTo({
              url: '/pages/web/index?url=' + encodeURIComponent(url),
            });
        }
    }
})