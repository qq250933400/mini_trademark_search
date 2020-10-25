// pages/types/types.js
import types from "../../config/types";
import { StaticCommon } from "../../utils/StaticCommon";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        dataTypes: types,
        keyword: "",
        showSearch: false,
        searchList: []
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
    handleOnSearchInput: function(evt) {
        this.setData({
            keyword: evt.detail.value
        });
        if(evt.detail.keyCode == 13) {
            this.handleOnSearch();
        }
    },
    handleOnSearch: function(page) {
        if(!StaticCommon.isEmpty(this.data.keyword)) {
            let myPage = !isNaN(page) ? page : 1;
            wx.showLoading({
                title: "搜索中"
            });
            getApp().ajax("trademark.searchType", {
                keyword: this.data.keyword,
                page: myPage
            }).then((resp) => {
                wx.hideLoading();
                if(/^200$/.test(resp.statusCode)) {
                    const resultListData = resp.data.listData || {};
                    let displayList = JSON.parse(JSON.stringify(this.data.searchList));
                    console.log(resultListData);
                    if(myPage > 1) {
                        Object.keys(resultListData).map((tKey) => {
                            if(displayList[tKey]) {
                                Object.keys(resultListData[tKey].children).map((cKey) => {
                                    if(displayList[tKey].children[cKey]) {
                                        StaticCommon.merge(displayList[tKey].children[cKey].children, resultListData[tKey].children[cKey])
                                    } else {
                                        displayList[tKey].children[cKey] = resultListData[tKey].children[cKey];
                                    }
                                });
                            } else {
                                displayList[tKey] = resultListData[tKey];
                            }
                        });
                    } else {
                        displayList = resultListData;
                    }
                    this.setData({
                        searchList:  displayList,
                        showSearch: true,
                        pageCount: resp.data.pageCount || 0,
                        page: resp.data.page || 1
                    });
                }
            }).catch((resp) => {
                wx.hideLoading();
                console.error(resp);
            });
        } else {
            this.setData({
                searchList: [],
                showSearch: true
            });
        }
    },
    onNextPage: function() {
        if(this.data.page < this.data.pageCount) {
            this.handleOnSearch(this.data.page + 1);
        }
    },
    onGoTypeList: function(evt) {
        const code = StaticCommon.getValue(evt,"currentTarget.dataset.code");
        wx.navigateTo({
          url: '/pages/typesDetail/typesDetail?code=' + code,
        });
    }
})