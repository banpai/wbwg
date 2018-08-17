/**
 * Created by kevin on 2017/10/31.
 */
 apiready = function() {

     new Vue({
             el: "#list",
             data: {
                 isshow: false,
                 isSlideInDown: false,
                 params: {},
             },
             created: function() {
                 this.params = api.pageParam;
                 this.openFrame();
             },
             methods: {
                 openFrame:function() {
                     console.log(JSON.stringify(this.params));
                     api.openFrame({
                         name: 'courtyardResult',
                         url: './courtyardResult.html',
                         vScrollBarEnabled: false,
                         rect: {
                             x: 0,
                             y: $api.dom('.header').offsetHeight,
                             w: api.winWidth,
                             h: api.winHeight - $api.dom('.header').offsetHeight
                         },
                         pageParam: {
                             from: this.params.from
                         },
                         bounces: true,
                         reload: true,
                     });
                 },
                 search: function() {
                     this.isshow = true;
                     UICore.sendEvent("searchCourtyard", true);
                 },
                 closeWin:function() {
                     if (this.isshow == true) {
                         this.isshow = false;
                         UICore.sendEvent("searchCourtyard", false)
                     } else {
                         api.closeWin();
                     }
                 }
             } //methods end
         }) //vue end
 }
