// pages/detail/detail.js
import typesJson from "../../config/types.js";
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        typeData: typesJson,
        detail: {},
        statusText: ["未公告","已初审","已注册","已无效"],
        type: {},
        processCN: [],
        id: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.id = options.id;
        this.loadDetail();
    },
    loadDetail: function() {
        let type = this.data.detail.TmType;
        let typeList = this.data.typeData
        let typeData;
        for (let i = 0; i < typeList.length; i++) {
            if (!isNaN(typeList[i].code) && !isNaN(type) && parseInt(typeList[i].code, 10) === parseInt(type, 10)) {
                this.setData({
                    type: typeList[i]
                });
                break;
            }
        }

        let processCN = (this.data.detail.ProcessCN || "").split(";");
        for (let k = 0; k < processCN.length; k++) {
            const tp = processCN[k].split(":");
            processCN[k] = {
                date: tp[0],
                title: tp[1]
            };
        }
        this.setData({
            processCN
        });
    },
    loadData: function() {
        wx.showLoading({
            title: '查询详情',
        });
        app.ajax("trademark.detail", {
            id: this.data.id
        }).then((resp) => {
            wx.hideLoading();
            if(resp.success) {
                this.setData({
                    detail: resp.data || {}
                });
                this.loadDetail();
            } else {
                wx.showModal({
                    content: resp.message || "获取详情失败，请稍后重试",
                    showCancel: false,
                    onOk: () => {
                        wx.navigateBack({});
                    }
                });
            }
        }).catch((err) => {
            wx.hideLoading();
            console.error(err);
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
        wx.showShareMenu({});
        this.loadData();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        wx.hideShareMenu({});
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
    handleOnShareTap:function(){
        wx.share
    }
})