// pages/home/home.js
import { Common } from "../../utils/common.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showLogin: true,
        showRegiste: false,
        name: "",
        mobile: ""
    },

    /**
     * 生命周期函数--监听页面加载 ss
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
    handleOnRetrister: function() {
        this.setData({
            showRegiste: true
        });
    },
    handleOnRegisterClose: function() {
        this.setData({
            showRegiste: false
        });
    },
    handleOnSendRegister: function() {
        const params = {
            name: this.data.name,
            mobile: this.data.mobile,
            origin: "小程序"
        };
        const app = getApp();
        if(params.name === null || (typeof params.name === "string" && params.name.length<=0)) {
            wx.showToast({
              title: '商标名称不能为空.',
              icon: "none"
            });
            return;
        }
        if(!/^1[0-9]{10}$/.test(params.mobile)) {
            wx.showToast({
              title: '手机号码格式不正确.',
              icon: "none"
            });
            return;
        }
        
        app.ajax("trademark.register", params).then((resp) => {
            if(/^200$/.test(resp.statusCode)) {
                this.setData({
                    showRegiste: false
                });
                wx.showToast({
                  title: '信息提交成功',
                  icon: "success"
                });
            } else {
                wx.showToast({
                  title: resp.message || resp.info || "提交失败，请稍后重试",
                  icon: "none"
                });
            }
            wx.hideLoading();
        }).catch((error) => {
            wx.hideLoading();
            wx.showToast({
                icon: "none",
                title: error.message || error.statusText || error.info || "提交失败，请稍后重试",
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
    },
    handleOnShareTap: function() {
        wx.share;
    },
    handleOnRegisteInput: function(evt) {
        const value = evt.detail.value;
        const name = evt.currentTarget.dataset.name;
        const inputObj = {};
        inputObj[name] = value;
        this.setData(inputObj)
    },
    handleOnTypes: function() {
        wx.navigateTo({
          url: '/pages/types/types',
        })
    }
})