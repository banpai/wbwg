apiready = function() {

    var user = new Vue({
        el: '#dcontent',
        data: {
            checked: false,
            content: {
                username: '',
                password: '',
                accountId:'',
                checkpwd: true,
                checkuser: true
            }
        },
        created:function(){
            this.content.username=$api.getStorage('username');
            this.content.password=$api.getStorage('password');
            if(this.content.password){
              this.checked=true;
            }
        },
        methods: {
            login: function(e) {
              var that = this;
                if (this.content.checkpwd && this.content.checkuser) {
                    var user = this.content.username;
                    var pwd = this.content.password;
                    if(this.checked){
                      $api.setStorage('username', user);
                      $api.setStorage('password', pwd);
                    }else{
                      $api.rmStorage('username');
                      $api.rmStorage('password');
                    }
                    UICore.showLoading('正在登录...', '请稍后...');
                    console.log(UICore.serviceUrl + "mobile/mobileInterface.shtml?act=loginFace&passWord=" + pwd + "&userName=" + user);
                    api.ajax({
                        url: UICore.serviceUrl + "mobile/mobileInterface.shtml?act=loginFace&passWord=" + pwd + "&userName=" + user,
                        method: 'get',
                        timeout: 6,
                    }, function(reta, erra) {
                        api.hideProgress();
                        if(reta){
                          if (reta.success == "true") {
                              that.accountId = reta.accu[0].accountId;
                              $api.setStorage('userinf', reta.accu[0]);
                              // that.getLocationNew();
                              //判断是否有配置文件
                              var isHasConfig = api.getPrefs({
                                  sync: true,
                                  key: 'isHasConfig'
                              });
                              //如果没有则下载配置文件
                              if (!isHasConfig) {
                                  UICore.showLoading('正在下载配置文件...', '请稍后...');
                                  api.ajax({
                                      url: UICore.serviceUrl + "/mobile/mobileDynaTable.shtml?act=selectConfigureTable",
                                      method: 'get'
                                  }, function(reta, err) {
                                      api.hideProgress();
                                      if (reta.success) {
                                          $api.setStorage('settingdata', JSON.stringify(reta));
                                          api.setPrefs({
                                              key: 'isHasConfig',
                                              value: true
                                          });
                                          //打开新界面
                                          api.openWin({
                                                  name: 'home',
                                                  url: '../index.html',
                                                  pageParam: {
                                                      name: 'home'
                                                  }
                                              })
                                              //如果配置文件下载失败
                                      } else {

                                          alert(JSON.stringify(reta));
                                          alert(reta.ErrorInfo)
                                      }
                                  }); //ajax方法结尾
                                  //如果已经有配置文件则直接进入
                              } else {
                                  api.openWin({
                                      name: 'home',
                                      url: '../index.html',
                                      pageParam: {
                                          name: 'home'
                                      }
                                  });
                              }
                              //登录失败提醒
                          } else {
                            that.content.password="";
                            alert(reta.ErrorInfo)
                          }
                        }else{
                          alert(JSON.stringify(erra))
                        }

                    });
                }

            },
            getLocation:function(){
              var _self = this;

              setInterval(function(){
                var baiduLocation = api.require('baiduLocation');
                baiduLocation.startLocation({
                  accuracy : '10m',
                  filter : 5,
                  autoStop : true,
                }, function(ret, err) {
                  if (ret.status) {
                    console.log("location GPS:  " +  JSON.stringify(ret));
                    var latitude = ret.latitude;// 纬度，浮点数，范围为90 ~ -90
                    var longitude = ret.longitude// 经度，浮点数，范围为180 ~ -180。
                    var accuracy = ret.accuracy;// 位置精度
                    var coordTran2 = new Transformation2(45, 45, 49);
                    var myxy = coordTran2.bd09towgs84(longitude, latitude)
                    console.log(JSON.stringify(myxy));
                    var coordTran = new Transformation(45, 45, 49);
                    var xy = coordTran.WGS842OCN(myxy.x, myxy.y);
                    console.log(JSON.stringify(xy));
                    var myJson = {};
                    myJson.population = {x:xy.x,y:xy.y,account_id:_self.accountId};
                    api.ajax({
                        url: UICore.serviceUrl + "/mobile/mobileInterface.shtml?act=gpsperson&data="+JSON.stringify(myJson),
                        method: 'get'
                    },function(ret, err){
                        if (ret) {
                            console.log(JSON.stringify(ret));
                        } else {
                            // alert( JSON.stringify( err ) );
                        }
                    });

                  }
                });
              },10000);
            },
            getLocationNew:function(){
              var baiduGPS = api.require('baiduGPS');
              var param = {url:UICore.serviceUrl+"mobile/mobileInterface.shtml",accountId:this.accountId};
          	  baiduGPS.getGPS(param);
            },
            checkpwd: function() {
                if (this.content.password == '') {
                    alert("密码为空")
                }  else {
                    this.content.checkpwd = true;
                }
            },
            checkuser: function() {
                if (this.content.username == '') {
                    alert("用户名为空")
                } else {
                    this.content.checkuser = true;
                }
            }
        }
    });
}
