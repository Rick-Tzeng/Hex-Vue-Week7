"use strict";(self["webpackChunkhomework02"]=self["webpackChunkhomework02"]||[]).push([[753],{5753:function(e,s,t){t.r(s),t.d(s,{default:function(){return b}});var o=t(3396),n=t(9242);const r={class:"container-fluid login-bg"},l=(0,o._)("h1",{class:"fw-bold text-success text-center pt-5"},"後台登入頁面",-1),a={class:"row justify-content-center"},i={class:"col-10 col-md-6 mt-3 rounded-4"},d={class:"form-floating my-5"},c=(0,o._)("label",{class:"fw-bold text-muted",for:"email"},"Email Address",-1),u={class:"form-floating my-5"},m=(0,o._)("label",{class:"fw-bold text-muted",for:"password"},"Password",-1);function p(e,s,t,p,h,w){return(0,o.wg)(),(0,o.iD)("div",r,[l,(0,o._)("div",a,[(0,o._)("div",i,[(0,o._)("form",null,[(0,o._)("div",d,[(0,o.wy)((0,o._)("input",{class:"form-control",type:"email",id:"email",style:{"user-select":"none"},placeholder:"name@example.com",required:"","onUpdate:modelValue":s[0]||(s[0]=e=>h.user.username=e)},null,512),[[n.nr,h.user.username]]),c]),(0,o._)("div",u,[(0,o.wy)((0,o._)("input",{class:"form-control",type:"password",id:"password",style:{"user-select":"none"},placeholder:"password",required:"","onUpdate:modelValue":s[1]||(s[1]=e=>h.user.password=e)},null,512),[[n.nr,h.user.password]]),m]),(0,o._)("button",{class:"btn btn-lg btn-success w-100 mb-5",type:"button",onClick:s[2]||(s[2]=(...e)=>w.signIn&&w.signIn(...e))},"登入")])])])])}var h={data(){return{user:{username:"",password:""},loader:{}}},inject:["emitter"],methods:{signIn(){this.loader=this.$loading.show();const e="https://vue3-course-api.hexschool.io/v2/admin/signin";this.$http.post(e,this.user).then((e=>{const{token:s,expired:t}=e.data;document.cookie=`hexToken=${s}; expires=${new Date(t)}`,this.loader.hide(),this.$router.push("/admin/products")})).catch((()=>{this.emitter.emit("push-message",{style:"danger",title:"登入頁面",content:"【登入失敗】請確認帳號密碼是否正確"}),this.loader.hide()}))}}},w=t(89);const f=(0,w.Z)(h,[["render",p]]);var b=f}}]);
//# sourceMappingURL=753.8812f908.js.map