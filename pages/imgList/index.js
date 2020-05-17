// pages/imgList/index.js
import { StaticCommon as com } from "../../utils/StaticCommon.js";
import typesJson, { trademarkStatus } from "../../config/types.js";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        image: "",
        intCls: 0,
        page: 1,
        pageSize: 20,
        pageCount: 0,
        total: 0,
        fromLocal: false,
        listData: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const imgDataStr = wx.getStorageSync("imageListPageData");
        if(com.isEmpty(imgDataStr)) {
            const cls = !isNaN(options.intCls) ? parseInt(options.intCls) : 0;
            this.setData({
                image: decodeURIComponent(options.image) || "",
                localFile: wx.getStorageSync("searchImage"),
                intCls: cls > 0 ? cls : 0,
                i18n: getApp().getI18n("index")
            });
        } else {
            const imgData = JSON.parse(imgDataStr);
            imgData.fromLocal = true;
            this.setData(imgData);
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
        const imgDataStr = wx.getStorageSync("imageListPageData");
        if (com.isEmpty(imgDataStr)) {
            if(com.isEmpty(this.data.image) && 1 == 2) {
                wx.showModal({
                    title: '',
                    content: "请先上传图片",
                    confirmText: "关闭",
                    showCancel: false,
                    success: () => {
                        wx.navigateBack({});
                    }
                });
            } else {
                !this.data.fromLocal && this.loadData();
            }
        } else {
            const imgData = JSON.parse(imgDataStr);
            imgData.fromLocal = true;
            this.setData(imgData);
        }
    },
    loadData: function(page, fn) {
        const app = getApp();
        wx.showLoading({
            title: '查询数据',
        });
        app.ajax("trademark.searchImage", {
            imageName: this.data.image,
            intcls: this.data.intCls,
            page: page || 1,
            pageSize: this.data.pageSize
        }).then((resp) => {
            wx.hideLoading();
            if(resp.Status == 200) {
                const listData = com.getValue(resp, "Content.data") || [];
                const total = com.getValue(resp, "Content.sum");
                const pageCount = Math.ceil(total / this.data.pageSize);
                listData.map((item) => {
                    item.tmStatusText = trademarkStatus[item.TmStatus];
                });
                this.setData({
                    pageCount,
                    total,
                    listData
                });
                typeof fn === "function" && fn();
            }
            console.log(resp);
        }).catch((error) => {
            wx.hideLoading();
            wx.showModal({
                title: '',
                content: error.statusText || error.message || error.info || "查询失败",
                confirmText: "关闭",
                showCancel: false
            });
        });
    },
    handleOnMoreTap: function() {
        this.loadData(this.data.page + 1, ()=>{
            this.data.page = this.data.page + 1;
        });
    },
    handleOnListItemTap: function (evt) {
        const id = evt.currentTarget.dataset.id;
        wx.setStorageSync("imageListPageData", JSON.stringify(this.data));
        wx.navigateTo({
            url: '/pages/detail/detail?id=' + id,
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