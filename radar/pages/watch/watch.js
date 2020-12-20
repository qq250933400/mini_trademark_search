const { StaticCommon } = require("../../utils/StaticCommon");

// pages/watch/watch.js
const searchTypeData = [
    {
        title: "全部监控",
        value: "all"
    }, {
        title: "按部门",
        value: "department"
    }, {
        title: "按分类",
        value: "category"
    }
];
Page({

    /**
     * 页面的初始数据
     */
    data: {
        categoryData: searchTypeData,
        selectedCategory: searchTypeData[0],
        apiResponse: {},
        watchTypeData: []
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
        this.ajaxLoadData();
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
    onClick(evt) {
        const data = evt.currentTarget.dataset;
        wx.navigateTo({
          url: '/pages/watchDetail/index?id=' + data.id + "&regno=" + data.regno,
        });
    },
    onCompanyChange() {
        this.ajaxLoadData();
    },
    ajaxLoadData() {
        const app = getApp();
        const company = wx.getStorageSync('company');
        const companyId = company ? company.id : -1;
        wx.showLoading();
        app.ajax("trademark.watchList", {
            companyId,
            getWatchType: !this.data.watchTypeData || this.data.watchTypeData.length<=0
        }).then((resp) => {
            if(app.ajaxHandler(resp)) {
                const watchTypeData = resp.data.watchTypeData || this.data.watchTypeData || [];
                const newData = JSON.parse(JSON.stringify(searchTypeData));
                const listData = StaticCommon.getValue(resp.data, "apiResponse.listData") || [];
                newData[2].children = watchTypeData;
                this.setData({
                    apiResponse: resp.data,
                    watchTypeData,
                    categoryData: newData,
                    hasData: listData.length > 0
                });
            }
        }).catch((err) => {
            app.ajaxHandler(err);
        });
    }
})