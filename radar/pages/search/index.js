//index.js
//获取应用实例
import typesJson, { trademarkStatus } from "../../config/types.js";
import { StaticCommon } from "../../utils/StaticCommon.js";
import { Common } from "../../utils/common.js";
const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        i18n: {},
        listData: [],
        searchLikeMode: -1,
        searchValue: "",
        selectType: {},
        typesData: typesJson,
        showTypes: false,
        showLogin: false,
        page: 1,
        pageSize: 20,
        pageCount: 0,
        needSetFocus: false
    },
    handleOnShowTypeTap: function() {
        this.setData({
            showTypes: true
        });
    },
    handleOnTypeCloseTap: function(){
        this.setData({
            showTypes: false
        });
    },
    handleOnTypeTap: function(evt) {
        const cType = evt.currentTarget.dataset;
        if(this.data.selectType.code !== cType.code) {
            this.setData({
                selectType: evt.currentTarget.dataset,
                showTypes: false,
                page: 1,
                listData: []
            });
            this.actionSearch();
        } else {
            this.setData({
                selectType: {},
                page: 1,
                showTypes: false,
                listData: []
            });
            this.actionSearch();
        }
    },
    bindSearchSameModeTap: function() {
        if(this.data.searchLikeMode !== 0) {
            this.setData({
                searchLikeMode: 0,
                listData: [],
                page: 1
            });
            this.actionSearch();
        } else {
            this.setData({
                searchLikeMode: -1,
                listData: [],
                page: 1
            });
            this.actionSearch();
        }
    },
    bindSearchLikeModeTap: function () {
        if(this.data.searchLikeMode !== 1) {
            this.setData({
                searchLikeMode: 1,
                listData: [],
                page: 1
            });
            this.actionSearch();
        } else {
            this.setData({
                searchLikeMode: -1,
                listData: [],
                page: 1
            });
            this.actionSearch();
        }
    },
    bindOnButtonSearchTap: function(){
        this.setData({
            page: 1,
            listData: []
        });
        this.actionSearch();
    },
    handleOnSearchValueInput: function(evt){
        this.setData({
            searchValue: evt.detail.value || "",
            page: 1
        });
        if(evt.detail.keyCode === 13) {
            this.setData({
                listData: []
            });
            this.actionSearch();
        }
    },
    handleOnMoreTap: function() {
        if(this.data.page + 1 <= this.data.pageCount+1) {
            this.setData({
                page: this.data.page + 1
            });
            this.actionSearch();
        }
    },
    handleOnListItemTap: function(evt) {
        const id = evt.currentTarget.dataset.id;
        wx.setStorageSync("searchNamePageData", JSON.stringify(this.data));
        wx.navigateTo({
            url: '/pages/searchDetail/detail?api=shebiaowang&id=' + id,
        });
    },
    onLoad: function(options) {
        var keyword = options.keyword || "";
        keyword = decodeURIComponent(keyword);
        this.setData({
            i18n: app.getI18n("index"),
            searchValue: keyword,
            from: options.from,
            needSetFocus: options.from === "home" || (options.from === "detail" && !StaticCommon.isEmpty(keyword))
        });
    },
    onUnload: function(){
        this.setData({
            needSetFocus: false
        });
    },
    onHide: function() {
        this.setData({
            needSetFocus: false
        });
    },
    onShow: function() {
        const com = new Common();
        const isLogin = com.checkLogin();
        if(this.data.from === "detail" && !StaticCommon.isEmpty(this.data.searchValue)) {
            this.actionSearch();
            wx.setStorageSync('searchNamePageData', null);
        } else {
            let hisListData = wx.getStorageSync("searchNamePageData");
            let isLoadData = true;
            let checkData = {};
            if(!com.isEmpty(hisListData)) {
                const hisData = JSON.parse(hisListData);
                this.setData(hisData);
                checkData = hisData;
                if(hisData.searchValue !== this.data.searchValue) {
                    isLoadData = true;
                } else {
                    isLoadData = false;
                }
            } else {
                checkData = this.data;
            }
            if (!StaticCommon.isEmpty(checkData.searchValue)) {
                isLoadData && this.setData({
                    page: 1,
                    listData: []
                });
                isLogin && isLoadData && this.actionSearch();
            }
        }
        if(!isLogin) {
            this.setData({
                showLogin: true
            });
        }
    },
    actionSearch: function() {
        if(!this.data.isAjax) {
            const params = {
                searchValue: this.data.searchValue,
                likeMode: this.data.searchLikeMode,
                type: this.data.selectType,
                page: this.data.page,
                pageSize: this.data.pageSize
            };
            if (StaticCommon.isEmpty(params.searchValue)) {
                this.setData({
                    listData: [],
                    page: 1
                });
                wx.showModal({
                    content: '请输入搜索内容',
                    showCancel: false,
                    confirmText: "关闭"
                });
            } else {
                wx.showLoading({
                    title: '正在查询',
                });
                this.data.isAjax = true;
                app.ajax("trademark.trademarkSearch", params).then((resp) => {
                    this.data.isAjax = false;
                    if(resp.success && resp.total>0) {
                        const listData = resp.data || [];
                        let oData = this.data.listData || [];
                        oData = JSON.parse(JSON.stringify(oData));
                        listData.map((item) => {
                            item.tmStatusText = trademarkStatus[item.TmStatus];
                            oData.push(item);
                        });
                        this.setData({
                            listData: oData,
                            pageCount: Math.ceil(resp.total / this.data.pageSize)
                        });
                    } else {
                        const updateState = {};
                        if(resp.notLogin) {
                            updateState.showLogin = true;
                            this.setData(updateState);
                        } else {
                            if (this.data.searchLikeMode === 0 && this.data.page === 1) {
                                wx.showModal({
                                    content: '没有该相同商标，请点击近似商标查看',
                                    showCancel: false,
                                    confirmText: "关闭"
                                });
                            } else {
                                wx.showModal({
                                    title: '没有查询到商标信息，请点击近似商标查看',
                                    showCancel: false,
                                    confirmText: "关闭"
                                });
                            }
                        }
                    }
                    wx.hideLoading();
                }).catch((error) => {
                    this.data.isAjax = false;
                    wx.hideLoading();
                    wx.showToast({
                        title: error.message || error.statusText || error.info || "搜索失败",
                    });
                });
            }
        }
    },
    handleOnStartLoginTap:function(){
        const com = new Common();
        com.startLogin((token) => {
            this.setData({
                showLogin: com.isEmpty(token)
            });
        });
    },
    onScrollToNextPage() {
        if(!this.data.isAjax && this.data.page + 1 <= this.data.pageCount) {
            this.data.page += 1;
            this.actionSearch();
        }
    }
})