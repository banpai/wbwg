/**
 * Created by kevin on 2017/7/13.
 */
apiready = function() {

    new Vue({
        el: "#list",
        data: {
            isNew: true, //是否是新增
            isBrowser: false, //是否是浏览模式
            isClick: false,
            params: {}, //传参
            idz: "",

            courtyardName: "", //小区名称
            address: "", //建筑地址
            buildnum: "", // 建筑栋数
            developunit: "", //开发单元
            constructunit: "", //建设单位
            completetime: "", //建成时间
            completetimeId: "",
            floorarea: "", //占地面积
            greenArea: "", //绿化面积
            structureArea: "", //建筑面积
            rainwell: "", //雨水井
            Sewagewell: "", //污水井
            contactwell: "", //通讯设施井
            heatwell: "", //暖气井
            waterwell: "", //自来水井
            fitplace: "", //健身场所
            fitplaceId: "",
            fitequip: "", //健身器材
            modelJson: {}, //健身器材相关
            allocaunit: "", //配置单位
            electronicsystem: "",
            electronicsystemId: "", //电子监控系统
            camera: "", //摄像头
            equipstandard: "", //设备标准
            equipstandardId: "",
            allocaunits: "", //配置单元
            expandTab_arr: [],
            completetime_arr: [],
            fitplace_arr: [],
            electronicsystem_arr: [],
            equipstandard_arr: [],
            expandjson: {},
            expandstr: "", //表单预览数据
            edited: false,
            chcek: "请选择"
        },
        beforeCreate: function() {
            UICore.showLoading("信息加载中...", "请稍候");
        },
        created: function() {
            var param = api.pageParam;
            var that = this; //保存指针供回调使用
            if (param && param.title == "courtyardResult") { //查询/编辑``
                this.isBrowser = true;
                this.isClick = this.isBrowser;
                this.isNew = false;
                this.params = param.infos;
                $api.text($api.byId('pkh_add_su'), '编辑');
                this.chcek = "查看";
            } //新增  新增时初始化建筑信息 且 建筑信息不可编辑 可编辑的都是部分房屋信息
            var jsonData = JSON.parse($api.getStorage('settingdata'));
            jsonData.data.forEach(function(value) {
                if (value.parentKey == "BD_Basic_FitnessPlace") { //健身场所
                    that.fitplace_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };
                if (value.parentKey == "BD_Basic_EquipmentStandard") { //设备标准
                    that.equipstandard_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };
                if (value.parentKey == "BD_Basic_ElectronicMonitoring") {
                    that.electronicsystem_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };
            }); //配置文件循环结束
            if (that.isBrowser) { //在浏览状态下 显示数据
                that.idz = that.params.id;
                that.courtyardName = that.params.name; //小区名称
                that.address = that.params.address; //建筑地址
                that.buildnum = that.params.buildingNumber; // 建筑栋数
                that.developunit = that.params.developmentUnit; //开发单元
                that.constructunit = that.params.constructionUnit; //建设单位
                that.completetime = that.params.completionTime; //建成时间
                that.floorarea = that.params.areaCovered; //占地面积
                that.greenArea = that.params.afforestedArea; //绿化面积
                that.structureArea = that.params.builtArea; //建筑面积
                that.rainwell = that.params.rainWell; //雨水井
                that.Sewagewell = that.params.sewageWell; //污水井
                that.contactwell = that.params.communicationWell; //通讯设施井
                that.heatwell = that.params.heatingWell; //暖气井
                that.waterwell = that.params.spontaneousWell; //自来水井
                that.allocaunit = that.params.fitnessAllocationUnit; //配置单位(健身器材)
                that.camera = that.params.camera; //摄像头
                that.allocaunits = that.params.cameraAllocationUnit; //配置单位

                that.fitequip = that.params.fitnessEquipment; //健身器材
                that.modelJson.equipmentName = that.params.equipmentName;
                that.modelJson.allocationTime = that.params.allocationTime;
                // that.initBuiInfo(buiInfo.id);
                var index = parseInt(that.params.fitnessPlace);
                if (!isNaN(index) && index < 3) {
                  for(var num in that.fitplace_arr){
                    if(that.fitplace_arr[num].key==index){
                      that.fitplace_arr[num].status = "selected";
                      that.fitplace = that.fitplace_arr[num].text;
                    }
                  }
                }; // 健身场所
                var index = parseInt(that.params.equipmentStandard);
                if (!isNaN(index)) {
                  for(var num in that.equipstandard_arr){
                    if(that.equipstandard_arr[num].key==index){
                      that.equipstandard_arr[num].status = "selected";
                      that.equipstandard = that.equipstandard_arr[num].text;
                    }
                  }
                }; // 设备标准
                var index = parseInt(that.params.electronicMonitoring);
                if (!isNaN(index)) {
                  for(var num in that.electronicsystem_arr){
                    if(that.electronicsystem_arr[num].key==index){
                      that.electronicsystem_arr[num].status = "selected";
                      that.electronicsystem = that.electronicsystem_arr[num].text;
                    }
                  }
                }; //电子监控
            } else { //ret.status
            };
            <!--获取扩展信息开始-->
            console.log(UICore.serviceUrl + 'mobile/mobileDataCollection.shtml?act=getDynaBaseTab&data={baseKey:xqyl}');
            api.ajax({
                url: UICore.serviceUrl + 'mobile/mobileDataCollection.shtml?act=getDynaBaseTab&data={baseKey:xqyl}',
                method: 'get',
            }, function(ret, err) {
                if (ret.success) {
                    ret.data.forEach(function(value) {
                        that.expandTab_arr.push({
                            name: value.name,
                            english_name: value.english_name
                        });
                    });
                } else {
                    alert(JSON.stringify(err));

                }
            });
            <!--获取扩展信息结束-->
            api.hideProgress();
        },
        methods: {
            initBuiInfo: function(buildId) {
                var that = this;
                <!--获取建筑信息开始-->
                console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForBuilding.shtml?act=getBuildingInfo&data={buiId:' + buildId + '}');
                api.ajax({
                    url: UICore.serviceUrl + 'mobile/mobileInterfaceForBuilding.shtml?act=getBuildingInfo&data={buiId:' + buildId + '}',
                    method: 'get',
                }, function(ret, err) {
                    if (ret.success) {
                        ret.data.unitList.forEach(function(value) {
                            that.buildingUnit_arr.push({
                                text: value.unitName,
                                status: 'normal',
                                key: value.id,
                            });
                        });
                        ret.data.entityId
                    } else {
                        //alert( "加载建筑单元失败!" );
                        api.toast({
                            msg: '加载建筑单元失败!',
                            duration: 2000,
                            location: 'bottom'
                        });

                    }
                });
                <!--获取建筑信息结束-->
            },
            completetimef: function() {
                console.log("建成时间");
                var that = this;
                if (!this.isBrowser) {
                    UICore.openTimeComponent2(this.completetime);
                    api.addEventListener({
                        name: 'buildingTime'
                    }, function(ret, err) {
                        if (ret) {
                            that.completetime = ret.value.key1;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            fitplacef: function() {
                console.log("健身场所");
                if (!this.isBrowser) {
                    var that = this;
                    var defaultVal = this.fitplace; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.fitplace_arr.forEach(function(value, index, arr) {
                            if (value.text == that.fitplace) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.fitplace_arr, this.fitplace, "fitplace");
                    api.addEventListener({
                        name: 'fitplace'
                    }, function(ret, err) {
                        if (ret) {
                            that.fitplace = ret.value.key1;
                            that.fitplaceId = ret.value.key2;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            fitequipf: function() {
                var num = this.fitequip;
                var that = this;
                if (num != "") {
                    api.openWin({
                        name: 'EditEquipment',
                        url: './EditEquipment.html',
                        pageParam: {
                            number: num,
                            isBrowser: that.isBrowser,
                            editUnitObj: this.modelJson

                        }
                    });
                    api.addEventListener({
                        name: 'EditEquipment'
                    }, function(ret, err) {
                        if (ret) {
                            that.modelJson = ret.value.key1;
                            that.fitequip = that.modelJson.equipmentName.length;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                } else {
                    alert("请输入健身器材个数");
                }
            },
            equipstandardf: function() {
                console.log("设备标准");
                if (!this.isBrowser) {
                    var that = this;
                    var defaultVal = this.equipstandard; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.equipstandard_arr.forEach(function(value, index, arr) {
                            if (value.text == that.equipstandard) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.equipstandard_arr, this.equipstandard, "equipstandard");
                    api.addEventListener({
                        name: 'equipstandard'
                    }, function(ret, err) {
                        if (ret) {
                            that.equipstandard = ret.value.key1;
                            that.equipstandardId = ret.value.key2;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            electronicsystemf: function() {
                console.log("电子监控系统");
                if (!this.isBrowser) {
                    var that = this;
                    var defaultVal = this.electronicsystem; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.electronicsystem_arr.forEach(function(value, index, arr) {
                            if (value.text == that.electronicsystem) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.electronicsystem_arr, this.electronicsystem, "electronicsystem");
                    api.addEventListener({
                        name: 'electronicsystem'
                    }, function(ret, err) {
                        if (ret) {
                            that.electronicsystem = ret.value.key1;
                            that.electronicsystemId = ret.value.key2;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            expandselect: function(index, english_name, title) {
                var expandParams = this.params.extendAtt;
                var that = this;
                if (this.expandstr != "" && this.isNew) {
                    api.openWin({
                        name: 'dynamic',
                        url: '../dynamic.html',
                        vScrollBarEnabled: false,
                        pageParam: {
                            title: title,
                            name: english_name,
                            isNew: this.isNew,
                            id: this.id,
                            isBrowser: this.isBrowser,
                            attr: "{" + this.expandstr.substring(0, this.expandstr.length - 1) + "}"
                        }
                    });
                } else if (!this.isNew && this.edited) {
                    api.openWin({
                        name: 'dynamic',
                        url: '../dynamic.html',
                        vScrollBarEnabled: false,
                        pageParam: {
                            title: title,
                            name: english_name,
                            isNew: this.isNew,
                            edited: true,
                            id: this.id,
                            isBrowser: this.isBrowser,
                            attr: JSON.stringify(this.expandjson)
                        }
                    });
                } else {
                    api.openWin({
                        name: 'dynamic',
                        url: '../dynamic.html',
                        vScrollBarEnabled: false,
                        pageParam: {
                            title: title,
                            name: english_name,
                            isNew: this.isNew,
                            id: this.id,
                            isBrowser: this.isBrowser,
                            attr: expandParams
                        }
                    });
                }

                api.addEventListener({
                    name: 'population_json'
                }, function(ret, err) {
                    if (!that.isNew) {
                        that.expandjson = ret.value.key;
                        that.edited = ret.value.key2
                    } else {
                        that.doExpand(ret.value.key, index)
                    }
                });

            }, //动态表单选择结束
            doExpand: function(value, index) {
                var s = JSON.stringify(value);
                var json = eval('(' + s + ')');
                for (var key in json) { //上个页面的json
                    var t = JSON.stringify(json[key])
                    this.expandstr += t.substring(1, t.length - 1) + ",";
                }
                this.expandjson = eval('(' + "{" + this.expandstr.substring(0, this.expandstr.length - 1) + "}" + ')');
            },
            submit: function() {
                if (this.isBrowser) {
                    $api.text($api.byId('pkh_add_su'), '提交');
                    this.isBrowser = false;
                    this.isClick = this.isBrowser;
                    this.chcek = "请选择";
                } else {
                    if (this.checkValue()) {
                        this.submitForm();
                    }

                }
            },
            checkValue: function() {
                if (this.courtyardName == "" || this.courtyardName == null) {
                    api.toast({
                        msg: '小区名称不能为空',
                        duration: 2000,
                        location: 'bottom'
                    });
                    return false;
                };
                if (this.address == "" || this.address == null) {
                    api.toast({
                        msg: '建筑地址不能为空',
                        duration: 2000,
                        location: 'bottom'
                    });
                    return false;
                }
                if (this.buildnum == "" || this.buildnum == null) {
                    api.toast({
                        msg: '建筑栋数不能为空',
                        duration: 2000,
                        location: 'bottom'
                    });
                    return false;
                }
                if (this.developunit == "" || this.developunit == null) {
                    api.toast({
                        msg: '开发单位不能为空',
                        duration: 2000,
                        location: 'bottom'
                    });
                    return false;
                }
                return true;
            },
            submitForm: function() {
                var postjson = {}; //提交postjson
                var reslutjson = {}; //最终整合真正提交的json
                /* 基本房屋信息 */
                postjson.ENTITYID = this.params.entityId;
                postjson.GRIDID = this.params.gridId;
                if (!this.isNew) {
                    postjson.id = this.idz
                    postjson.houseid = this.params.houseid
                    postjson.data_area_code = $api.getStorage('userinf').dataAreaCode
                } else {
                    postjson.data_area_code = $api.getStorage('userinf').dataAreaCode;
                }

                postjson.name = this.courtyardName; //小区名称
                postjson.address = this.address; //建筑地址
                postjson.buildingNumber = this.buildnum; // 建筑栋数
                postjson.developmentUnit = this.developunit; //开发单元
                postjson.constructionUnit = this.constructunit; //建设单位
                postjson.completionTime = this.completetime; //建成时间
                postjson.areaCovered = this.floorarea; //占地面积
                postjson.afforestedArea = this.greenArea; //绿化面积
                postjson.builtArea = this.structureArea; //建筑面积
                postjson.rainWell = this.rainwell; //雨水井
                postjson.sewageWell = this.Sewagewell; //污水井
                postjson.communicationWell = this.contactwell; //通讯设施井
                postjson.heatingWell = this.heatwell; //暖气井
                postjson.spontaneousWell = this.waterwell; //自来水井
                postjson.fitnessPlace = this.fitplaceId;
                postjson.fitnessEquipment = this.fitequip; //健身器材
                postjson.equipmentName = this.modelJson.equipmentName; //健身器材名字
                postjson.allocationTime = this.modelJson.allocationTime; //健身器材时间


                postjson.fitnessAllocationUnit = this.allocaunit; //配置单位
                postjson.electronicMonitoring = this.electronicsystemId; //电子监控系统
                postjson.camera = this.camera; //摄像头
                postjson.equipmentStandard = this.equipstandardId;
                postjson.cameraAllocationUnit = this.allocaunits; //配置单元

                postjson.area = this.houseArea; //
                postjson.dataSource = 2; //

                reslutjson.residential = postjson;

                /* 扩展信息 */
                if (this.expandjson)
                    reslutjson.expand = this.expandjson;
                /* 其它信息 */
                var otherjson = {};
                otherjson.createUserId = $api.getStorage('userinf').accountId;
                reslutjson.common = otherjson;

                var json = JSON.stringify(reslutjson)
                console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForResidential.shtml?act=edit&data=' + json);
                api.ajax({
                    url: UICore.serviceUrl + 'mobile/mobileInterfaceForResidential.shtml?act=edit&data=' + json,
                    method: 'get',
                }, function(ret, err) {
                    if (ret) {
                        if (ret.success) {
                            api.toast({
                                msg: '保存成功',
                                duration: 3000,
                                location: 'bottom'
                            });
                            api.closeWin();
                        } else {
                            alert(ret.errorinfo);

                        }
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            },
            closeWin: function() {
                api.closeWin();
            }
        },
        components: {
            "cellComponent": {
                props: ['celltitle', 'myclass'],
                template: "#cellInfo",
            }
        }
    });
}
