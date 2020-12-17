import { Common } from "./common.js";

export class I18n extends Common {
    configData = {};
    locale = "zh";
    localeData = {};
    constructor(config) {
        super();
        this.configData = config;
    }
    setConfig(config) {
        this.configData = config;
        this.localeData = config[this.locale];
    }
    setLocale(locale) {
        this.locale = locale;
        this.localeData = this.configData[this.locale];
    }
    getData(id) {
        return this.localeData ? this.getValue(this.localeData, id) : undefined;
    }
    message(id, defaultValue) {
        return this.getData(id) || defaultValue;
    }
}