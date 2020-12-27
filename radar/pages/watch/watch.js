const { StaticCommon } = require("../../utils/StaticCommon");

// pages/watch/watch.js
const searchTypeData = [
    {
        title: "全部监控",
        value: "all"
    },
    {
        title: "监控类型",
        value: "category"
    },
    // {
    //     title: "按部门",
    //     value: "department",
    //     visible: false
    // }
];
Page({

    /**
     * 页面的初始数据
     */
    data: {
        categoryData: searchTypeData,
        selectedCategory: searchTypeData[0],
        searchedWatchType: null,
        apiResponse: {},
        watchTypeData: [],
        searchPage: 1,
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
        this.ajaxLoadData();
        const app = getApp();
        app.onDepartmentChange = (data) => {
            const sourceData = JSON.parse(JSON.stringify(this.data.categoryData));
            const listData = data || [];
            const newListData = [];
            listData.map((dData) => {
                newListData.push({
                    id: dData.id,
                    companyId: dData.companyId,
                    title: dData.depName
                });
            });
           // sourceData[1].children = newListData;
            this.setData({
                categoryData: sourceData
            });
        }
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
    onCategoryChange(evt) {
        const parent = evt.detail.parent;
        console.log(evt.detail);
        if(parent && parent.value === "department") {
            const department = evt.detail.data;
            this.data.department = department;
            this.data.watchTypeData = {};
            this.data.searchedWatchType = {};
            this.setData({
                searchPage: 1,
                apiResponse: null,
                department,
                hasData: false,
                searchedWatchType: null
            });
            this.ajaxLoadData();
        } else if(parent && parent.value === "category") {
            this.data.searchedWatchType = evt.detail.data;
            this.data.department = {};
            this.setData({
                searchPage: 1,
                apiResponse: null,
                department: null,
                hasData: false
            });
            this.ajaxLoadData();
        } else {
            if(evt.detail.data.value === "department") {
                wx.showModal({
                    content: "当前公司未设置部门信息。",
                    title: "",
                    showCancel: false
                });
            } else if(evt.detail.data.value === "all") {
                this.data.watchTypeData = {};
                this.data.searchedWatchType = {};
                this.data.department = null;
                this.data.searchPage = 1;
                this.ajaxLoadData();
            }
        }
    },
    onClick(evt) {
        const data = evt.currentTarget.dataset;
        wx.navigateTo({
          url: '/pages/watchDetail/index?id=' + data.id + "&regno=" + data.regno,
        });
    },
    onCompanyChange() {
        this.setData({
            apiResponse: null,
            searchPage: 1,
            hasData: false
        });
        this.ajaxLoadData();
    },
    onScrollToBottom() {
        if(!this.data.isAjax) {
            if(this.data.searchPage < this.data.apiResponse.pageCount) {
                this.data.searchPage += 1;
                this.ajaxLoadData();
            }
        }
    },
    ajaxLoadData() {
        if(!this.data.isAjax) {
            const app = getApp();
            const company = wx.getStorageSync('company');
            const companyId = company ? company.id : -1;
            const shouldGetWatchType = !this.data.watchTypeData || this.data.watchTypeData.length<=0;
            wx.showLoading();
            this.data.isAjax = true;
            app.ajax("trademark.watchList", {
                companyId,
                department: this.data.department,
                page: this.data.searchPage,
                getWatchType: shouldGetWatchType,
                watchType: this.data.searchedWatchType
            }).then((resp) => {
                this.data.isAjax = false;
                if(app.ajaxHandler(resp)) {
                    const watchTypeData = resp.data.watchTypeData || this.data.watchTypeData || [];
                    const newData = JSON.parse(JSON.stringify(this.data.categoryData));
                    const listData = StaticCommon.getValue(resp.data, "listData") || [];
                    let respData = resp.data;
                    if(shouldGetWatchType) {
                        newData[1].children = watchTypeData;
                    }
                    if(this.data.searchPage > 1) {
                        const oldData = JSON.parse(JSON.stringify(this.data.apiResponse));
                        const newListData = [...oldData.listData, ...listData];
                        oldData.listData = newListData;
                        respData = oldData;
                    }
                    this.setData({
                        apiResponse: respData,
                        watchTypeData,
                        categoryData: newData,
                        hasData: listData.length > 0
                    });
                }
            }).catch((err) => {
                this.data.isAjax = false;
                app.ajaxHandler(err);
            });
        }
    }
})