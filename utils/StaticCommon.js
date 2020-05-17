"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StaticCommon = /** @class */ (function () {
    function StaticCommon() {
    }
    StaticCommon.getType = function (val) {
        return Object.prototype.toString.call(val);
    };
    StaticCommon.isString = function (val) {
        return StaticCommon.getType(val) === "[object String]";
    };
    StaticCommon.isObject = function (val) {
        return StaticCommon.getType(val) === "[object Object]";
    };
    StaticCommon.isArray = function (val) {
        return StaticCommon.getType(val) === "[object Array]";
    };
    StaticCommon.isNumeric = function (val) {
        return !isNaN(val);
    };
    StaticCommon.isDOM = function (val) {
        return /^(\[object\s*)HTML([a-zA-Z]*)(Element\])$/.test(StaticCommon.getType(val));
    };
    StaticCommon.isSVGDOM = function (val) {
        return /^\[object\sSVG([a-zA-Z]*)Element\]$/.test(StaticCommon.getType(val));
    };
    StaticCommon.isFunction = function (val) {
        return StaticCommon.getType(val) === "[object Function]";
    };
    StaticCommon.isNodeList = function (val) {
        return StaticCommon.getType(val) === "[object NodeList]";
    };
    StaticCommon.isRegExp = function (val) {
        return StaticCommon.getType(val) === "[object RegExp]";
    };
    StaticCommon.isEmpty = function (val) {
        return val === undefined || val === null || (StaticCommon.isString(val) && val.length <= 0);
    };
    StaticCommon.isGlobalObj = function (val) {
        return this.getType(val) === "[object global]";
    };
    // tslint:disable-next-line:no-shadowed-variable
    StaticCommon.isEqual = function (a, b) {
        if (a === b) {
            return a !== 0 || 1 / a === 1 / b;
        }
        if (a == null || b == null) {
            return a === b;
        }
        var classNameA = StaticCommon.getType(a), classNameB = StaticCommon.getType(b);
        if (classNameA !== classNameB) {
            return false;
        }
        else {
            switch (classNameA) {
                case "[object RegExp]":
                case "[object String]":
                    return "" + a === "" + b;
                case "[object Number]":
                    if (+a !== +a) {
                        return +b !== +b;
                    }
                    return +a === 0 ? 1 / +a === 1 / b : +a === +b;
                case "[object Date]":
                case "[object Boolean]":
                    return +a === +b;
            }
            if (classNameA === "[object Object]") {
                var propsA = Object.getOwnPropertyNames(a), propsB = Object.getOwnPropertyNames(b);
                if (propsA.length !== propsB.length) {
                    return false;
                }
                else {
                    for (var i = 0; i < propsA.length; i++) {
                        var propName = propsA[i];
                        if (a[propName] !== b[propName]) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            if (classNameA === "[object Array]") {
                return a.toString() === b.toString();
            }
        }
    };
    StaticCommon.sleepCall = function (fn, timeout, obj) {
        if (typeof fn === "function") {
            // let handler: number | null | undefined = null;
            var tim = timeout || 200;
            var sleep = function () {
                if (obj) {
                    fn.call(obj);
                }
                else {
                    fn();
                }
                // handler !== null && clearTimeout(handler);
            };
            setTimeout(sleep, tim);
        }
    };
    StaticCommon.getValue = function (data, key, defaultValue) {
        var keyValue = key !== undefined && key !== null ? key : "";
        if (/\./.test(keyValue)) {
            var keyArr = keyValue.split(".");
            var isFind = false;
            var index = 0;
            var keyStr = "";
            var tmpData = data;
            while (index <= keyArr.length - 1) {
                keyStr = keyArr[index];
                isFind = index === keyArr.length - 1;
                if (StaticCommon.isArray(tmpData) && StaticCommon.isNumeric(keyStr)) {
                    keyStr = parseInt(keyStr, 10);
                }
                if (!isFind) {
                    var nextKey = keyArr[keyArr.length - 1];
                    if (StaticCommon.isArray(tmpData) || StaticCommon.isObject(tmpData) || StaticCommon.isGlobalObj(tmpData)) {
                        //
                        tmpData = tmpData[keyStr];
                    }
                    if (tmpData && index === keyArr.length - 2) {
                        if (nextKey === "key") {
                            tmpData = tmpData.key;
                            isFind = true;
                        }
                        else if (nextKey === "length") {
                            tmpData = tmpData.length;
                            isFind = true;
                        }
                    }
                }
                else {
                    tmpData = tmpData ? tmpData[keyStr] : undefined;
                }
                if (isFind) {
                    break;
                }
                index++;
            }
            return isFind ? (undefined !== tmpData ? tmpData : defaultValue) : defaultValue;
        }
        else {
            var rResult = data ? data[keyValue] : undefined;
            return data ? (undefined !== rResult ? rResult : defaultValue) : defaultValue;
        }
    };
    /**
     * 给指定对象设置属性值
     * @param data 设置属性值对象
     * @param key 设置属性key,属性key有多层可使用.区分
     * @param value 设置属性值
     * @param fn 自定义设置值回调
     */
    StaticCommon.setValue = function (data, key, value, fn) {
        var keyValue = key !== undefined && key !== null ? key : "";
        if (/\./.test(keyValue)) {
            var keyArr = keyValue.split(".");
            var isFind = false;
            var index = 0;
            var keyStr = "";
            var tmpData = data;
            while (index < keyArr.length - 1) {
                keyStr = keyArr[index];
                isFind = index === keyArr.length - 2;
                if (isFind && this.isObject(tmpData[keyStr])) {
                    tmpData = tmpData[keyStr];
                    break;
                }
                else {
                    if (!this.isFunction(fn)) {
                        if (this.isEmpty(tmpData[keyStr])) {
                            tmpData[keyStr] = {};
                            tmpData = tmpData[keyStr];
                        }
                        else {
                            // tslint:disable-next-line:no-console
                            console.error("设置错误节点不能设置内容！");
                            break;
                        }
                    }
                    else {
                        if (this.isEmpty(tmpData[keyStr])) {
                            fn(tmpData, keyStr);
                            tmpData = tmpData[keyStr];
                        }
                        else {
                            // tslint:disable-next-line:no-console
                            console.error("设置错误节点不能设置内容！");
                            break;
                        }
                    }
                }
                index++;
            }
            if (isFind && this.isObject(tmpData)) {
                if (!this.isFunction(fn)) {
                    tmpData[keyArr[keyArr.length - 1]] = value;
                }
                else {
                    fn(tmpData, keyArr[keyArr.length - 1], value);
                }
                return true;
            }
        }
        else {
            if (!this.isFunction(fn)) {
                data[keyValue] = value;
            }
            else {
                fn(data, keyValue, value);
            }
            return true;
        }
        return false;
    };
    /**
     * 获取随机ID
     */
    StaticCommon.getRandomID = function () {
        var now = new Date();
        var year = now.getFullYear().toString(), month = now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1).toString() : (now.getMonth() + 1).toString(), date = now.getDate() < 10 ? "0" + now.getDate().toString() : now.getDate().toString(), hour = now.getHours() < 10 ? ["0", now.getHours()].join("") : now.getHours().toString(), minute = now.getMinutes() < 10 ? ["0", now.getMinutes()].join("") : now.getMinutes().toString(), second = now.getSeconds() < 10 ? ["0", now.getSeconds()].join("") : now.getSeconds().toString(), reSecond = now.getMilliseconds();
        var randValue = parseInt((Math.random() * 9999 + 1000).toString(), 10);
        return [year, month, date, hour, minute, second, reSecond, randValue].join("");
    };
    /**
     * 字符串有连接符-将自动转换成已首字母大写
     * @param val 转换文本
     * @param firstUpperCase 是否大写
     */
    StaticCommon.toHumpStr = function (val, firstUpperCase) {
        if (!this.isEmpty(val)) {
            var vStr = val.replace(/(^\-)|(\-$)/, "");
            var vArr = vStr.split("-");
            for (var i = 0; i < vArr.length; i++) {
                if ((i === 0 && firstUpperCase) || i > 0) {
                    vArr[i] = vArr[i].substr(0, 1).toUpperCase() + vArr[i].substr(1);
                }
            }
            return vArr.join("");
        }
        else {
            return val;
        }
    };
    StaticCommon.humpToStr = function (val) {
        if (!this.isEmpty(val)) {
            var vStr = val.substr(0, 1).toLowerCase() + val.substr(1);
            var rStr = vStr.replace(/([A-Z])/g, function ($1) {
                return "-" + $1.toLowerCase();
            });
            return rStr;
        }
        return val;
    };
    StaticCommon.extend = function (desc, src, setReadOnly, ignoreKeys) {
        if (!setReadOnly) {
            if (this.isObject(desc) && this.isObject(src)) {
                if (Object.assign) {
                    Object.assign(desc, src);
                }
                else {
                    // tslint:disable-next-line:forin
                    for (var key in src) {
                        if (!ignoreKeys || ignoreKeys.indexOf(key) < 0) {
                            desc[key] = src[key];
                        }
                    }
                }
            }
        }
        else {
            if (this.isObject(desc) && this.isObject(src)) {
                // tslint:disable-next-line:forin
                for (var key in src) {
                    if (!ignoreKeys || ignoreKeys.indexOf(key) < 0) {
                        // 已经存在的属性需要使用delete删除，防止redine error问题
                        if (desc.hasOwnProperty(key)) {
                            delete desc[key];
                        }
                        this.defineReadOnlyProperty(desc, key, src[key]);
                    }
                }
            }
        }
        return desc;
    };
    StaticCommon.merge = function (obj1, obj2) {
        var result = {};
        if (obj1 && !obj2) {
            result = obj1;
        }
        else if (!obj1 && obj2) {
            result = obj2;
        }
        else if (obj1 && obj2) {
            if (this.isObject(obj1)) {
                // tslint:disable-next-line:forin
                for (var key in obj1) {
                    result[key] = obj1[key];
                }
            }
            if (this.isObject(obj2)) {
                for (var sKey in obj2) {
                    if (!result.hasOwnProperty(sKey)) {
                        result[sKey] = obj2[sKey];
                    }
                }
            }
        }
        return result;
    };
    /**
     * 将字符串转转换成对应的数据类型，遇到true|false转换成bool类型，遇到数字文本转换成数字类型数据
     * @param data 要转换的数据
     */
    StaticCommon.val = function (data) {
        if (this.isString(data)) {
            if (!isNaN(data)) {
                return (data.indexOf(".") >= 0 ? parseFloat(data) : parseInt(data, 10));
            }
            else {
                return (/^(true|false)$/.test(data) ? Boolean(data) : data);
            }
        }
        else {
            return data;
        }
    };
    StaticCommon.defineReadOnlyProperty = function (obj, propertyKey, propertyValue) {
        (function (paramObj, paramPropertyKey, paramPropertyValue) {
            paramObj && Object.defineProperty(paramObj, paramPropertyKey, {
                configurable: true,
                enumerable: true,
                value: paramPropertyValue,
                writable: false
            });
        })(obj, propertyKey, propertyValue);
    };
    StaticCommon.launchFullscreen = function (element) {
        if (element.requestFullscreen) {
            // tslint:disable-next-line: no-floating-promises
            element.requestFullscreen();
        }
        else if (element["mozRequestFullScreen"]) {
            element["mozRequestFullScreen"]();
        }
        else if (element["webkitRequestFullscreen"]) {
            element["webkitRequestFullscreen"]();
        }
        else if (element["msRequestFullscreen"]) {
            element["msRequestFullscreen"]();
        }
    };
    StaticCommon.exitFullscreen = function () {
        if (document.exitFullscreen) {
            // tslint:disable-next-line: no-floating-promises
            document.exitFullscreen();
        }
        else if (document["mozCancelFullScreen"]) {
            document["mozCancelFullScreen"]();
        }
        else if (document["webkitExitFullscreen"]) {
            document["webkitExitFullscreen"]();
        }
    };
    StaticCommon.isFullScreen = function () {
        return document["isFullScreen"] || document["mozIsFullScreen"] || document["webkitIsFullScreen"];
    };
    StaticCommon.guid = function () {
        var S4 = function () {
            // tslint:disable-next-line: no-bitwise
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substr(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4());
    };
    StaticCommon.getUri = function (strValue) {
        var str = strValue || "";
        var strArr = [];
        var result = {};
        str = str.replace(/^\?/, "").replace(/\#[\s\S]*$/, "");
        strArr = str.split("&");
        // tslint:disable-next-line: forin
        for (var key in strArr) {
            var tmpItem = strArr[key] || "";
            var tmpM = tmpItem.match(/^\s*([\S]*)\s*=\s*([\S]*)$/);
            if (tmpM) {
                result[tmpM[1]] = !StaticCommon.isEmpty(tmpM[2]) ? decodeURIComponent(tmpM[2]) : "";
            }
        }
        return result;
    };
    StaticCommon.getQuery = function (key) {
        return StaticCommon.getUri()[key];
    };
    StaticCommon.toQuery = function(obj){
        const result = [];
        for (var key in obj) {
            if (obj[key]) {
                var val = encodeURIComponent(obj[key].toString());
                result.push(key + "=" + val);
            }
        }
        return result.join("&");
    }
    return StaticCommon;
}());
exports.StaticCommon = StaticCommon;
exports.defineReadonlyProperty = function (target, propertyKey, propertyValue) {
    Object.defineProperty(target, propertyKey, {
        configurable: false,
        enumerable: true,
        value: propertyValue,
        writable: false
    });
};
