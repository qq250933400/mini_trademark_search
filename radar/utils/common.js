import { StaticCommon } from "./StaticCommon.js";
export class Common {
    getType(val) {
        return Object.prototype.toString.call(val);
    }
    isEmpty(val) {
        return undefined === val || null === val || (this.getType(val) === "[object String]" && val.length <= 0);
    }
    getValue(data, key, defaultValue) {
        return StaticCommon.getValue(data, key, defaultValue);
    }
    checkLogin(){
        const token = wx.getStorageSync("token");
        return true;// !StaticCommon.isEmpty(token);
    }
    startLogin(fn){
     
        const app = getApp();
        wx.showLoading({
            title: "正在登录"
        });
        wx.login({
            success: (res) => {
                console.log(res);
                if (res.errMsg === "login:ok") {
                    wx.getUserInfo({
                        success: (info) => {
                            app.ajax("trademark.login", {
                                wxCode: res.code,
                                data: info
                            }).then((resp) => {
                                wx.hideLoading();
                                if(resp.success) {
                                    const token = resp.token;
                                    const app = getApp();
                                    app.globalData.token = token;
                                    app.globalData.userInfo = info.userInfo;
                                    wx.setStorageSync("token", token);
                                    typeof fn === "function" && fn(token);
                                }
                            }).catch((error) => {
                                wx.hideLoading();
                                wx.showModal({
                                    content: error.statusText || error.info || error.message || "登录失败",
                                    confirmText: "关闭"
                                });
                                console.error(error);
                            });
                        },
                        fail: (err) => {
                            wx.showModal({
                                content: err.errMsg,
                            });
                        }
                    });
                } else {
                    throw new Error(res.errMsg);
                }
            },
            fail: (err) => {
                wx.hideLoading();
                wx.showModal({
                    content: '登录失败：' + err.errMsg,
                });
            }
        });
    }
}