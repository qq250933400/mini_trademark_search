// pages/home/home.js
import { Common } from "../../utils/common.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showLogin: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.authorize({
            
        })
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
        const com = new Common();
        wx.removeStorageSync("imageListPageData");
        wx.removeStorageSync("searchNamePageData");
        this.setData({
            showLogin: !com.checkLogin()
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

    },
    handleOnHomeSearch: function() {
        wx.navigateTo({
            url: '/pages/index/index?from=home',
        });
    },
    handleOnStartLoginTap: function(evt) {
        const com = new Common();
        com.startLogin((token) => {
            this.setData({
                showLogin: com.isEmpty(token)
            });
        });
    },
    handleOnImageSearchTap: function() {
        console.log("navigateTo");
        wx.navigateTo({
            url: '/pages/image/index',
        });
    }
})