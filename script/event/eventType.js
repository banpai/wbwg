window.apiready = function(){
    function setProps(modifiers,props) {
      modifiers.forEach(function(item) {
          if(isNaN(Number(item)))
            props.event = item;
          else
            props.transition = item;
        });
    }
    Vue.directive('ripple', {
      bind: function(el, binding){

        // Default values.
        var props = {
            event: 'mousedown',
            transition: 300
        };

        setProps(Object.keys(binding.modifiers),props);

        el.addEventListener(props.event, function(event) {
            rippler(event, el, binding.value);
        });

        var bg = binding.value || 'rgba(0, 0, 0, 0.35)';

        function rippler(event, el) {
            var target = el;

            // Get necessary variables
            var rect        = target.getBoundingClientRect(),
                left        = rect.left,
                top         = rect.top,
                width       = target.offsetWidth,
                height      = target.offsetHeight,
                dx          = event.clientX - left,
                dy          = event.clientY - top,
                maxX        = Math.max(dx, width - dx),
                maxY        = Math.max(dy, height - dy),
                style       = window.getComputedStyle(target),
                radius      = Math.sqrt((maxX * maxX) + (maxY * maxY));

            // Create the ripple and its container
            var ripple = document.createElement("div"),
                rippleContainer = document.createElement("div");

            //Styles for ripple
            ripple.style.marginTop= '0px';
            ripple.style.marginLeft= '0px';
            ripple.style.width= '1px';
            ripple.style.height= '1px';
            ripple.style.transition= 'all ' + props.transition + 'ms cubic-bezier(0.4, 0, 0.2, 1)';
            ripple.style.borderRadius= '50%';
            ripple.style.pointerEvents= 'none';
            ripple.style.position= 'relative';
            ripple.style.zIndex= '9999';
            ripple.style.backgroundColor  = bg;

            //Styles for rippleContainer
            rippleContainer.style.position= 'absolute';
            rippleContainer.style.left = '0';
            rippleContainer.style.top = '0';
            rippleContainer.style.height = '0';
            rippleContainer.style.width = '0';
            rippleContainer.style.pointerEvents = 'none';
            rippleContainer.style.overflow = 'hidden';

            rippleContainer.appendChild(ripple);
            document.body.appendChild(rippleContainer);

            ripple.style.marginLeft   = dx + "px";
            ripple.style.marginTop    = dy + "px";

            rippleContainer.style.left    = left + (((window.pageXOffset || document.scrollLeft) - (document.clientLeft || 0)) || 0) + "px";
            rippleContainer.style.top     = top + (((window.pageYOffset || document.scrollTop) - (document.clientTop || 0)) || 0) + "px";
            rippleContainer.style.width   = width + "px";
            rippleContainer.style.height  = height + "px";
            rippleContainer.style.borderTopLeftRadius  = style.borderTopLeftRadius;
            rippleContainer.style.borderTopRightRadius  = style.borderTopRightRadius;
            rippleContainer.style.borderBottomLeftRadius  = style.borderBottomLeftRadius;
            rippleContainer.style.borderBottomRightRadius  = style.borderBottomRightRadius;

            rippleContainer.style.direction = 'ltr';

            setTimeout(function() {
                ripple.style.width  = radius * 2 + "px";
                ripple.style.height = radius * 2 + "px";
                ripple.style.marginLeft   = dx - radius + "px";
                ripple.style.marginTop    = dy - radius + "px";
            }, 0);

            function clearRipple() {
                setTimeout(function() {
                    ripple.style.backgroundColor = "rgba(0, 0, 0, 0)";
                }, 250);

                // Timeout set to get a smooth removal of the ripple
                setTimeout(function() {
                    rippleContainer.parentNode.removeChild(rippleContainer);
                }, 850);

                el.removeEventListener('mouseup', clearRipple, false);
            }

            if(event.type === 'mousedown') {
                el.addEventListener('mouseup', clearRipple, false);
            } else {
                clearRipple();
            }
        }
      }
    });
    new Vue({
        el: "#list",
        data: {
          accountId:"",
          itemArray:[]
        },
        created:function(){
          var info = $api.getStorage('userinf');
          if(info){
            this.accountId = info.accountId;
          }
          this.loadFlowType();
        },
        methods:{
            loadFlowType:function(){
              var _self = this;
              console.log(UICore.serviceUrl + 'tree/getEventClassficationTree?code=FLOW_CLASSIFY&accountId='+this.accountId);
              api.ajax({
                  url: UICore.serviceUrl + 'tree/getEventClassficationTree?code=FLOW_CLASSIFY&accountId='+this.accountId,
                  method: 'get'
              },function(ret, err){
                  if (ret) {
                      if(ret.success){
                        var myList = ret.list;
                        var parentArr = [];
                        if(myList&&myList.length>0){
                          for(var num in myList){
                            if(myList[num].isParent){
                              var obj = {id:myList[num].id,name:myList[num].name,children:[],show:false};
                              parentArr.push(obj);
                            }
                          }
                          console.log(JSON.stringify(parentArr));
                          for(var num in myList){
                            if(!myList[num].isParent){
                              for(var pa in parentArr){
                                if(parentArr[pa].id==myList[num].parentId){
                                  var obj = {id:myList[num].id,name:myList[num].name,code:myList[num].code,parentId:myList[num].parentId};
                                  parentArr[pa].children.push(obj);
                                }
                              }
                            }
                          }
                          console.log(JSON.stringify(parentArr));
                          _self.itemArray = _self.itemArray.concat(parentArr);
                        }else{
                          alert("您没有事项，请联系管理员获取权限");
                        }

                      }else{
                        alert("事项获取失败，请联系管理员");
                      }
                  } else {
                      alert( JSON.stringify( err ) );
                  }
              });

            },
            closeWin:function(){
              api.closeWin();

            }
        },
        components:{
          "form-item":{
            template:"#item-element", //模版内容
            props:["titlename","dataarr","isshow"],
            methods:{
              showOrHide:function(){
                this.isshow.show = !this.isshow.show;
              },
              selectFlow:function(code,id){
                console.log(code+","+id);
                setTimeout(function(){
                  api.openWin({
                      name: 'eventReport',
                      url: './event_report.html',
                      vScrollBarEnabled: false,
                      pageParam: {
                          flowId: code,
                          eventTypeId:id
                      }
                  });
                },200)


              }
            },
          },
        }
    });
}
