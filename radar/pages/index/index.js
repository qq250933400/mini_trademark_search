// pages/index/index.js
const searchTypeData = [
    {
        title: "商标",
        value: "trademark"
    }, {
        title: "专利",
        value: "patent"
    }, {
        title: "著作权",
        value: "copyright"
    }, {
        title: "软著",
        value: "softcopyright"
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
        trademarkType: null,
        trademarkResult: {}
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
        this.setData({
            searchType: evt.detail.data,
            searchIntCls: ""
        });
        this.ajaxLoadData();
    },
    onTypeChange: function(evt) {
        this.setData({
            trademarkType: evt.detail.data,
            searchIntCls: "",
        });
        this.ajaxLoadData();
    },
    /**
     * 商品分类选择事件
     * @param {any} evt 
     */
    onTTypeChange(evt) {
        const data = evt.detail;
        this.setData({
            searchIntCls: data.code
        });
        this.ajaxLoadData();
    },
    ajaxLoadData: function() {
        const app = getApp();
        wx.showLoading({
          title: '加载数据',
        });
        this.setData({
            trademarkResult: {}
        });
        app.ajax("trademark.search", {
            trademarkType: this.data.trademarkType,
            searchType: this.data.searchType,
            company: wx.getStorageSync('company'),
            intCls: this.data.searchIntCls
        }).then((resp) => {
            wx.hideLoading();
            if(app.ajaxHandler(resp)) {
                this.setData({
                    trademarkResult: resp.data
                });
                console.log(resp.data);
            }
        }).catch((err) => {
            wx.hideLoading();
            app.ajaxHandler(err)
        });
    },
    onFilterTap:function() {
        this.setData({
            showTypes: true
        });
    },
    onCompanyChange(evt) {
        this.ajaxLoadData();
    },
    onTrademarkTab(evt) {
        console.log(evt);
        wx.navigateTo({
          url: '/pages/trademark/detail?id=' + evt.currentTarget.dataset.value.Id,
        });
    }
})