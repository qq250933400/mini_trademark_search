//app.js
import setServiceConfig from "./config/serviceConfig.js";
import i18nConfigData from "./config/i18n.js";
import { Service } from "./utils/service.js";
import { I18n } from "./utils/i18n.js";
import { StaticCommon } from "./utils/StaticCommon.js";

App({
    onLaunch: function() {
        this.globalData.serviceConfig = setServiceConfig(this);
        this.globalData.service = new Service(this);
        this.globalData.i18n = new I18n(i18nConfigData);
        this.globalData.i18n.setLocale("zh");
        this.checkConnect().then(() => {
            this.loadCompany();
        });
    },
    ajax: function(endPoint, params) {
        const obj = this.globalData.service;
        obj.setConfig(this.globalData.serviceConfig);
        return obj.send(endPoint, params);
    },
    ajaxHandler(data, silent = false, callback = null) {
        wx.hideLoading();
        if(data && /^200$/.test(data.statusCode)) {
            return true;
        } else {
            if(!/None/.test(data.statusCode)) {
                const msg = data.info || data.message || "未知错误";
                !silent && wx.showModal({
                    content: msg,
                    showCancel: false,
                    confirmText: "关闭",
                    success: () => {
                        typeof callback === "function" && callback();
                    }
                });
                silent && console.error(data);
                return false;
            } else {
                return false;
            }
        }
    },
    getI18n: function(nodeKey, defaultValue) {
        return this.globalData.i18n.message(nodeKey, defaultValue);
    },
    loadCompany(fn){
        if(!this.globalData.companyInfo || this.globalData.companyInfo.length <=0) {
            this.ajax("trademark.getCompanys", {
                mobile: wx.getStorageSync('mobile')
            }).then((resp) => {
                if(this.ajaxHandler(resp)){
                    this.globalData.companyInfo = resp.data || [];
                    typeof this.onCompanyLoaded === "function" && this.onCompanyLoaded(resp.data || []);
                    typeof fn === "function" && fn();
                }
            }).catch((err) => {
                this.ajaxHandler(err, true);
            });
        }
    },
    onCompanyLoaded(){
        console.log("Not Ready");
    },
    onDepartmentChange() {
        console.log("Not Ready");
    },
    checkLogin() {
        const token = wx.getStorageSync('token');
        return !StaticCommon.isEmpty(token);
    },
    checkConnect() {
        return new Promise((resolve, reject) => {
            this.ajax("trademark.connect").then((resp) => {
                if(this.ajaxHandler(resp, true)) {
                    resolve({});
                }
            }).catch(() => {
                reject({});
            });
        });
    },
    checkInitDepartment() {
        const defaultDepartment = wx.getStorageSync('departments');
        if(!defaultDepartment || defaultDepartment.length<=0) {
            const company = wx.getStorageSync('company');
            this.loadDepartments(company);
        }
    },
    loadDepartments(comany) {
        const app = getApp();
        app.ajax("trademark.departments", {
            companyId: comany.id
        }).then((resp) => {
            const listData = resp.data || [];
            if(app.ajaxHandler(resp)) {
                wx.setStorageSync('departments', resp.data);
            } else {
                wx.setStorageSync('departments', []);
            }
            typeof app.onDepartmentChange === "function" && app.onDepartmentChange(listData);
        }).catch((err) => {
            console.log(err);
        });
    },
    globalData: {
        userInfo: null,
        serviceConfig: null,
        service: null,
        locale: "zh",
        i18n: null,
        companyInfo: []
    }
})