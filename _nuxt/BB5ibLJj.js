import B from"./CDvPlLVg.js";import{O as L,an as a,i as g,t as s,F as m,a3 as p,A as r,$ as l,z as j,a0 as u,x as d,V as f,v as b,X as v,a1 as C,W as k,y as S}from"./fk934glN.js";import D from"./BfCmX-Do.js";import{s as F}from"./ip_3ZGe-.js";import"./4wTHGGIB.js";import"./BrvyoC2Z.js";import"./CoXqBIbO.js";import"./DAv9LTyL.js";import"./Bn1fj2tw.js";var I={root:"p-confirm-dialog",icon:"p-confirm-dialog-icon",message:"p-confirm-dialog-message",rejectButton:function(t){var i=t.instance;return["p-confirm-dialog-reject",i.confirmation&&!i.confirmation.rejectClass?"p-button-text":null]},acceptButton:"p-confirm-dialog-accept"},O=L.extend({name:"confirmdialog",classes:I}),E={name:"BaseConfirmDialog",extends:F,props:{group:String,breakpoints:{type:Object,default:null},draggable:{type:Boolean,default:!0}},style:O,provide:function(){return{$parentInstance:this}}},A={name:"ConfirmDialog",extends:E,confirmListener:null,closeListener:null,data:function(){return{visible:!1,confirmation:null}},mounted:function(){var t=this;this.confirmListener=function(i){i&&i.group===t.group&&(t.confirmation=i,t.confirmation.onShow&&t.confirmation.onShow(),t.visible=!0)},this.closeListener=function(){t.visible=!1,t.confirmation=null},a.on("confirm",this.confirmListener),a.on("close",this.closeListener)},beforeUnmount:function(){a.off("confirm",this.confirmListener),a.off("close",this.closeListener)},methods:{accept:function(){this.confirmation.accept&&this.confirmation.accept(),this.visible=!1},reject:function(){this.confirmation.reject&&this.confirmation.reject(),this.visible=!1},onHide:function(){this.confirmation.onHide&&this.confirmation.onHide(),this.visible=!1},getCXOptions:function(t,i){return{contenxt:{icon:t,iconClass:i.class}}}},computed:{header:function(){return this.confirmation?this.confirmation.header:null},message:function(){return this.confirmation?this.confirmation.message:null},blockScroll:function(){return this.confirmation?this.confirmation.blockScroll:!0},position:function(){return this.confirmation?this.confirmation.position:null},acceptLabel:function(){return this.confirmation?this.confirmation.acceptLabel||this.$primevue.config.locale.accept:null},rejectLabel:function(){return this.confirmation?this.confirmation.rejectLabel||this.$primevue.config.locale.reject:null},acceptIcon:function(){return this.confirmation?this.confirmation.acceptIcon:null},rejectIcon:function(){return this.confirmation?this.confirmation.rejectIcon:null},autoFocusAccept:function(){return this.confirmation.defaultFocus===void 0||this.confirmation.defaultFocus==="accept"},autoFocusReject:function(){return this.confirmation.defaultFocus==="reject"},closeOnEscape:function(){return this.confirmation?this.confirmation.closeOnEscape:!0}},components:{CDialog:D,CDButton:B}};function H(e,t,i,R,c,n){var h=g("CDButton"),y=g("CDialog");return s(),m(y,{visible:c.visible,"onUpdate:visible":[t[2]||(t[2]=function(o){return c.visible=o}),n.onHide],role:"alertdialog",class:u(e.cx("root")),modal:!0,header:n.header,blockScroll:n.blockScroll,position:n.position,breakpoints:e.breakpoints,closeOnEscape:n.closeOnEscape,draggable:e.draggable,pt:e.pt,unstyled:e.unstyled},p({default:r(function(){return[e.$slots.container?k("",!0):(s(),b(v,{key:0},[e.$slots.message?(s(),m(C(e.$slots.message),{key:1,message:c.confirmation},null,8,["message"])):(s(),b(v,{key:0},[l(e.$slots,"icon",{},function(){return[e.$slots.icon?(s(),m(C(e.$slots.icon),{key:0,class:u(e.cx("icon"))},null,8,["class"])):c.confirmation.icon?(s(),b("span",f({key:1,class:[c.confirmation.icon,e.cx("icon")]},e.ptm("icon")),null,16)):k("",!0)]}),d("span",f({class:e.cx("message")},e.ptm("message")),S(n.message),17)],64))],64))]}),_:2},[e.$slots.container?{name:"container",fn:r(function(o){return[l(e.$slots,"container",{message:c.confirmation,onClose:o.onClose,onAccept:n.accept,onReject:n.reject,closeCallback:o.onclose,acceptCallback:n.accept,rejectCallback:n.reject})]}),key:"0"}:void 0,e.$slots.container?void 0:{name:"footer",fn:r(function(){return[j(h,{label:n.rejectLabel,class:u([e.cx("rejectButton"),c.confirmation.rejectClass]),onClick:t[0]||(t[0]=function(o){return n.reject()}),autofocus:n.autoFocusReject,unstyled:e.unstyled,pt:e.ptm("rejectButton")},p({_:2},[n.rejectIcon||e.$slots.rejecticon?{name:"icon",fn:r(function(o){return[l(e.$slots,"rejecticon",{},function(){return[d("span",f({class:[n.rejectIcon,o.class]},e.ptm("rejectButton").icon,{"data-pc-section":"rejectbuttonicon"}),null,16)]})]}),key:"0"}:void 0]),1032,["label","class","autofocus","unstyled","pt"]),j(h,{label:n.acceptLabel,class:u([e.cx("acceptButton"),c.confirmation.acceptClass]),onClick:t[1]||(t[1]=function(o){return n.accept()}),autofocus:n.autoFocusAccept,unstyled:e.unstyled,pt:e.ptm("acceptButton")},p({_:2},[n.acceptIcon||e.$slots.accepticon?{name:"icon",fn:r(function(o){return[l(e.$slots,"accepticon",{},function(){return[d("span",f({class:[n.acceptIcon,o.class]},e.ptm("acceptButton").icon,{"data-pc-section":"acceptbuttonicon"}),null,16)]})]}),key:"0"}:void 0]),1032,["label","class","autofocus","unstyled","pt"])]}),key:"1"}]),1032,["visible","class","header","blockScroll","position","breakpoints","closeOnEscape","draggable","onUpdate:visible","pt","unstyled"])}A.render=H;export{A as default};
