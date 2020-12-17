// pages/image/index.js
import typeData from "../../config/types.js";
import { trustKey } from "../../utils/service.js";
import { StaticCommon as com } from "../../utils/StaticCommon.js";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        array: typeData,
        typeSourceData: typeData,
        index: 0,
        imageName: "",
        imageFile: "/res/upload.png"
    },
    bindPickerChange: function (e) {
        this.setData({
            index: e.detail.value
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const typeDataList = JSON.parse(JSON.stringify(typeData));
        typeDataList.splice(0,0, {
            id: -1,
            title: "选择商品分类",
            name: "选择商品分类",
            code: -1
        });
        for(let i=1;i<typeDataList.length;i++) {
            typeDataList[i].name = "第" + typeDataList[i].code + "类 " + typeDataList[i].title;
        }
        this.setData({
            typeSourceData: typeDataList
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
        wx.removeStorageSync("imageListPageData");
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
    handleOnUploadTap: function() {
        wx.chooseImage({
            count: 1,
            success: (res) => {
                if (res.errMsg === "chooseImage:ok") {
                    const fileName = res.tempFilePaths[0];
                    const app = getApp();
                    const endPoint = app.globalData.service.getEndPoint("trademark.uploadImage");
                    wx.showLoading({
                        title: '上传图片',
                    });
                    wx.uploadFile({
                        url: endPoint.url,
                        filePath: fileName,
                        name: 'searchImage',
                        header: {
                            "appKey": trustKey
                        },
                        success: (res) => {
                            if(res.statusCode == 200) {
                                const respData = JSON.parse(res.data);
                                if(!respData.success) {
                                    wx.showModal({
                                        title: '',
                                        content: respData.info,
                                        confirmText: "关闭",
                                        showCancel: false
                                    });
                                } else {
                                    if(!com.isEmpty(respData.name)) {
                                        this.setData({
                                            imageName: respData.name,
                                            imageFile: fileName,
                                            showQueryButton: true
                                        });
                                    }
                                }
                            } else {
                                wx.showModal({
                                    title: '',
                                    content: res.errMsg,
                                    confirmText: "关闭",
                                    showCancel: false
                                });
                            }
                        },
                        fail: (err) => {
                            wx.showModal({
                                title: '',
                                content: err.errMsg,
                                confirmText: "关闭",
                                showCancel: false
                            });
                        },
                        complete: () => {
                            wx.hideLoading();
                        }
                    });
                }
            },
        })
    },
    handleOnImageSearch: function() {
        if (!com.isEmpty(this.data.imageName)) {
            wx.setStorageSync("searchImage", this.data.imageFile);
            wx.navigateTo({
                url: '/pages/imgList/index?' + com.toQuery({
                    image: this.data.imageName,
                    intCls: this.data.typeSourceData[this.data.index].code
                }),
            });
        } else {
            wx.showModal({
                title: '',
                content: "请先上传图片",
                confirmText: "关闭",
                showCancel: false
            });
        }
    }
})