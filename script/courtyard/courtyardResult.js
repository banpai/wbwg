/**
 * Created by kevin on 2017/10/31.
 */
apiready = function() {
    var vue = new Vue({
        el: "#all_con",
        data: {
            items: [],
            isshow: false,
            isSlideInDown: false,
            isSlideInUp: false,
            resultjson: {},
            params: "",

            cellName: "", //小区名称
            cellAddr: "", //小区地址
        },
        created: function() {
            this.params = api.pageParam;
            var postjson = {};
            postjson.pageSize = 10;
            postjson.pageNow = 1;
            postjson.data_area_code = $api.getStorage('userinf').dataAreaCode;
            postjson.createUserGridCode = $api.getStorage('userinf').gridCode;
            this.resultjson.cellbean = postjson;
            UICore.showLoading("列表加载中...", "请稍候");
            var that = this;
            console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForResidential.shtml?act=query&data=' + JSON.stringify(this.resultjson));
            api.ajax({
                url: UICore.serviceUrl + 'mobile/mobileInterfaceForResidential.shtml?act=query&data=' + JSON.stringify(this.resultjson),
                method: 'get',
            }, function(ret, err) {
                api.hideProgress();
                console.log(JSON.stringify(ret));
                if (ret.success) {
                    if (ret.data == "") {
                        alert("没有更多数据了")
                    } else {
                        ret.data.forEach(function(value) {
                            that.items.push(value);
                        });
                    }
                } else {
                    alert(JSON.stringify(ret.errorinfo))
                }
            });
            <!--分隔线-->
            var container = $api.dom(".wrapper");
            $api.css(container, 'display:block');
            api.hideProgress();
        },
        mounted: function() {
            var that = this;
            api.addEventListener({
                name: 'searchCourtyard'
            }, function(ret, err) {
                if (ret) {
                    if (ret.value.key1 == true) {
                        that.isshow = true;
                        that.isSlideInDown = true;
                    } else {
                        that.isshow = false;
                        that.isSlideInDown = false;
                    }

                } else {
                    alert(JSON.stringify(err));
                }
            });
            this.refreshHeader();
            that.loadBottom();
        },
        methods: {
            cover_close: function() {
                this.isshow = false;
            },
            choose: function(index) {
                var info = this.items[index];
                console.log(JSON.stringify(this.params));
                console.log(JSON.stringify(info));
                if(this.params.from=="building"){
                      UICore.sendEvent("building", info);
                      api.closeWin();

                }else{
                  api.openWin({
                      name: 'courtyardResult',
                      url: './courtyard.html',
                      pageParam: {
                          title: "courtyardResult",
                          infos: info,
                      }
                  });
                }
            },
            refreshHeader: function() {
                var that = this;
                api.setRefreshHeaderInfo({
                    visible: true,
                    loadingImg: 'widget://image/loading_more.gif',
                    bgColor: '#ccc',
                    textColor: '#fff',
                    textUp: '松开刷新...',
                    showTime: true
                }, function(ret, err) {
                    // 这里写重新渲染页面的方法
                    that.loadList();
                });
            },
            loadList: function() {
                var that = this;
                this.resultjson.cellbean.pageNow = 1;
                console.log("下拉刷新: " + UICore.serviceUrl + 'mobile/mobileInterfaceForResidential.shtml?act=query&data=' + JSON.stringify(this.resultjson));
                api.ajax({
                    url: UICore.serviceUrl + 'mobile/mobileInterfaceForResidential.shtml?act=query&data=' + JSON.stringify(this.resultjson),
                    method: 'get',
                }, function(ret, err) {
                    api.refreshHeaderLoadDone();
                    if (ret.success) {
                        if (ret.data == "") {
                            alert("没有更多数据了")
                        } else {
                            // 清空原有数据
                            that.items.splice(0, that.items.length);
                            ret.data.forEach(function(value) {
                                that.items.push(value);
                            });
                        }
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            },
            loadBottom: function() { //上拉加载
                var that = this;
                api.addEventListener({
                    name: 'scrolltobottom',
                    extra: {
                        threshold: 0 //设置距离底部多少距离时触发，默认值为0，数字类型
                    }
                }, function(ret, err) {
                    UICore.showLoading('加载中...', '稍等...');
                    that.resultjson.cellbean.pageNow++;
                    console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForResidential.shtml?act=query&data=' + JSON.stringify(that.resultjson));
                    api.ajax({
                        url: UICore.serviceUrl + 'mobile/mobileInterfaceForResidential.shtml?act=query&data=' + JSON.stringify(that.resultjson),
                        method: 'get',
                    }, function(ret, err) {
                        api.hideProgress();
                        if (ret.success) {
                            var arrlength = 0;
                            if (ret.data == "") {
                                alert("没有更多数据了")
                            } else {
                                ret.data.forEach(function(value) {
                                    that.items.push(value);
                                });
                            }
                        } else {
                            alert(JSON.stringify(ret.errorinfo))
                        }
                    });
                });
            },
            handleTopChange: function(status) {
                this.topStatus = status;
            },
            query: function() {
                var postjson = {};
                var resultjson = {};
                postjson.pageSize = 10;
                postjson.pageNow = 1;
                postjson.data_area_code = $api.getStorage('userinf').villageOrCommunityCode;
                postjson.createUserGridCode = $api.getStorage('userinf').gridCode;
                if (this.cellName)
                    postjson.name = this.cellName; //小区名称
                if (this.cellAddr)
                    postjson.address = this.cellAddr; //小区地址

                resultjson.cellbean = postjson;
                var that = this;
                UICore.showLoading("列表查询中...", "请稍候");
                console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForResidential.shtml?act=query&data=' + JSON.stringify(resultjson));
                api.ajax({
                    url: UICore.serviceUrl + 'mobile/mobileInterfaceForResidential.shtml?act=query&data=' + JSON.stringify(resultjson),
                    method: 'get',
                }, function(ret, err) {
                    api.hideProgress();
                    that.isshow = false;
                    <!--清空搜索数据-->
                    that.cellName = ""; //小区名称
                    that.cellAddr = ""; //小区地址
                    if (ret.success) {
                        that.items.splice(0, that.items.length);
                        if (ret.data == "") {
                            alert("没有更多数据了")
                        } else {
                            ret.data.forEach(function(value) {
                                that.items.push(value);
                            });
                        }
                    } else {
                        alert(JSON.stringify(ret.errorinfo))
                    }
                });
            },
        },// methods end.
        filters:{
            //过滤器，过滤日期格式
            substringDate:function(value){
                return value?value.substring(0,10):"";
            }
        }

    });
}
