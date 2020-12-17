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
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
    ajax: function(endPoint, params) {
        const obj = this.globalData.service;
        obj.setConfig(this.globalData.serviceConfig);
        return obj.send(endPoint, params);
    },
    getI18n: function(nodeKey, defaultValue) {
        return this.globalData.i18n.message(nodeKey, defaultValue);
    },
    globalData: {
        userInfo: null,
        serviceConfig: null,
        service: null,
        locale: "zh",
        i18n: null
    }
})