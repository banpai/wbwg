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

            buildingName: "", //建筑名称
            unit: "", //单元(梯/区)
            unitId: "",
            layer: "", //所属楼层
            houseNum: "", //房号
            houseUse: "", //房屋用途
            houseUseId: "",
            actualUse: "", //实际用途
            actualUseId: "",
            houseArea: "", //房屋面积
            expandTab_arr: [], //扩展信息

            buildingUnit_arr: [], //建筑中唯一需要填写单元/去 下拉框
            houseUse_arr: [], //房屋用途下拉框数据
            actualUse_arr: [], //实际用途下拉框数据
            expandjson: {},
            expandstr: "", //表单预览数据
            edited: false,
            chcek:"请选择",//编辑时改为查看

            neighbourhood: "", //小区名称
            buildingNum: "", //楼号
            houseType: "", //户型
            regist: "", //入户登记时间
            carsNum: "", //车辆数
            plateNumber: "", //车牌号
            idNum: "", //屋主身份证
            houseowner: "", //屋主姓名

            againstthief: "", //防盗设施
            againstthiefId: "",
            cookingenergy: "", //主要炊事能源
            cookingenergyId: "",
            hotwatertype: "", //热水供应方式
            hotwatertypeId: "",
            waterapply: "", //供水
            waterapplyId: "",
            powerapply: "", //供电
            powerapplyId: "",
            heating: "", //取暖设施
            heatingId: "",
            shower: "", //卫浴设施
            showerId: "",
            roomtype: "", //房屋性质
            roomtypeId: "",
            propertytype: "", //产权证类别
            propertytypeId: "",

            againstthief_arr: [], //防盗设施数组
            cookingenergy_arr: [], //主要炊事能源数组
            hotwatertype_arr: [], //热水供应方式数组
            waterapply_arr: [], //供水数组
            powerapply_arr: [], //供电数组
            heating_arr: [], //取暖设施数组
            shower_arr: [], //卫浴设施数组
            roomtype_arr: [], //房屋性质数组
            propertytype_arr: [], //产权证类别数组
        },
        beforeCreate: function() {
            UICore.showLoading("信息加载中...", "请稍候");
        },
        created: function() {
            var param = api.pageParam;
            var that = this; //保存指针供回调使用
            if (param && param.title == "houseResult") { //查询/编辑``
                this.isBrowser = true;
                this.isClick = this.isBrowser;
                this.isNew = false;
                this.params = param.infos;
                $api.text($api.byId('pkh_add_su'), '编辑');
                this.chcek="查看";
            } //新增  新增时初始化建筑信息 且 建筑信息不可编辑 可编辑的都是部分房屋信息
            var jsonData = JSON.parse($api.getStorage('settingdata'));
            jsonData.data.forEach(function(value) {
                if (value.parentKey == "ResidentHouseUse") { //房屋用途
                    that.houseUse_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };
                if (value.parentKey == "ResidentActualUse") { //实际用途
                    that.actualUse_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };
                if (value.parentKey == "House_Security") { //防盗设施
                    that.againstthief_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };

                if (value.parentKey == "House_Energy") { //主要炊事能源
                    that.cookingenergy_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };

                if (value.parentKey == "House_rsgyfs") { //热水供应方式数组
                    that.hotwatertype_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };


                if (value.parentKey == "House_Water") { //供水数组
                    that.waterapply_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };
                if (value.parentKey == "House_Power") { //供电数组
                    that.powerapply_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };

                if (value.parentKey == "House_Heating") { //取暖设施数组
                    that.heating_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };
                if (value.parentKey == "House_Bathroom") { //卫浴设施数组
                    that.shower_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };

                if (value.parentKey == "House_HouseType") { //房屋性质数组
                    that.roomtype_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };
                if (value.parentKey == "House_PropertyCard") { //产权证类别数组
                    that.propertytype_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };
            }); //配置文件循环结束
            if (that.isBrowser) { //在浏览状态下 显示数据
                that.neighbourhood = that.params.residentialName; //小区名称
                that.buildingName = that.params.buiName; //建筑名称
                if (that.params.buiCode != "") {
                    that.buildingNum = that.params.buiCode; //楼号
                } else {
                    that.buildingNum = that.params.buiCustomCode;
                }
                that.houseType = that.params.huXing; //户型
                that.regist = that.params.rhdjsj; //入户登记时间
                that.carsNum = that.params.carNum; //车辆数
                that.plateNumber = that.params.carID; //车牌号
                that.idNum = that.params.idNumber; //屋主身份证
                that.houseowner = that.params.homeOwners; //屋主姓名
                that.unit = that.params.unitName; //单元(梯/区)
                that.layer = that.params.floorNum; //所属楼层
                that.houseNum = that.params.roomNum; //房号
                that.houseArea = that.params.area; //房屋面积
                that.unitId = that.params.unitId
                console.log(JSON.stringify(that.params));
                // that.initBuiInfo(buiInfo.id);
                var index = parseInt(that.params.useType);

                if (!isNaN(index) && index < 6) {
                    that.houseUse_arr[index - 1].status = "selected";
                    that.houseUse = that.houseUse_arr[index - 1].text;
                }; //房屋用途
                var index = parseInt(that.params.actualUseType);
                if (!isNaN(index)) {
                    that.actualUse_arr[index - 1].status = "selected";
                    that.actualUse = that.actualUse_arr[index - 1].text;
                }; //实际用途

                var value_arr=[];
                var index = that.params.fdss;
                var key_arr = index.split(",");
                for (var i = 0; i < key_arr.length; i++) {
                    if (key_arr[i] != "" && key_arr[i] != -1) {
                        that.againstthief_arr[key_arr[i] - 1].status = "selected";
                         value_arr.push(that.againstthief_arr[key_arr[i] - 1].text);
                    }
                }
                that.againstthief=value_arr.join(",");
                 //防盗设施
                var index = parseInt(that.params.zycsny);
                if (!isNaN(index)) {
                    that.cookingenergy_arr[index - 1].status = "selected";
                    that.cookingenergy = that.cookingenergy_arr[index - 1].text;
                }; //主要炊事能源
                var index = parseInt(that.params.rsgyfs);
                if (!isNaN(index)) {
                    that.hotwatertype_arr[index - 1].status = "selected";
                    that.hotwatertype = that.hotwatertype_arr[index - 1].text;
                }; //热水供应方式
                var index = parseInt(that.params.gongshui);
                if (!isNaN(index)) {
                    that.waterapply_arr[index - 1].status = "selected";
                    that.waterapply = that.waterapply_arr[index - 1].text;
                }; //供水
                var index = parseInt(that.params.gongdian);
                if (!isNaN(index)) {
                    that.powerapply_arr[index - 1].status = "selected";
                    that.powerapply = that.powerapply_arr[index - 1].text;
                }; //供电
                var index = parseInt(that.params.qnss);
                if (!isNaN(index)) {
                    that.heating_arr[index - 1].status = "selected";
                    that.heating = that.heating_arr[index - 1].text;
                }; //取暖设施
                var wyss_arr=[]
                var index = that.params.wyss;
                var key_arr = index.split(",");
                for (var i = 0; i < key_arr.length; i++) {
                    if (key_arr[i] != "" && key_arr[i] != -1) {
                        that.shower_arr[key_arr[i] - 1].status = "selected";
                        wyss_arr.push(that.shower_arr[key_arr[i] - 1].text);
                    }
                }
                that.shower=wyss_arr.join(",");
                //卫浴设施
                var index = parseInt(that.params.fwxz);
                if (!isNaN(index)) {
                    that.roomtype_arr[index - 1].status = "selected";
                    that.roomtype = that.roomtype_arr[index - 1].text;
                }; //房屋性质
                var index = parseInt(that.params.cqzlb);
                if (!isNaN(index)) {
                    that.propertytype_arr[index - 1].status = "selected";
                    that.propertytype = that.propertytype_arr[index - 1].text;

                }; //产权证类别

            } else { //ret.status
            };
            // <!--获取扩展信息开始-->
            // console.log(UICore.serviceUrl + 'mobile/mobileDataCollection.shtml?act=getDynaBaseTab&data={baseKey:FWXX}');
            // api.ajax({
            //     url: UICore.serviceUrl + 'mobile/mobileDataCollection.shtml?act=getDynaBaseTab&data={baseKey:FWXX}',
            //     method: 'get',
            // }, function(ret, err) {
            //     if (ret.success) {
            //         ret.data.forEach(function(value) {
            //             that.expandTab_arr.push({
            //                 name: value.name,
            //                 english_name: value.english_name
            //             });
            //         });
            //     } else {
            //         alert(JSON.stringify(err));
            //
            //     }
            // });
            // <!--获取扩展信息结束-->
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
                        console.log(JSON.stringify(ret.data));
                        ret.data.unitList.forEach(function(value) {
                            that.buildingUnit_arr.push({
                                text: value.unitName,
                                status: 'normal',
                                key: value.id,
                            });
                        });
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
            neighbourhoodf: function() {
                if (!this.isBrowser) {
                    var that = this;
                    api.openWin({
                        name: 'buildingQuery',
                        url: '../building/buildingQuery.html',
                        vScrollBarEnabled: false,
                        pageParam: {
                            from: 'fromHouse'
                        }
                    });
                    api.addEventListener({
                        name: 'houseforbuilding'
                    }, function(ret, err) {
                        if (ret) {
                            var buiInfo = ret.value.key1;
                            console.log(JSON.stringify(buiInfo));
                            that.buildingName = buiInfo.buiName; //建筑名称
                            that.neighbourhood = buiInfo.residentialName;
                            if (buiInfo.buiCode != "") {
                                that.buildingNum = buiInfo.buiCode;
                            } else {

                            }

                            that.initBuiInfo(buiInfo.id);
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            registf: function() {
                var that = this;
                if (!this.isBrowser) {
                    UICore.openTimeComponent2(this.regist);
                    api.addEventListener({
                        name: 'buildingTime'
                    }, function(ret, err) {
                        if (ret) {
                            that.regist = ret.value.key1;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            buildingf: function() {
                if (!this.isBrowser) {
                    var that = this;
                    api.openWin({
                        name: 'buildingQuery',
                        url: '../building/buildingQuery.html',
                        vScrollBarEnabled: false,
                        pageParam: {
                            from: 'fromHouse'
                        }
                    });
                    api.addEventListener({
                        name: 'houseforbuilding'
                    }, function(ret, err) {
                        if (ret) {
                            var buiInfo = ret.value.key1;
                            console.log(JSON.stringify(buiInfo));
                            that.buildingName = buiInfo.buiName; //建筑名称
                            that.initBuiInfo(buiInfo.id);
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }

            },
            unitf: function() {
                console.log("单元(梯/区)");
                if (!this.isBrowser) {
                    var that = this;
                    var defaultVal = this.unit; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.buildingUnit_arr.forEach(function(value, index, arr) {
                            if (value.text == that.unit) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.buildingUnit_arr, this.buildingType, "united");
                    api.addEventListener({
                        name: 'united'
                    }, function(ret, err) {
                        if (ret) {
                            that.unit = ret.value.key1;
                            that.unitId = ret.value.key2;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            houseUsef: function() {
                console.log("房屋用途");
                if (!this.isBrowser) {
                    console.log(JSON.stringify(this.houseUse_arr));
                    var that = this;
                    var defaultVal = this.houseUse; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.houseUse_arr.forEach(function(value, index, arr) {
                            if (value.text == that.houseUse) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.houseUse_arr, this.houseUse, "houseUsed");
                    api.addEventListener({
                        name: 'houseUsed'
                    }, function(ret, err) {
                        if (ret) {
                            that.houseUse = ret.value.key1;
                            that.houseUseId = ret.value.key2;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            actualUsef: function() {
                console.log("实际用途");
                if (!this.isBrowser) {
                    var that = this;
                    var defaultVal = this.actualUse; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.actualUse_arr.forEach(function(value, index, arr) {
                            if (value.text == this.actualUse) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.actualUse_arr, this.actualUse, "actualUsed");
                    api.addEventListener({
                        name: 'actualUsed'
                    }, function(ret, err) {
                        if (ret) {
                            that.actualUse = ret.value.key1;
                            that.actualUseId = ret.value.key2;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            againstthieff: function() { //防盗设施

                if (!this.isBrowser) {
                    var that = this;
                    var defaultVal = this.againstthief; //获取默认值
                    var defaultKey = this.againstthiefId; //获取默认值key;
                    if (defaultVal != null && defaultVal != "") {
                        var key_arr = defaultKey.split(",");
                        for (var i = 0; i < key_arr.length; i++) {
                            if (key_arr[i] != "" && key_arr[i] != -1) {
                                that.againstthief_arr[key_arr[i] - 1].status = "selected"
                            }

                        }
                    }
                    UICore.openSelectmulti(this.againstthief_arr, this.againstthief, "againstthief", true); //否则打开一般选择框
                    var keys = [];
                    var values = [];
                    api.addEventListener({
                        name: 'againstthief'
                    }, function(ret, err) {
                        if (ret) {
                            ret.value.key1.forEach(function(value) {
                                keys.push(value.key);
                                values.push(value.text);
                            });
                            that.againstthief = values.join(",");
                            that.againstthiefId = keys.join(",");
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            cookingenergyf: function() { //主要炊事能源

                if (!this.isBrowser) {
                    var that = this;
                    var defaultVal = this.cookingenergy; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.cookingenergy_arr.forEach(function(value, index, arr) {
                            if (value.text == that.actualUse) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.cookingenergy_arr, this.cookingenergy, "cookingenergy");
                    api.addEventListener({
                        name: 'cookingenergy'
                    }, function(ret, err) {
                        if (ret) {
                            that.cookingenergy = ret.value.key1;
                            that.cookingenergyId = ret.value.key2;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            hotwatertypef: function() { //热水供应方式
                if (!this.isBrowser) {
                    var that = this;
                    var defaultVal = this.hotwatertype; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.hotwatertype_arr.forEach(function(value, index, arr) {
                            if (value.text == that.hotwatertype) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.hotwatertype_arr, this.hotwatertype, "hotwatertype");
                    api.addEventListener({
                        name: 'hotwatertype'
                    }, function(ret, err) {
                        if (ret) {
                            that.hotwatertype = ret.value.key1;
                            that.hotwatertypeId = ret.value.key2;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            waterapplyf: function() { //供水

                if (!this.isBrowser) {
                    var that = this;
                    var defaultVal = this.waterapply; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.waterapply_arr.forEach(function(value, index, arr) {
                            if (value.text == that.waterapply) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.waterapply_arr, this.waterapply, "waterapply");
                    api.addEventListener({
                        name: 'waterapply'
                    }, function(ret, err) {
                        if (ret) {
                            that.waterapply = ret.value.key1;
                            that.waterapplyId = ret.value.key2;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            powerapplyf: function() { //供电
                if (!this.isBrowser) {
                    var that = this;
                    var defaultVal = this.powerapply; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.powerapply_arr.forEach(function(value, index, arr) {
                            if (value.text == that.powerapply) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.powerapply_arr, this.powerapply, "powerapply");
                    api.addEventListener({
                        name: 'powerapply'
                    }, function(ret, err) {
                        if (ret) {
                            that.powerapply = ret.value.key1;
                            that.powerapplyId = ret.value.key2;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            heatingf: function() { //取暖设施

                if (!this.isBrowser) {
                    var that = this;
                    var defaultVal = this.heating; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.heating_arr.forEach(function(value, index, arr) {
                            if (value.text == that.heating) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.heating_arr, this.heating, "heating");
                    api.addEventListener({
                        name: 'heating'
                    }, function(ret, err) {
                        if (ret) {
                            that.heating = ret.value.key1;
                            that.heatingId = ret.value.key2;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            showerf: function() { //卫浴设施

                if (!this.isBrowser) {
                    var that = this;
                    var defaultVal = this.shower; //获取默认值
                    var defaultKey = this.showerId; //获取默认值key;
                    if (defaultVal != null && defaultVal != "") {
                        var key_arr = defaultKey.split(",");
                        for (var i = 0; i < key_arr.length; i++) {
                            if (key_arr[i] != "" && key_arr[i] != -1) {
                                that.shower_arr[key_arr[i] - 1].status = "selected"
                            }

                        }
                        this.shower_arr.forEach(function(value, index, arr) {
                            if (value.text == that.shower) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelectmulti(this.shower_arr, this.shower, "shower", true); //否则打开一般选择框
                    var keys = [];
                    var values = [];
                    api.addEventListener({
                        name: 'shower'
                    }, function(ret, err) {
                        if (ret) {
                            ret.value.key1.forEach(function(value) {
                                keys.push(value.key);
                                values.push(value.text);
                            });
                            that.shower = values.join(",");
                            that.showerId = keys.join(",");
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            roomtypef: function() { //房屋性质

                if (!this.isBrowser) {
                    var that = this;
                    var defaultVal = this.roomtype; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.roomtype_arr.forEach(function(value, index, arr) {
                            if (value.text == that.roomtype) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.roomtype_arr, this.roomtype, "roomtype");
                    api.addEventListener({
                        name: 'roomtype'
                    }, function(ret, err) {
                        if (ret) {
                            that.roomtype = ret.value.key1;
                            that.roomtypeId = ret.value.key2;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            propertytypef: function() { //产权证类别
                if (!this.isBrowser) {
                    var that = this;
                    var defaultVal = this.propertytype; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.propertytype_arr.forEach(function(value, index, arr) {
                            if (value.text == that.propertytype) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.propertytype_arr, this.propertytype, "propertytype");
                    api.addEventListener({
                        name: 'propertytype'
                    }, function(ret, err) {
                        if (ret) {
                            that.propertytype = ret.value.key1;
                            that.propertytypeId = ret.value.key2;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            expandselect: function(index, english_name, title) {
                var expandParams = this.params.extendAtt;
                console.log(expandParams)
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
                console.log(JSON.stringify(this.expandjson))
            },
            submit: function() {
                if (this.isBrowser) {
                    $api.text($api.byId('pkh_add_su'), '提交');
                    this.isBrowser = false;
                    this.isClick = this.isBrowser;
                    this.chcek="请选择";
                } else {
                    var postjson = {}; //提交postjson
                    var reslutjson = {}; //最终整合真正提交的json
                    /* 基本房屋信息 */
                    postjson.ENTITYID = this.params.entityId;
                    postjson.GRIDID = this.params.gridId;
                    if (!this.isNew) {
                        postjson.houseid = this.params.houseid
                        postjson.data_area_code = $api.getStorage('userinf').dataAreaCode
                    } else {
                        postjson.data_area_code = $api.getStorage('userinf').dataAreaCode;
                    }
                    if (this.unitId)
                        postjson.unitId = this.unitId; //单元值
                    if (this.unit)
                        postjson.unitNum = this.unit; //单元名
                    if (this.layer)
                        postjson.floorNum = this.layer; //所属楼层
                    if (this.houseNum)
                        postjson.roomNum = this.houseNum; //房号
                    if (this.houseUseId)
                        postjson.useType = this.houseUseId; //房屋用途
                    if (this.actualUseId)
                        postjson.actualUseType = this.actualUseId; //



                    postjson.huXing = this.houseType; //户型
                    postjson.rhdjsj = this.regist; //入户登记时间
                    postjson.carNum = this.carsNum; //车辆数
                    postjson.carID = this.plateNumber; //车牌号
                    postjson.idNumber = this.idNum; //屋主身份证
                    postjson.homeOwners = this.houseowner; //屋主姓名

                    postjson.fdss = this.againstthiefId; //防盗设施
                    postjson.zycsny = this.cookingenergyId; //主要炊事能源
                    postjson.rsgyfs = this.hotwatertypeId; //热水供应方式
                    postjson.gongshui = this.waterapplyId; //供水
                    postjson.gongdian = this.powerapplyId; //供电
                    postjson.qnss = this.heatingId; //取暖设施
                    postjson.wyss = this.showerId; //卫浴设施
                    postjson.fwxz = this.roomtypeId; //房屋性质
                    postjson.cqzlb = this.propertytypeId; //产权证类别



                    postjson.area = this.houseArea; //
                    postjson.dataSource = 2; //

                    reslutjson.house = postjson;

                    /* 扩展信息 */
                    if (this.expandjson)
                        reslutjson.expand = this.expandjson;
                    /* 其它信息 */
                    var otherjson = {};
                    otherjson.createUserId = $api.getStorage('userinf').accountId;
                    reslutjson.common = otherjson;

                    var json = JSON.stringify(reslutjson)

                    console.log(json);
                    console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForHouse.shtml?act=edit&data=' + json);
                    api.ajax({
                        url: UICore.serviceUrl + 'mobile/mobileInterfaceForHouse.shtml?act=edit&data=' + json,
                        method: 'get',
                    }, function(ret, err) {
                        if (ret) {
                            console.log(JSON.stringify(ret));
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
                }
            },
            closeWin: function() {
                api.closeWin();
            }
        },
        components: {
            "houseComponent": {
                props: ['hosetitle', 'myclass'],
                template: "#houseInfo",
            }
        }
    });
}
