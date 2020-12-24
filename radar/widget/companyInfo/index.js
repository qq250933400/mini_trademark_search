// widget/companyInfo/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        hasAll: {
            type: "boolean",
            value: false
        }
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
            this.loadDepartments(itemData);
        },
        onMaskTap() {
            this.setData({
                visible: false
            });
        },
        loadDepartments(comany) {
            const app = getApp();
            app.ajax("trademark.departments", {
                companyId: comany.id
            }).then((resp) => {
                const listData = resp.data || [];
                if(app.ajaxHandler(resp)) {
                    wx.setStorageSync('departments', resp.data);
                } else {
                    wx.setStorageSync('departments', []);
                }
                typeof app.onDepartmentChange === "function" && app.onDepartmentChange(listData);
            }).catch((err) => {
                console.log(err);
            });
        }
    },
    lifetimes: {
        created() {
            console.log("Attachecd company component");
        },
        ready() {
            const app = getApp();
            const listData = app.globalData.companyInfo || [];
            app.onCompanyLoaded = (companyList) => {
                const newData = this.properties.hasAll ? [{
                    id: -1,
                    name: "全部公司"
                }] : [];
                companyList.map((com) => {
                    newData.push({
                        name: com.companyName,
                        id: com.id
                    });
                });
                this.setData({
                    companyList:newData
                });
                console.log("CompanyLoadComplete");
            }
            const newData = this.properties.hasAll ? [{
                id: -1,
                name: "全部公司"
            }] : [];
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
            let oldData = wx.getStorageSync('company');
            if(!this.properties.hasAll && oldData.id < 0) {
                oldData = newData[0];
            }
            if(!oldData) {
                if(newData[0]) {
                    wx.setStorageSync('company', newData[0]);
                    this.triggerEvent("change", {
                        data: newData[0]
                    });
                    this.loadDepartments(oldData);
                }
            } else {
                this.setData({
                    choseCompany: oldData
                });
                this.loadDepartments(oldData);
            }
        }
    }
})
