//index.js
//获取应用实例
import typesJson from "../../config/types.js";
import { StaticCommon } from "../../utils/StaticCommon.js";

const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        i18n: {},
        listData: [],
        searchLikeMode: false,
        searchValue: "",
        selectType: {},
        typesData: typesJson,
        showTypes: false,
        page: 1,
        pageSize: 20,
        pageCount: 0
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
        if(this.data.searchLikeMode) {
            this.setData({
                searchLikeMode: false,
                listData: [],
                page: 1
            });
            this.actionSearch();
        }
    },
    bindSearchLikeModeTap: function () {
        if(!this.data.searchLikeMode) {
            this.setData({
                searchLikeMode: true,
                listData: [],
                page: 1
            });
            this.actionSearch();
        }
    },
    bindOnButtonSearchTap: function(){
        this.data.page = 1;
        this.data.listData = [];
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
        if(this.data.page + 1 <= this.data.pageCount) {
            this.data.page += 1;
            this.actionSearch();
        }
    },
    handleOnListItemTap: function(evt) {
        const id = evt.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/detail/detail?id=' + id,
        });
    },
    onLoad: function() {
        this.setData({
            i18n: app.getI18n("index")
        });
    },
    actionSearch: function() {
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
            app.ajax("trademark.search", params).then((resp) => {
                if(resp.success && resp.total>0) {
                    const listData = resp.data || [];
                    let oData = this.data.listData || [];
                    oData = JSON.parse(JSON.stringify(oData));
                    oData.push(...listData);
                    this.setData({
                        listData: oData,
                        pageCount: Math.ceil(resp.total / this.data.pageSize)
                    });
                } else {
                    this.setData({});
                }
                wx.hideLoading();
            }).catch((error) => {
                wx.hideLoading();
                wx.showToast({
                    title: error.message || error.statusText || error.info || "搜索失败",
                });
            });
        }
    }
})