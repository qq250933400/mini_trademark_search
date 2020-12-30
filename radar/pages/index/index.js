const { StaticCommon } = require("../../utils/StaticCommon");

// pages/index/index.js
const searchTypeData = [
    {
        title: "按公司",
        value: "all"
    },{
        title: "按部门",
        value: "department"
    }, {
        title: "商品分类",
        value: "type",
        event: true
    }
];
Page({

    /**
     * 页面的初始数据
     */
    data: {
        categoryData: searchTypeData,
        showTypes: false,
        selectedTypes: [],
        searchType: searchTypeData[0],
        searchIntCls: "",
        searchPage: 1,
        trademarkType: null,
        trademarkResult: {},
        department: null,
        isAjax: false
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
        const app = getApp();
        app.checkConnect().then(() => {
            let isLoadData = false;
            if(app.checkInitDepartment()) {
                app.onDepartmentChange = (data) => {
                    const sourceData = JSON.parse(JSON.stringify(this.data.categoryData || []));
                    const listData = data || [];
                    const newListData = [];
                    listData.map((dData) => {
                        newListData.push({
                            id: dData.id,
                            companyId: dData.companyId,
                            title: dData.depName
                        });
                    });
                    sourceData[1].children = newListData;
                    this.setData({
                        categoryData: sourceData
                    });
                    if(!isLoadData) {
                        this.ajaxLoadData();
                    }
                    isLoadData = true;
                }
            } else {
                const departments = wx.getStorageSync('departments') || [];
                const sourceData = JSON.parse(JSON.stringify(this.data.categoryData || []));
                const newListData = [];
                departments.map((dData) => {
                    newListData.push({
                        id: dData.id,
                        companyId: dData.companyId,
                        title: dData.depName
                    });
                });
                sourceData[1].children = newListData;
                this.setData({
                    categoryData: sourceData
                });
                this.ajaxLoadData();
            }
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
    onCategoryChange: function(evt) {
        const data = evt.detail;
        if(!data.parent  && data.data.value !== "department" && data.data.value !== "type") {
            this.setData({
                searchType: evt.detail.data,
                searchIntCls: "",
                searchPage: 1,
                department: null,
                trademarkResult: {}
            });
            this.ajaxLoadData();
        } else {
            if(data.parent && data.parent.value === "department") {
                this.setData({
                    department: data.data,
                    searchPage: 1,
                    searchIntCls: null,
                    trademarkResult: {}
                });
                this.ajaxLoadData();
            } else {
                if(data.data.value === "department") {
                    wx.showModal({
                        content: "当前公司未设置部门信息。",
                        title: "",
                        showCancel: false
                    });
                }
            }
        }
    },
    onTypeChange: function(evt) {
        this.setData({
            trademarkType: evt.detail.data,
            searchIntCls: "",
            searchPage: 1
        });
        this.ajaxLoadData();
    },
    onCategoryItemTap(evt) {
        if(evt.detail.data && evt.detail.data.value === "type") {
            this.setData({
                showTypes: true,
                department: null
            });
        }
    },
    onListScrollBottom(evt) {
        const totalPage = StaticCommon.getValue(this.data, "trademarkResult.totalPage");
        if(!this.data.isAjax && totalPage > this.data.searchPage) {
            this.data.searchPage += 1;
            this.ajaxLoadData();
        }
    },
    /**
     * 商品分类选择事件
     * @param {any} evt 
     */
    onTTypeChange(evt) {
        const data = evt.detail;
        this.setData({
            searchIntCls: data.code,
            trademarkResult: {}
        });
        this.ajaxLoadData();
    },
    ajaxLoadData: function() {
        const app = getApp();
        if(!this.data.isAjax) {
            wx.showLoading({
            title: '加载数据',
            });
            if(this.data.searchPage <=1) {
                this.data.trademarkResult = {};
            }
            this.data.isAjax = true;
            app.ajax("trademark.search", {
                trademarkType: this.data.trademarkType,
                searchType: {
                    title: "商标",
                    value: "trademark"
                },
                department: this.data.department,
                company: wx.getStorageSync('company'),
                intCls: this.data.searchIntCls,
                page: this.data.searchPage
            }).then((resp) => {
                wx.hideLoading();
                if(app.ajaxHandler(resp)) {
                    const newListData = resp.data.listData || [];
                    const oldListData = StaticCommon.getValue(this.data,"trademarkResult.listData") || [];
                    if(this.data.searchPage > 1) {
                        const AllListData = [...oldListData, ...newListData];
                        const newObjData = this.data.trademarkResult ? JSON.parse(JSON.stringify(this.data.trademarkResult||{})) : {};
                        newObjData.listData = AllListData;
                        this.setData({
                            trademarkResult: newObjData
                        });
                    } else {
                        this.setData({
                            trademarkResult: resp.data
                        });
                    }
                }
                this.data.isAjax = false;
            }).catch((err) => {
                this.data.isAjax = false;
                wx.hideLoading();
                app.ajaxHandler(err)
            });
        }
    },
    onFilterTap:function() {
        this.setData({
            showTypes: true
        });
    },
    onCompanyChange(evt) {
        this.data.department = null;
        this.data.searchIntCls = null;
        this.data.searchPage = 1;
        this.ajaxLoadData();
    },
    onTrademarkTab(evt) {
        wx.navigateTo({
          url: '/pages/trademark/detail?id=' + evt.currentTarget.dataset.value.Id,
        });
    }
})