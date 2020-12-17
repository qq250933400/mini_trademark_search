import { StaticCommon } from "../../utils/StaticCommon";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        parentCode: "",
        hasChildren: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(!StaticCommon.isEmpty(options.code) && options.code !== this.data.parentCode) {
            this.data.parentCode = options.code;
            this.data.hasChildren = this.data.parentCode.length<5;
            this.getTypes(options.code);
        }
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
    getTypes: function(parentCode) {
        wx.showLoading({
          title: '加载...',
        });
        getApp().ajax("trademark.searchSubTypes", {
            classify: parentCode
        }).then((resp) => {
            wx.hideLoading();
            if(!/^200$/.test(resp.statusCode)) {
                wx.showToast({
                    title: resp.message || resp.info || resp.statusText || "获取商品分类列表失败",
                });
            } else {
                const listData = resp.data.listData;
                const classify = resp.data.classify;
                this.setData({
                    listData,
                    classify,
                    hasChildren: parentCode.length<5
                });
            }
        }).catch((error) => {
            wx.hideLoading();
            wx.showToast({
              title: error.message || error.info || error.statusText || "获取商品分类列表失败",
            });
        });
    },
    handleOnSearchSubItem: function(evt) {
        const code = StaticCommon.getValue(evt,"currentTarget.dataset.code");
        if(code.length<5) {
            wx.navigateTo({
              url: '/pages/typesDetail/typesDetail?code=' + code,
            });
        }
    }
})