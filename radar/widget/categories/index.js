// widget/categories/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        data: {
            type: "array",
            value: []
        },
        defaultValue: {
            type: "any"
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        listData: [],
        choseItem: null
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onItemTab: function(evt) {
            const currentItem = evt.currentTarget.dataset;
            this.setData({
                choseItem: currentItem
            });
            this.triggerEvent("change", {
                data: currentItem
            }, {
                bubbles: false
            });
        }
    },
    lifetimes: {
        ready: function(opt) {
            this.setData({
                listData: this.properties.data
            });
        }
    },
    observers: {
        defaultValue(value) {
            this.triggerEvent("change", {
                data: value
            });
            this.setData({
                choseItem: value
            });
        }
    }
})
