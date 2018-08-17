/**
 * Created by kevin on 2017/11/2.
 */
apiready = function() {
    new Vue({
        el: "#list",
        data: {
            isClick: false,
            items: [],
            modelJson: {},
            equipmentNameArr: [],
            configurationtimeArr: []
        },
        created: function() {
            var param = api.pageParam;
            var num = parseInt(param.number); //长度
            for (var i = 0; i < num; i++) {
                var tempjson = {};
                if (JSON.stringify(param.editUnitObj) == '{}') {
                    tempjson["equipmentName"] = "";
                    tempjson["configurationtime"] = "";
                }else{
                  tempjson["equipmentName"] = param.editUnitObj.equipmentName[i];
                  tempjson["configurationtime"] = param.editUnitObj.allocationTime[i];
                }
                this.items.push(tempjson)
            }
        },
        methods: {
            del: function(index) {
                var that = this;
                api.confirm({
                    title: '警告',
                    msg: '是否删除该数据',
                    buttons: ['确定', '取消']
                }, function(ret, err) {
                    if (ret) {
                        var i = ret.buttonIndex;
                        if (i == 1) {
                            that.items.splice(index, 1);
                        }
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            },
            chooseTime: function(index) {
                var that = this;
                if (!this.isBrowser) {
                    UICore.openTimeComponent2(this.items[index].configurationtime);
                    api.addEventListener({
                        name: 'buildingTime'
                    }, function(ret, err) {
                        if (ret) {
                            that.items[index].configurationtime = ret.value.key1;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            save: function() {
                for (var num in this.items) {
                    this.equipmentNameArr.push(this.items[num].equipmentName);
                    this.configurationtimeArr.push(this.items[num].configurationtime);
                }
                this.modelJson.equipmentName = this.equipmentNameArr;
                this.modelJson.allocationTime = this.configurationtimeArr;
                UICore.sendEvent("EditEquipment", this.modelJson);
                api.closeWin();
            }
        },
        closeWin:function(){
            api.closeWin();
        },
        components: {
            "cellComponent": {
                props: ['celltitle', 'myclass'],
                template: "#cellInfo",
            }
        }
    })
}
