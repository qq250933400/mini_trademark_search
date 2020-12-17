import {
    StaticCommon
} from "./StaticCommon.js";

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const toQuery = (obj) => {
    const result = [];
    for(var key in obj) {
        if(obj[key]) {
            var val = encodeURIComponent(obj[key].toString());
            result.push(key+"=" + val);
        }
    }
    return result.join("&");
}

module.exports = {
    formatTime: formatTime,
    getValue: StaticCommon.getValue,
    toQuery
}