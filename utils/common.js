import { StaticCommon } from "./StaticCommon.js";
export class Common {
    getType(val) {
        return Object.prototype.toString();
    }
    isEmpty(val) {
        return undefined === val || null === val || (this.getType(val) === "[object String]" && val.length <= 0);
    }
    getValue(data, key, defaultValue) {
        return StaticCommon.getValue(data, key, defaultValue);
    }
}