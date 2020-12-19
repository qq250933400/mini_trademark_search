// widget/types/index.js
import typesJson, { trademarkStatus } from "../../config/types.js";
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        visible: {
            type: "boolean",
            value: false
        },
        selectedData: {
            type: "Array",
            value: []
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        typesData: typesJson,
        showTypes: false,
        choseData: []
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onClose() {
            this.setData({
                showTypes: false
            });
            this.triggerEvent("close", {});
        },
        handleOnTypeTap(evt) {
            const choseData = JSON.parse(JSON.stringify(this.data.choseData || []));
            const itemData = evt.currentTarget.dataset;
            const itemIndex = choseData.indexOf(itemData.code);
            const typeData = JSON.parse(JSON.stringify(typesJson));
            if(itemIndex>=0) {
                choseData.splice(itemIndex, 1);
            } else {
                choseData.push(itemData.code);
            }
            for(const type of typeData) {
                type.checked = type.code === itemData.code;// choseData.indexOf(type.code) >= 0;
            }
            this.setData({
                choseData: [itemData.code],
                typesData: typeData,
                showTypes: false
            });
            this.triggerEvent("change", {
                code: itemData.code
            });
        }
    },
    lifetimes: {
        ready(){
            this.setData({
                showTypes: this.properties.visible
            });
        }
    },
    observers: {
        visible(value) {
            this.setData({
                showTypes: value
            });
        },
        selectedData(val) {
            const typeData = JSON.parse(JSON.stringify(typesJson));
            for(const type of typeData) {
                type.checked = val.indexOf(type.code) >= 0;
            }
            this.setData({
                choseData: val || [],
                typesData: typeData
            });
        }
    }
})
