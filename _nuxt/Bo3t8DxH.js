import B from"./_th8vqhG.js";import{u as L,a as M,i as N,_ as P,b as V,c as A,e as D,d as F}from"./1lQwvPx9.js";import{_ as z,r as e,o as G,v as U,x as s,z as o,P as v,Q as x,M as l,t as j,C as E,D as Q,R as q}from"./DU4Cry9D.js";import"./iRYbyzkV.js";import"./Bn4gqPzp.js";import"./CObB-e_Q.js";import"./BjR3ucUz.js";import"./tmf-np-1.js";import"./CR3ifIEk.js";import"./BrRMB-Bv.js";const H=t=>(E("data-v-82b97ad8"),t=t(),Q(),t),J={class:"h-full pb-4"},K=H(()=>s("p",{class:"mb-4 text-4xl"},"¿A dónde?🚕💨",-1)),O={class:"my-4"},W={__name:"taxi",setup(t){const n=e(),i=e([]),u=e([]),a=e(""),{getUserLocation:h}=L(),{loading:X,distance:b,duration:w,fareCost:y,routeString:g,calculateTaxiFare:R}=M(n),d=e(null),p=e(!1),_=e(),m=e(),c=e(!0);G(async()=>{n.value=await N(),i.value=await h(),console.log(i.value)});const k=async()=>{a.value=await A();const r=await D(a.value,n.value);u.value=r.Geometry.Point,a.value=r.Label,await R(i.value,u.value),d.value.drawRoute(g.value),p.value=!0,c.value=!0,await q(),m.value.scrollIntoView({behavior:"smooth"})},I=()=>{_.value.scrollIntoView({behavior:"smooth"}),c.value=!1};return(r,Y)=>{const f=B,C=F,T=P,S=V;return j(),U("div",J,[s("div",{class:"flex flex-col items-center justify-center h-screen",ref_key:"startRef",ref:_},[K,o(f,{onClick:k,icon:"pi pi-microphone",severity:"warning",class:"mx-auto big p-button-rounded"})],512),v(s("div",{class:"flex flex-col",ref_key:"resultRef",ref:m},[s("div",O,[o(C,{ref_key:"mapRef",ref:d},null,512)]),o(T,{"fare-cost":l(y)},null,8,["fare-cost"]),o(S,{"origin-address":"Mi ubicacion","destination-address":a.value,distance:Number(l(b)),duration:Number(l(w))},null,8,["destination-address","distance","duration"]),v(o(f,{onClick:I,severity:"secondary",icon:"pi pi-angle-double-up",class:"!fixed !rounded-full bottom-5 end-5"},null,512),[[x,c.value]])],512),[[x,p.value]])])}}},re=z(W,[["__scopeId","data-v-82b97ad8"]]);export{re as default};
