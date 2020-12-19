
const setServiceConfig = require("../utils/service").setServiceConfig;

module.exports = (app) => {
    return setServiceConfig(app, {
        trademark: {
            devUrl: "http://localhost/api/public/index.php",
            prodUrl: "https://bj.uzhutm.com/public/index.php",
            isDev: true,
            endPoints: {
                login: {
                    url: "/min/trademark/radar/login",
                    type: "POST"
                },
                search: {
                    url: "/min/trademark/radar/yapi/search",
                    type: "POST"
                },
                sendSMS: {
                    url: "/min/trademark/radar/sms",
                    type: "POST"
                },
                getCompanys: {
                    url: "/min/trademark/radar/getCompany",
                    type: "POST"
                },
                trademarkDetail: {
                    url: "/min/trademark/radar/detail/trademark",
                    type: "POST"
                }
            }
        }
    });
}
