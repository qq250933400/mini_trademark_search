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
        choseItem: null,
        visible: false
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onItemTab: function(evt) {
            const currentItem = evt.currentTarget.dataset;
            const children = currentItem.children || [];
            evt.cancelBubble = true;
            console.log(children);
            if(children.length <= 0) {
                this.setData({
                    choseItem: currentItem,
                    choseTabItem: null,
                    choseTab: null
                });
                this.triggerEvent("change", {
                    data: currentItem
                }, {
                    bubbles: false
                });
            } else {
                this.setData({
                    visible: true,
                    menuData: children,
                    choseTab: currentItem
                });
            }
        },
        onClick(evt) {
            const itemData = evt.currentTarget.dataset;
            evt.cancelBubble = true;
            this.setData({
                choseItem: this.data.choseTab,
                choseTabItem: itemData,
                visible: false
            });
            this.triggerEvent("change", {
                data: itemData
            });
        },
        onMaskTap() {
            this.setData({
                visible: false
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
        },
        data(value) {
            this.setData({
                listData: value
            });
        }
    }
})
