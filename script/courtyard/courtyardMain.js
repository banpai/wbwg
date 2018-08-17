/**
 * Created by kevin on 2017/10/31.
 */
 apiready = function() {
     console.log("dee");
     var vue = new Vue({
         el: "#list",
         data: {

         },
         methods: {
             create: function() {
                 api.openWin({
                     name: 'courtyardCreate',
                     url: './courtyard.html',
                     vScrollBarEnabled:false,
                     pageParam: {
                       infos:"新增小区"
                     }
                 });
             },
             query: function() {
                 api.openWin({
                     name: 'courtyardquery',
                     url: './courtyardquery.html',
                     pageParam: {
                         infos:"查询小区",
                     }
                 });

             },
             closeWin:function() {
                 api.closeWin();
             }
         } // methods end.
     });

 }
