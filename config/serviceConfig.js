
const setServiceConfig = require("../utils/service").setServiceConfig;

module.exports = (app) => {
    return setServiceConfig(app, {
        trademark: {
            devUrl: "http://localhost/api/public/index.php",
            prodUrl: "http://www.uzhutm.com/public/index.php",
            isDev: true,
            endPoints: {
                login: {
                    url: "/mini/trademark/login/index",
                    type: "POST"
                },
                search: {
                    url: "/mini/trademark/search/index",
                    type: "POST"
                },
                detail: {
                    url:"/mini/trademark/search/detail",
                    type: "POST"
                }
            }
        }
    });
}
