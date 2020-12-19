//app.js
import setServiceConfig from "./config/serviceConfig.js";
import i18nConfigData from "./config/i18n.js";
import { Service } from "./utils/service.js";
import { I18n } from "./utils/i18n.js";

App({
    onLaunch: function() {
        this.globalData.serviceConfig = setServiceConfig(this);
        this.globalData.service = new Service(this);
        this.globalData.i18n = new I18n(i18nConfigData);
        this.globalData.i18n.setLocale("zh");
        this.loadCompany();
    },
    ajax: function(endPoint, params) {
        const obj = this.globalData.service;
        obj.setConfig(this.globalData.serviceConfig);
        return obj.send(endPoint, params);
    },
    ajaxHandler(data, isError = false) {
        wx.hideLoading();
        if(data && /^200$/.test(data.statusCode)) {
            return true;
        } else {
            const msg = data.info || data.message || "未知错误";
            wx.showModal({
                content: msg,
                showCancel: false,
                confirmText: "关闭"
            });
            return false;
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
                    typeof fn === "function" && fn();
                }
            }).catch((err) => {
                this.ajaxHandler(err, true);
            });
        }
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