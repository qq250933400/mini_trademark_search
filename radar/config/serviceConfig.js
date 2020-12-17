
const setServiceConfig = require("../utils/service").setServiceConfig;

module.exports = (app) => {
    return setServiceConfig(app, {
        trademark: {
            devUrl: "http://localhost/api/public/index.php",
            prodUrl: "https://bj.uzhutm.com/public/index.php",
            isDev: false,
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
                },
                uploadImage: {
                    url: "/mini/trademark/search/upload",
                    type: "POST"
                },
                searchImage: {
                    url: "/min/trademark/search/image",
                    type: "POST"
                },
                register: {
                    url: "/min/trademark/index/register",
                    type: "POST"
                },
                searchType: {
                    url: "/mini/trademark/search/types",
                    type: "POST"
                },
                searchSubTypes: {
                    url: "/min/trademark/search/subTypes",
                    type: "POST"
                }
            }
        }
    });
}
