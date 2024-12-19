import{p as tt,_ as C,b as Mt}from"../chunks/preload-helper.ptD0OENq.js";import{a as u,t as h,c as mt,b as Nt}from"../chunks/disclose-version.Mar9Y9vC.js";import{i as nt}from"../chunks/legacy.BhJzg-UU.js";import{h as ut,a9 as wt,aD as Ct,ar as It,ai as yt,aE as Pt,v as zt,j as Ft,R as jt,a7 as Gt,i as Wt,G as ot,M as v,K as V,N as o,S as n,L as lt,an as X,J as kt,O as l,aF as it,aG as qt,T as F,V as _t}from"../chunks/runtime.DiZzUycx.js";import{s as W,a as Bt,e as K}from"../chunks/render.BhdnCnaV.js";import{i as L}from"../chunks/if.Bqj423Xp.js";import{e as Y,i as H}from"../chunks/each.D52XpMRx.js";import{b as Lt}from"../chunks/paths.CbNrzUQi.js";function bt(e,s,a,t){var f=e.__attributes??(e.__attributes={});ut&&(f[s]=e.getAttribute(s),s==="src"||s==="srcset"||s==="href"&&e.nodeName==="LINK")||f[s]!==(f[s]=a)&&(s==="style"&&"__styles"in e&&(e.__styles={}),s==="loading"&&(e[Pt]=a),a==null?e.removeAttribute(s):typeof a!="string"&&At(e).includes(s)?e[s]=a:e.setAttribute(s,a))}function D(e,s,a){var t=zt,f=Ft;It(null),yt(null);try{(ft.has(e.nodeName)||customElements.get(e.tagName.toLowerCase())?At(e).includes(s):a&&typeof a=="object")?e[s]=a:bt(e,s,a==null?a:String(a))}finally{It(t),yt(f)}}var ft=new Map;function At(e){var s=ft.get(e.nodeName);if(s)return s;ft.set(e.nodeName,s=[]);for(var a,t=e,f=Element.prototype;f!==t;){a=Ct(t);for(var c in a)a[c].set&&s.push(c);t=wt(t)}return s}function $(e,s){var a=e.__className,t=Kt(s);ut&&e.className===t?e.__className=t:(a!==t||ut&&e.className!==t)&&(s==null?e.removeAttribute("class"):e.className=t,e.__className=t)}function Kt(e){return e??""}function gt(e,s,a){if(a){if(e.classList.contains(s))return;e.classList.add(s)}else{if(!e.classList.contains(s))return;e.classList.remove(s)}}function Tt(e,s,a){var t=Gt(e,s);t&&t.set&&(e[s]=a,jt(()=>{e[s]=null}))}function Et(e){return function(...s){var a=s[0];return a.preventDefault(),e==null?void 0:e.apply(this,s)}}function Yt(e,s){var c;var a=(c=e.$$events)==null?void 0:c[s.type],t=Wt(a)?a.slice():a==null?[]:[a];for(var f of t)f.call(this,s)}const Ht={VILLAGER:"村人",SEER:"占い師",MEDIUM:"霊能者",BODYGUARD:"騎士",WEREWOLF:"人狼",POSSESSED:"狂人"},Jt={ALIVE:"生存",DEAD:"死亡"},Qt={HUMAN:"人間",WEREWOLF:"人狼"},Xt={VILLAGER:"村人陣営",WEREWOLF:"人狼陣営"};var Zt=h("<strong> </strong>");function P(e,s){ot(s,!1);let a=tt(s,"agentIdx",8),t=tt(s,"highlight",8,!1);nt();var f=Zt();const c=X(()=>`${(t()?"agent"+a().padStart(2,"0"):"")??""} svelte-2m8qed`);var d=v(f);V(()=>W(d,`Agent[${a().padStart(2,"0")??""}]`)),o(f),V(()=>$(f,n(c))),u(e,f),lt()}function $t(e,s){ot(s,!1);let a=tt(s,"text",8);function t(d){const y=/Agent\[(\d+)\]/g,T=[];let S=0,O;for(;(O=y.exec(d))!==null;)O.index>S&&T.push({text:d.slice(S,O.index),agentId:null,isAgentTag:!1}),T.push({text:O[0],agentId:parseInt(O[1]),isAgentTag:!0}),S=y.lastIndex;return S<d.length&&T.push({text:d.slice(S),agentId:null,isAgentTag:!1}),{parts:T}}nt();var f=mt(),c=kt(f);return Y(c,1,()=>t(a()).parts,H,(d,y)=>{var T=mt(),S=kt(T);{var O=M=>{var N=X(()=>{var B;return((B=n(y).agentId)==null?void 0:B.toString())??""});P(M,{get agentIdx(){return n(N)},highlight:!0})},q=M=>{var N=Nt();V(()=>W(N,n(y).text)),u(M,N)};L(S,M=>{n(y).isAgentTag?M(O):M(q,!1)})}u(d,T)}),u(e,f),Tt(s,"formatTalkText",t),lt({formatTalkText:t})}var te=h("<iconify-icon></iconify-icon>",2),ee=h("<iconify-icon></iconify-icon>",2),ae=h("<iconify-icon></iconify-icon>",2),se=h("<iconify-icon></iconify-icon>",2),re=h("<iconify-icon></iconify-icon>",2),ie=h("<iconify-icon></iconify-icon>",2),ne=h("<iconify-icon></iconify-icon>",2),oe=h("<li><!> </li>"),le=h('<section class="agent-section"><h3 class="svelte-1cf5h64">エージェント</h3> <ul class="svelte-1cf5h64"></ul></section>'),ce=h("<li><!> <!></li>"),ve=h('<section class="talks-section"><h3 class="svelte-1cf5h64">会話</h3> <ul class="talks svelte-1cf5h64"></ul></section>'),_e=h("<li><!> が <!> に投票</li>"),de=h('<section class="votes-section"><h3 class="svelte-1cf5h64">投票</h3> <ul class="svelte-1cf5h64"></ul></section>'),ue=h('<section class="execution-section"><h3 class="svelte-1cf5h64">追放</h3> <p><!> を追放</p></section>'),fe=h("<li><!> が <!> に投票</li>"),ge=h('<section class="attack-votes-section"><h3 class="svelte-1cf5h64">襲撃投票</h3> <ul class="svelte-1cf5h64"></ul></section>'),pe=h("<p><!> を襲撃: <strong> </strong></p>"),he=h("<p>襲撃対象なし</p>"),xe=h('<section class="attack-section"><h3 class="svelte-1cf5h64">襲撃</h3> <!></section>'),me=h('<section class="divine-section"><h3 class="svelte-1cf5h64">占い</h3> <p><!> が <!> を占い: <strong> </strong></p></section>'),Ie=h('<section class="result-section"><h3 class="svelte-1cf5h64">結果</h3> <p><strong> </strong> が勝利</p></section>'),ye=h('<div class="day-column svelte-1cf5h64"><div class="day-section svelte-1cf5h64"><h2 class="svelte-1cf5h64"> <!> <!> <!> <!> <!> <!> <!></h2> <div class="scrollable-content svelte-1cf5h64"><!> <!> <!> <!> <!> <!> <!> <!></div></div></div>');function ke(e,s){ot(s,!1);let a=tt(s,"dayIdx",8),t=tt(s,"dayStatus",8);const f={};nt();var c=ye(),d=v(c),y=v(d),T=v(y),S=l(T);{var O=r=>{var i=te();D(i,"inline",!0),D(i,"icon","mdi:conversation"),u(r,i)};L(S,r=>{t().talks.length>0&&r(O)})}var q=l(S,2);{var M=r=>{var i=ee();D(i,"inline",!0),D(i,"icon","mdi:vote"),u(r,i)};L(q,r=>{t().votes.length>0&&r(M)})}var N=l(q,2);{var B=r=>{var i=ae();D(i,"inline",!0),D(i,"icon","mdi:account-remove"),u(r,i)};L(N,r=>{t().execution&&r(B)})}var et=l(N,2);{var J=r=>{var i=se();D(i,"inline",!0),D(i,"icon","mdi:vote"),u(r,i)};L(et,r=>{t().attackVotes.length>0&&r(J)})}var Z=l(et,2);{var ct=r=>{var i=re();D(i,"inline",!0),D(i,"icon","mdi:sword"),u(r,i)};L(Z,r=>{t().attack&&r(ct)})}var at=l(Z,2);{var _=r=>{var i=ie();D(i,"inline",!0),D(i,"icon","mdi:account-eye"),u(r,i)};L(at,r=>{t().divine&&r(_)})}var g=l(at,2);{var x=r=>{var i=ne();D(i,"inline",!0),D(i,"icon","mdi:trophy"),u(r,i)};L(g,r=>{t().result&&r(x)})}o(y);var k=l(y,2),R=v(k);{var j=r=>{var i=le(),m=l(v(i),2);Y(m,5,()=>Object.entries(t().agents),H,(E,I)=>{let p=()=>n(I)[0],b=()=>n(I)[1];var A=oe();const z=X(()=>`${"agent"+p().padStart(2,"0")} svelte-1cf5h64`);var rt=v(A);P(rt,{get agentIdx(){return p()}});var Vt=l(rt);o(A),V(()=>{$(A,n(z)),gt(A,"over",b().status!=="ALIVE"),W(Vt,` ${Ht[b().role]??"NULL"??""} -
                ${Jt[b().status]??"NULL"??""}`)}),u(E,A)}),o(m),o(i),u(r,i)};L(R,r=>{Object.keys(t().agents).length>0&&r(j)})}var w=l(R,2);{var U=r=>{var i=ve(),m=l(v(i),2);Y(m,5,()=>t().talks,H,(E,I)=>{var p=ce();const b=X(()=>`${"talk agent"+n(I).agentIdx.padStart(2,"0")} svelte-1cf5h64`);var A=v(p);P(A,{get agentIdx(){return n(I).agentIdx}});var z=l(A,2);$t(z,{get text(){return n(I).text}}),o(p),V(()=>{$(p,n(b)),gt(p,"over",n(I).text==="Over")}),u(E,p)}),o(m),o(i),u(r,i)};L(w,r=>{t().talks.length>0&&r(U)})}var G=l(w,2);{var Q=r=>{var i=de(),m=l(v(i),2);Y(m,5,()=>t().votes,H,(E,I)=>{var p=_e();const b=X(()=>`${"agent"+n(I).agentIdx.padStart(2,"0")} svelte-1cf5h64`);var A=v(p);P(A,{get agentIdx(){return n(I).agentIdx}});var z=l(A,2);P(z,{get agentIdx(){return n(I).targetIdx},highlight:!0}),it(),o(p),V(()=>$(p,n(b))),u(E,p)}),o(m),o(i),u(r,i)};L(G,r=>{t().votes.length>0&&r(Q)})}var st=l(G,2);{var vt=r=>{var i=ue(),m=l(v(i),2),E=v(m);P(E,{get agentIdx(){return t().execution.agentIdx},highlight:!0}),it(),o(m),o(i),u(r,i)};L(st,r=>{t().execution&&r(vt)})}var pt=l(st,2);{var St=r=>{var i=ge(),m=l(v(i),2);Y(m,5,()=>t().attackVotes,H,(E,I)=>{var p=fe();const b=X(()=>`${"agent"+n(I).agentIdx.padStart(2,"0")} svelte-1cf5h64`);var A=v(p);P(A,{get agentIdx(){return n(I).agentIdx}});var z=l(A,2);P(z,{get agentIdx(){return n(I).targetIdx},highlight:!0}),it(),o(p),V(()=>$(p,n(b))),u(E,p)}),o(m),o(i),u(r,i)};L(pt,r=>{t().attackVotes.length>0&&r(St)})}var ht=l(pt,2);{var Dt=r=>{var i=xe(),m=l(v(i),2);{var E=p=>{var b=pe(),A=v(b);P(A,{get agentIdx(){return t().attack.targetIdx},highlight:!0});var z=l(A,2),rt=v(z,!0);o(z),o(b),V(()=>W(rt,t().attack.isSuccessful?"成功":"失敗")),u(p,b)},I=p=>{var b=he();u(p,b)};L(m,p=>{t().attack.targetIdx!=="-1"?p(E):p(I,!1)})}o(i),u(r,i)};L(ht,r=>{t().attack&&r(Dt)})}var xt=l(ht,2);{var Ot=r=>{var i=me(),m=l(v(i),2),E=v(m);P(E,{get agentIdx(){return t().divine.agentIdx},highlight:!0});var I=l(E,2);P(I,{get agentIdx(){return t().divine.targetIdx},highlight:!0});var p=l(I,2),b=v(p,!0);o(p),o(m),o(i),V(()=>W(b,Qt[t().divine.result]??"NULL")),u(r,i)};L(xt,r=>{t().divine&&r(Ot)})}var Rt=l(xt,2);{var Ut=r=>{var i=Ie(),m=l(v(i),2),E=v(m),I=v(E,!0);o(E),it(),o(m),o(i),V(()=>W(I,Xt[t().result.winSide])),u(r,i)};L(Rt,r=>{t().result&&r(Ut)})}return o(k),o(d),o(c),V(()=>W(T,`Day ${a()??""} `)),u(e,c),Tt(s,"dayStatuses",f),lt({dayStatuses:f})}function dt(e){const s=e.split(/\r?\n/).filter(t=>t.trim()),a={};return s.forEach(t=>{const[f,c,...d]=t.split(",");a[f]||(a[f]=Le()),Ee(a[f],c,d)}),a}function Le(){return{agents:{},talks:[],votes:[],execution:null,divine:null,attackVotes:[],attack:null,result:null}}function Ee(e,s,a){const f={status:([c,d,y,T])=>{e.agents[c]={role:d,status:y,name:T}},talk:([c,d,y,T])=>{e.talks.push({talkIdx:c,turnIdx:d,agentIdx:y,text:T})},vote:([c,d])=>{e.votes.push({agentIdx:c,targetIdx:d})},execute:([c,d])=>{e.execution={agentIdx:c,role:d}},divine:([c,d,y])=>{e.divine={agentIdx:c,targetIdx:d,result:y}},attackVote:([c,d])=>{e.attackVotes.push({agentIdx:c,targetIdx:d})},attack:([c,d])=>{e.attack={targetIdx:c,isSuccessful:d==="true"}},result:([c,d,y])=>{e.result={villagers:c,werewolves:d,winSide:y}}}[s];f&&f(a)}var be=h('<link rel="stylesheet">'),Ae=h("<option> </option>"),Te=h('<div class="tab-wrapper svelte-1vycxas"><button class="tab-button svelte-1vycxas"> </button> <button class="close-button svelte-1vycxas" aria-label="Close tab">✕</button></div>'),Se=h('<div class="log-container svelte-1vycxas"><div class="tabs-container svelte-1vycxas"><div class="tabs svelte-1vycxas"></div></div> <div class="days-container svelte-1vycxas"></div></div>'),De=h('<main class="svelte-1vycxas"><div class="input-controls svelte-1vycxas"><div class="select-container svelte-1vycxas"><select class="svelte-1vycxas"><option>サンプルログを選択</option><!></select></div> <div tabindex="0" class="file-input-container svelte-1vycxas" role="button"><div class="file-input-label svelte-1vycxas">ファイルを選択もしくはドラッグアンドドロップしてください</div></div> <input id="fileInput" type="file" accept=".log" multiple hidden></div> <style></style> <!></main>');function Pe(e,s){ot(s,!1);let a=_t([]),t=_t(0);function f(_){const g=_.target;Array.from(g.files||[]).forEach(k=>{const R=new FileReader;R.onload=j=>{var U;const w=((U=j.target)==null?void 0:U.result)??"";F(a,[...n(a),{name:k.name,processed:dt(w)}]),F(t,n(a).length-1)},R.readAsText(k)}),g&&(g.value="")}function c(_){var x;Array.from(((x=_.dataTransfer)==null?void 0:x.files)||[]).forEach(k=>{const R=new FileReader;R.onload=j=>{var U;const w=((U=j.target)==null?void 0:U.result)??"";F(a,[...n(a),{name:k.name,processed:dt(w)}]),F(t,n(a).length-1)},R.readAsText(k)})}function d(_){F(a,n(a).filter((g,x)=>x!==_)),n(t)>=n(a).length&&F(t,n(a).length-1)}const y=Object.entries(Object.assign({"/static/assets/1734125235_kanolab_Mille_UEC-IL_sUper_IL_satozaki.log":()=>C(()=>import("../chunks/1734125235_kanolab_Mille_UEC-IL_sUper_IL_satozaki.CxPUTjnS.js"),[],import.meta.url),"/static/assets/1734126573_Mille_kanolab_sUper_IL_satozaki_UEC-IL.log":()=>C(()=>import("../chunks/1734126573_Mille_kanolab_sUper_IL_satozaki_UEC-IL.Ch4hCXju.js"),[],import.meta.url),"/static/assets/1734322165_satozaki_Mille_sUper_IL_kanolab_barneko.log":()=>C(()=>import("../chunks/1734322165_satozaki_Mille_sUper_IL_kanolab_barneko.D6Ada88o.js"),[],import.meta.url),"/static/assets/1734322532_barneko_Mille_satozaki_kanolab_sUper_IL.log":()=>C(()=>import("../chunks/1734322532_barneko_Mille_satozaki_kanolab_sUper_IL.BmNzAw4g.js"),[],import.meta.url),"/static/assets/1734328995_CanisLupus_barneko_Mille_satozaki_sUper_IL.log":()=>C(()=>import("../chunks/1734328995_CanisLupus_barneko_Mille_satozaki_sUper_IL.Dh5zF3NH.js"),[],import.meta.url),"/static/assets/1734329414_Mille_UEC-IL_kanolab_CanisLupus_satozaki.log":()=>C(()=>import("../chunks/1734329414_Mille_UEC-IL_kanolab_CanisLupus_satozaki.B-nbrCmY.js"),[],import.meta.url),"/static/assets/1734329757_UEC-IL_sUper_IL_barneko_CanisLupus_satozaki.log":()=>C(()=>import("../chunks/1734329757_UEC-IL_sUper_IL_barneko_CanisLupus_satozaki.CZBC5jrw.js"),[],import.meta.url),"/static/assets/1734335625_satozaki_CanisLupus_UEC-IL_sUper_IL_barneko.log":()=>C(()=>import("../chunks/1734335625_satozaki_CanisLupus_UEC-IL_sUper_IL_barneko.JWZkbpfe.js"),[],import.meta.url),"/static/assets/1734336483_Mille_barneko_sUper_IL_satozaki_UEC-IL.log":()=>C(()=>import("../chunks/1734336483_Mille_barneko_sUper_IL_satozaki_UEC-IL.gGfePD1C.js"),[],import.meta.url),"/static/assets/1734336998_sUper_IL_satozaki_CanisLupus_kanolab_Mille.log":()=>C(()=>import("../chunks/1734336998_sUper_IL_satozaki_CanisLupus_kanolab_Mille.oHz1b7i6.js"),[],import.meta.url),"/static/assets/1734339025_Mille_kanolab_CanisLupus_sUper_IL_satozaki.log":()=>C(()=>import("../chunks/1734339025_Mille_kanolab_CanisLupus_sUper_IL_satozaki.K60EV997.js"),[],import.meta.url)})).map(([_,g])=>({name:_.split("/").pop()||"",path:`${Lt}${_.replace("/static","")}`}));async function T(_,g){try{const k=await(await fetch(_)).text();F(a,[...n(a),{name:g,processed:dt(k)}]),F(t,n(a).length-1)}catch(x){console.error("Error loading asset log:",x)}}let S=_t(null);nt();var O=De();Bt(_=>{var g=be();qt.title="aiwolf-nlp-viewer",bt(g,"href",`${Lt??""}/global.css`),u(_,g)});var q=v(O),M=v(q),N=v(M),B=v(N);B.value=((B.__value="")==null,"");var et=l(B);Y(et,1,()=>y,H,(_,g)=>{var x=Ae(),k={},R=v(x,!0);o(x),V(()=>{k!==(k=n(g).path)&&(x.value=(x.__value=n(g).path)==null?"":n(g).path),W(R,n(g).name)}),u(_,x)}),o(N),o(M);var J=l(M,2),Z=l(J,2);Mt(Z,_=>F(S,_),()=>n(S)),o(q);var ct=l(q,4);{var at=_=>{var g=Se(),x=v(g),k=v(x);Y(k,5,()=>n(a),H,(j,w,U)=>{var G=Te(),Q=v(G),st=v(Q,!0);o(Q);var vt=l(Q,2);o(G),V(()=>{gt(G,"active",n(t)===U),W(st,n(w).name)}),K("click",Q,()=>F(t,U)),K("click",vt,()=>d(U)),u(j,G)}),o(k),o(x);var R=l(x,2);Y(R,5,()=>Object.entries(n(a)[n(t)].processed),H,(j,w)=>{let U=()=>n(w)[0],G=()=>n(w)[1];ke(j,{get dayIdx(){return U()},get dayStatus(){return G()},get dayStatuses(){return n(a)[n(t)].processed}})}),o(R),o(g),u(_,g)};L(ct,_=>{n(a).length>0&&_(at)})}o(O),K("change",N,_=>{const g=_.currentTarget.value;if(g){const x=y.find(k=>k.path===g);x&&T(x.path,x.name),_.currentTarget.value=""}}),K("dragover",J,Et(function(_){Yt.call(this,s,_)})),K("drop",J,Et(c)),K("click",J,()=>{var _;return(_=n(S))==null?void 0:_.click()}),K("keydown",J,_=>{var g;_.key==="Enter"&&((g=n(S))==null||g.click())}),K("change",Z,f),u(e,O),lt()}export{Pe as component};
