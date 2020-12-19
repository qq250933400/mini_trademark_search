// widget/companyInfo/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        companyList: [],
        choseCompany: null,
        visible: false
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onSwtichCom() {
            this.data.companyList && this.data.companyList.length>1 && this.setData({
                visible: true
            });
        },
        onClick(evt) {
            const itemData = evt.currentTarget.dataset;
            this.setData({
                choseCompany: itemData,
                visible: false
            });
            wx.setStorageSync('company', itemData);
            this.triggerEvent("change", {
                data: itemData
            });
        }
    },
    lifetimes: {
        ready() {
            const app = getApp();
            const listData = app.globalData.companyInfo || [];
            const newData = [];
            listData.map((com) => {
                newData.push({
                    name: com.companyName,
                    id: com.id
                });
            });
            this.setData({
                companyList: newData,
                choseCompany: newData[0]
            });
            const oldData = wx.getStorageSync('company');
            if(!oldData) {
                if(newData[0]) {
                    wx.setStorageSync('company', newData[0]);
                    this.triggerEvent("change", {
                        data: newData[0]
                    });
                }
            } else {
                this.setData({
                    choseCompany: oldData
                });
            }
        }
    }
})
