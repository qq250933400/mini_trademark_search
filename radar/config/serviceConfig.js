
const setServiceConfig = require("../utils/service").setServiceConfig;

module.exports = (app) => {
    return setServiceConfig(app, {
        trademark: {
            devUrl: "http://localhost/api/public/index.php",
            prodUrl: "https://www.uzhutm.com/public/index.php",
            isDev: false,
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
                },
                watchList: {
                    url: "/min/trademark/radar/watch/list",
                    type: "POST"
                },
                watchDetail: {
                    url: "/min/trademark/radar/watch/detail",
                    type: "POST"
                },
                latestTask: {
                    url: "/min/trademark/radar/task/latestList",
                    type: "POST"
                },
                allTask: {
                    url: "/min/trademark/radar/task/allList",
                    type: "POST"
                },
                departments: {
                    url: "/min/trademark/radar/index/departments",
                    type: "POST"
                },
                taskFlow: {
                    url: "/min/trademark/radar/task/flow",
                    type: "POST"
                },
                sendEmail: {
                    url: "/min/trademark/radar/task/sendEmail",
                    type: "POST"
                },
                connect: {
                    url: "/min/trademark/radar/index/connect",
                    type: "POST"
                },
                trademarkSearch: {
                    url: "/mini/trademark/search/index",
                    type: "POST"
                },
                SBWDetail: {
                    url: "/mini/trademark/search/detail",
                    type: "POST"
                }
            }
        }
    });
}
