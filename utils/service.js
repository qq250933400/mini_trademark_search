import { Common } from "./common.js";

export const setServiceConfig = (app, configData) => {
    app.globalData.serviceConfig = configData;
    return configData;
}

export class Service extends Common {
    configData = {};
    constructor(app) {
        super();
        this.configData = app.globalData.serviceConfig;
    }
    setConfig(configData) {
        this.configData = configData;
    }
    send(endPoint, params) {
        var endPointData = this.getEndPoint(endPoint);
        if (endPointData) {
            return new Promise(function (resolve, reject) {
                wx.request({
                    url: endPointData.url,
                    header: endPointData.header || {
                        "content-type": "application/json;charset=utf8;"
                    },
                    method: endPointData.type,
                    data: params,
                    dataType: "json",
                    success: function (res) {
                        if(res.statusCode === 200) {
                            resolve(res.data);
                        } else {
                            reject({
                                status: res.statusCode,
                                message: res.errMsg
                            });
                        }
                    },
                    fail: function (err) {
                        reject(err);
                    }
                });
            });
        }
        else {
            return Promise.reject({
                status: 500,
                success: false,
                message: "Can not find the endPoint from serviceConfig"
            });
        }
    }
    getEndPoint = function (endPoint) {
        var arr = (endPoint || "").split(".");
        var nStr = arr[0] || "";
        var id = arr[1] || "";
        var nData = this.configData[nStr];
        if (nData) {
            var endPointData = nData.endPoints[id];
            if (endPointData) {
                var host = nData.isDev ? nData.devUrl : nData.prodUrl;
                endPointData = JSON.parse(JSON.stringify(endPointData));
                endPointData.url = host + endPointData.url;
                return endPointData;
            }
        }
        return null;
    };
}
