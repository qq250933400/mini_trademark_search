const { StaticCommon } = require("../../utils/StaticCommon");

// pages/task/task.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isAll: false,
        isAjax: false,
        ajaxPage: 1,
        apiResponse: {},
        hasData: true,
        showFlow: false,
        showEmail: false,
        sendEmailTask: null,
        inputEmail: "",
        flowData: []
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
        const allData = wx.getStorageSync('taskAllData');
        if(allData && allData.showFlow) {
            this.setData(allData);
            wx.removeStorageSync('taskAllData');
        } else {
            const apiData = wx.getStorageSync('taskStorage');
            if(apiData) {
                const listData = StaticCommon.getValue(apiData, "apiResponse.data") || [];
                apiData.hasData = listData.length > 0;
                this.setData(apiData);
            } else {
                this.ajaxLoadLatestData();
            }
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
    onCompanyChange() {
        const isAll = this.data.isAll;
        this.data.ajaxPage = 1;
        if(!isAll) {
            this.ajaxLoadLatestData();
        } else {
            this.ajaxLoadAllData();
        }
    },
    onTabChange(evt) {
        const isAll = evt.currentTarget.dataset.all;
        this.setData({
            isAll,
            ajaxPage: 1
        });
        if(!isAll) {
            this.ajaxLoadLatestData();
        } else {
            this.ajaxLoadAllData();
        }
    },
    onScrollToBottom() {
        if(!this.data.isAjax && this.data.apiResponse) {
            if(this.data.ajaxPage < this.data.apiResponse.pageCount) {
                this.data.ajaxPage += 1;
                if(this.data.isAll) {
                    this.ajaxLoadAllData();
                } else {
                    this.ajaxLoadLatestData();
                }
            }
        }
        console.log("to ajax next page");
    },
    ajaxLoadAllData() {
        if(!this.data.isAjax) {
            const app = getApp();
            const company = wx.getStorageSync('company');
            const companyId = company ? company.id : -1;
            this.data.isAjax = true;
            wx.showLoading();
            app.ajax("trademark.allTask", {
                companyId,
                page: this.data.ajaxPage
            }).then((resp) => {
                this.data.isAjax = false;
                if(app.ajaxHandler(resp)) {
                    let apiR = JSON.parse(JSON.stringify(this.data.apiResponse || {}));
                    if(this.data.ajaxPage > 1) {
                        const listData = apiR.data || [];
                        const newListData = resp.data.data || [];
                        const allData = [...listData, ...newListData];
                        apiR.data = allData;
                    } else {
                        apiR = resp.data;
                    }
                    this.setData({
                        apiResponse: apiR,
                        hasData: (StaticCommon.getValue(resp, "data.data") || []).length > 0
                    });
                    wx.setStorageSync('taskStorage', {
                        isAll: this.data.isAll,
                        apiResponse: resp.data
                    });
                }
            }).catch((err) => {
                this.data.isAjax = false;
                app.ajaxHandler(err);
            });
        }
    },
    ajaxLoadLatestData() {
        if(!this.data.isAjax) {
            const app = getApp();
            const company = wx.getStorageSync('company');
            const companyId = company ? company.id : -1;
            wx.showLoading();
            this.data.isAjax = true;
            app.ajax("trademark.latestTask", {
                companyId,
                page: this.data.ajaxPage
            }).then((resp) => {
                this.data.isAjax = false;
                if(app.ajaxHandler(resp)) {
                    let apiR = JSON.parse(JSON.stringify(this.data.apiResponse || {}));
                    if(this.data.ajaxPage > 1) {
                        const listData = apiR.data || [];
                        const newListData = resp.data.data || [];
                        const allData = [...listData, ...newListData];
                        apiR.data = allData;
                    } else {
                        apiR = resp.data;
                    }
                    this.setData({
                        apiResponse: apiR,
                        hasData: (StaticCommon.getValue(resp, "data.data") || []).length > 0
                    });
                    wx.setStorageSync('taskStorage', {
                        isAll: this.data.isAll,
                        apiResponse: resp.data
                    });
                }
            }).catch((err) => {
                this.data.isAjax = false;
                app.ajaxHandler(err);
            });
        }
    },
    onLinkTap(evt) {
        const file = evt.currentTarget.dataset.file;
        const url = file.url;
        if(/\.(jpeg|jpg|png|svg)$/i.test(url)) {
            wx.previewImage({
              urls: [url],
            });
        } else {
            const info = wx.getSystemInfoSync();
            if(/iPhone\s/.test(info.model)) {
                wx.setStorageSync('taskAllData', this.data);
                wx.navigateTo({
                  url: '/pages/web/index?url=' + encodeURIComponent(url),
                });
            } else {
                wx.showLoading({
                  title: '加载文件',
                });
                wx.downloadFile({
                    url: url,
                    success:( res) => {
                        wx.hideLoading();
                        if(res.errMsg === "downloadFile:ok") {
                            wx.openDocument({
                                filePath: res.tempFilePath,
                            });
                        } else {
                            wx.showModal({
                              content: "下载文件失败",
                              title: "",
                              showCancel: false
                            });
                        }
                    }
                });
            }
        }
    },
    onViewFlow(evt){
        const taskId = StaticCommon.getValue(evt, "currentTarget.dataset.item.trademark_task_id");
        const app = getApp();
        wx.showLoading();
        app.ajax("trademark.taskFlow", {
            taskID: taskId
        }).then((resp) => {
            this.data.isAjax = false;
            if(app.ajaxHandler(resp)) {
                const listData = resp.data.listData || [];
                for(const file of listData) {
                    file.isImage = /\.(jpg|jpeg|png|bmp)$/i.test(file.url);
                }
                this.setData({
                    flowData: listData,
                    showFlow: true
                });
            }
        }).catch((err) => {
            app.ajaxHandler(err);
        });
    },
    onTaskProgTap(event){
        event.cancelBubble = true;
    },
    onTaskProgMaskTap() {
        this.setData({
            showFlow: false
        });
    },
    onFlowFileTap(evt) {
        const file = evt.currentTarget.dataset.file;
        if(file.isImage) {
            wx.previewImage({
              urls: [file.url],
            });
        } else {
            const info = wx.getSystemInfoSync();
            if(/iPhone\s/.test(info.model)) {
                wx.setStorageSync('taskAllData', this.data);
                wx.navigateTo({
                  url: '/pages/web/index?url=' + encodeURIComponent(file.url),
                });
            } else {
                wx.showLoading({
                    title: '加载文件',
                });
                wx.downloadFile({
                    url: file.url,
                    success: (res) => {
                        wx.hideLoading();
                        if (res.errMsg === "downloadFile:ok") {
                            wx.openDocument({
                                filePath: res.tempFilePath,
                            });
                        } else {
                            wx.showModal({
                                content: "下载文件失败",
                                title: "",
                                showCancel: false
                            });
                        }
                    }
                });
            }
        }
    },
    onInputMailMaskTap() {
        this.setData({
            showEmail: false
        });
    },
    onEmailInput(evt) {
        const emailAddress = evt.detail.value;
        this.data.inputEmail = emailAddress;
    },
    onToSendEmail(evt) {
        const itemData = evt.currentTarget.dataset.item;
        this.setData({
            sendEmailTask: itemData,
            showEmail: true,
        });
    },
    onSendEmail() {
        const app = getApp();
        wx.showLoading();
        app.ajax("trademark.sendEmail", {
            dataID: this.data.sendEmailTask.trademark_task_id,
            emailAddress: this.data.inputEmail
        }).then((resp) => {
            this.data.isAjax = false;
            if(app.ajaxHandler(resp)) {
                wx.showModal({
                  content: "邮件发送成功，请注意查收",
                  title: "",
                  showCancel: false,
                  confirmText: "确定"
                });
                this.setData({
                    showEmail: false,
                });
            }
        }).catch((err) => {
            app.ajaxHandler(err);
        });
    }
})