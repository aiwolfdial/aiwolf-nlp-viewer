var on=Array.isArray,_n=Array.prototype.indexOf,zn=Array.from,Wn=Object.defineProperty,G=Object.getOwnPropertyDescriptor,cn=Object.getOwnPropertyDescriptors,vn=Object.prototype,hn=Array.prototype,Ct=Object.getPrototypeOf,Rt=Object.isExtensible;const Xn=()=>{};function Jn(t){return t()}function Pt(t){for(var e=0;e<t.length;e++)t[e]()}const x=2,Ft=4,ut=8,gt=16,O=32,B=64,et=128,m=256,rt=512,y=1024,I=2048,q=4096,Y=8192,ot=16384,pn=32768,Mt=65536,Qn=1<<17,dn=1<<19,qt=1<<20,dt=1<<21,C=Symbol("$state"),te=Symbol("legacy props"),ne=Symbol("");function Lt(t){return t===this.v}function wn(t,e){return t!=t?e==e:t!==e||t!==null&&typeof t=="object"||typeof t=="function"}function jt(t){return!wn(t,this.v)}function yn(t){throw new Error("https://svelte.dev/e/effect_in_teardown")}function En(){throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function gn(t){throw new Error("https://svelte.dev/e/effect_orphan")}function mn(){throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function ee(){throw new Error("https://svelte.dev/e/hydration_failed")}function re(t){throw new Error("https://svelte.dev/e/props_invalid_value")}function Tn(){throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function An(){throw new Error("https://svelte.dev/e/state_prototype_fixed")}function xn(){throw new Error("https://svelte.dev/e/state_unsafe_mutation")}let _t=!1;function ae(){_t=!0}const le=1,se=2,fe=4,ie=8,ue=16,oe=1,_e=2,ce=4,ve=8,he=16,pe=1,de=2,bn="[",Rn="[!",Dn="]",Yt={},E=Symbol(),we="http://www.w3.org/1999/xhtml";let p=null;function Dt(t){p=t}function ye(t,e=!1,n){var r=p={p,c:null,d:!1,e:null,m:!1,s:t,x:null,l:null};_t&&!e&&(p.l={s:null,u:null,r1:[],r2:Tt(!1)}),Cn(()=>{r.d=!0})}function Ee(t){const e=p;if(e!==null){const u=e.e;if(u!==null){var n=h,r=v;e.e=null;try{for(var a=0;a<u.length;a++){var l=u[a];st(l.effect),H(l.reaction),zt(l.fn)}}finally{st(n),H(r)}}p=e.p,e.m=!0}return{}}function ct(){return!_t||p!==null&&p.l===null}function j(t){if(typeof t!="object"||t===null||C in t)return t;const e=Ct(t);if(e!==vn&&e!==hn)return t;var n=new Map,r=on(t),a=k(0),l=v,u=i=>{var s=v;H(l);var f=i();return H(s),f};return r&&n.set("length",k(t.length)),new Proxy(t,{defineProperty(i,s,f){(!("value"in f)||f.configurable===!1||f.enumerable===!1||f.writable===!1)&&Tn();var _=n.get(s);return _===void 0?(_=u(()=>k(f.value)),n.set(s,_)):S(_,u(()=>j(f.value))),!0},deleteProperty(i,s){var f=n.get(s);if(f===void 0)s in i&&n.set(s,u(()=>k(E)));else{if(r&&typeof s=="string"){var _=n.get("length"),o=Number(s);Number.isInteger(o)&&o<_.v&&S(_,o)}S(f,E),It(a)}return!0},get(i,s,f){var A;if(s===C)return t;var _=n.get(s),o=s in i;if(_===void 0&&(!o||(A=G(i,s))!=null&&A.writable)&&(_=u(()=>k(j(o?i[s]:E))),n.set(s,_)),_!==void 0){var c=V(_);return c===E?void 0:c}return Reflect.get(i,s,f)},getOwnPropertyDescriptor(i,s){var f=Reflect.getOwnPropertyDescriptor(i,s);if(f&&"value"in f){var _=n.get(s);_&&(f.value=V(_))}else if(f===void 0){var o=n.get(s),c=o==null?void 0:o.v;if(o!==void 0&&c!==E)return{enumerable:!0,configurable:!0,value:c,writable:!0}}return f},has(i,s){var c;if(s===C)return!0;var f=n.get(s),_=f!==void 0&&f.v!==E||Reflect.has(i,s);if(f!==void 0||h!==null&&(!_||(c=G(i,s))!=null&&c.writable)){f===void 0&&(f=u(()=>k(_?j(i[s]):E)),n.set(s,f));var o=V(f);if(o===E)return!1}return _},set(i,s,f,_){var bt;var o=n.get(s),c=s in i;if(r&&s==="length")for(var A=f;A<o.v;A+=1){var Q=n.get(A+"");Q!==void 0?S(Q,E):A in i&&(Q=u(()=>k(E)),n.set(A+"",Q))}o===void 0?(!c||(bt=G(i,s))!=null&&bt.writable)&&(o=u(()=>k(void 0)),S(o,u(()=>j(f))),n.set(s,o)):(c=o.v!==E,S(o,u(()=>j(f))));var tt=Reflect.getOwnPropertyDescriptor(i,s);if(tt!=null&&tt.set&&tt.set.call(_,f),!c){if(r&&typeof s=="string"){var xt=n.get("length"),pt=Number(s);Number.isInteger(pt)&&pt>=xt.v&&S(xt,pt+1)}It(a)}return!0},ownKeys(i){V(a);var s=Reflect.ownKeys(i).filter(o=>{var c=n.get(o);return c===void 0||c.v!==E});for(var[f,_]of n)_.v!==E&&!(f in i)&&s.push(f);return s},setPrototypeOf(){An()}})}function It(t,e=1){S(t,t.v+e)}function Ot(t){try{if(t!==null&&typeof t=="object"&&C in t)return t[C]}catch{}return t}function ge(t,e){return Object.is(Ot(t),Ot(e))}function mt(t){var e=x|I,n=v!==null&&(v.f&x)!==0?v:null;return h===null||n!==null&&(n.f&m)!==0?e|=m:h.f|=qt,{ctx:p,deps:null,effects:null,equals:Lt,f:e,fn:t,reactions:null,rv:0,v:null,wv:0,parent:n??h}}function me(t){const e=mt(t);return rn(e),e}function Te(t){const e=mt(t);return e.equals=jt,e}function Ht(t){var e=t.effects;if(e!==null){t.effects=null;for(var n=0;n<e.length;n+=1)M(e[n])}}function In(t){for(var e=t.parent;e!==null;){if((e.f&x)===0)return e;e=e.parent}return null}function Bt(t){var e,n=h;st(In(t));try{Ht(t),e=fn(t)}finally{st(n)}return e}function Ut(t){var e=Bt(t),n=(N||(t.f&m)!==0)&&t.deps!==null?q:y;R(t,n),t.equals(e)||(t.v=e,t.wv=ln())}const $=new Map;function Tt(t,e){var n={f:0,v:t,reactions:null,equals:Lt,rv:0,wv:0};return n}function k(t,e){const n=Tt(t);return rn(n),n}function Ae(t,e=!1){var r;const n=Tt(t);return e||(n.equals=jt),_t&&p!==null&&p.l!==null&&((r=p.l).s??(r.s=[])).push(n),n}function S(t,e,n=!1){v!==null&&!D&&ct()&&(v.f&(x|gt))!==0&&!(w!=null&&w.includes(t))&&xn();let r=n?j(e):e;return On(t,r)}function On(t,e){if(!t.equals(e)){var n=t.v;X?$.set(t,e):$.set(t,n),t.v=e,(t.f&x)!==0&&((t.f&I)!==0&&Bt(t),R(t,(t.f&m)===0?y:q)),t.wv=ln(),Vt(t,I),ct()&&h!==null&&(h.f&y)!==0&&(h.f&(O|B))===0&&(T===null?Yn([t]):T.push(t))}return e}function Vt(t,e){var n=t.reactions;if(n!==null)for(var r=ct(),a=n.length,l=0;l<a;l++){var u=n[l],i=u.f;(i&I)===0&&(!r&&u===h||(R(u,e),(i&(y|m))!==0&&((i&x)!==0?Vt(u,q):ht(u))))}}function Gt(t){console.warn("https://svelte.dev/e/hydration_mismatch")}let F=!1;function xe(t){F=t}let b;function Z(t){if(t===null)throw Gt(),Yt;return b=t}function be(){return Z(L(b))}function Re(t){if(F){if(L(b)!==null)throw Gt(),Yt;b=t}}function De(t=1){if(F){for(var e=t,n=b;e--;)n=L(n);b=n}}function Ie(){for(var t=0,e=b;;){if(e.nodeType===8){var n=e.data;if(n===Dn){if(t===0)return e;t-=1}else(n===bn||n===Rn)&&(t+=1)}var r=L(e);e.remove(),e=r}}var kt,kn,Sn,Kt,$t;function Oe(){if(kt===void 0){kt=window,kn=document,Sn=/Firefox/.test(navigator.userAgent);var t=Element.prototype,e=Node.prototype,n=Text.prototype;Kt=G(e,"firstChild").get,$t=G(e,"nextSibling").get,Rt(t)&&(t.__click=void 0,t.__className=void 0,t.__attributes=null,t.__style=void 0,t.__e=void 0),Rt(n)&&(n.__t=void 0)}}function wt(t=""){return document.createTextNode(t)}function yt(t){return Kt.call(t)}function L(t){return $t.call(t)}function ke(t,e){if(!F)return yt(t);var n=yt(b);if(n===null)n=b.appendChild(wt());else if(e&&n.nodeType!==3){var r=wt();return n==null||n.before(r),Z(r),r}return Z(n),n}function Se(t,e){if(!F){var n=yt(t);return n instanceof Comment&&n.data===""?L(n):n}return b}function Ne(t,e=1,n=!1){let r=F?b:t;for(var a;e--;)a=r,r=L(r);if(!F)return r;var l=r==null?void 0:r.nodeType;if(n&&l!==3){var u=wt();return r===null?a==null||a.after(u):r.before(u),Z(u),u}return Z(r),r}function Ce(t){t.textContent=""}function Zt(t){h===null&&v===null&&gn(),v!==null&&(v.f&m)!==0&&h===null&&En(),X&&yn()}function Nn(t,e){var n=e.last;n===null?e.last=e.first=t:(n.next=t,t.prev=n,e.last=t)}function U(t,e,n,r=!0){var a=h,l={ctx:p,deps:null,nodes_start:null,nodes_end:null,f:t|I,first:null,fn:e,last:null,next:null,parent:a,prev:null,teardown:null,transitions:null,wv:0};if(n)try{At(l),l.f|=pn}catch(s){throw M(l),s}else e!==null&&ht(l);var u=n&&l.deps===null&&l.first===null&&l.nodes_start===null&&l.teardown===null&&(l.f&(qt|et))===0;if(!u&&r&&(a!==null&&Nn(l,a),v!==null&&(v.f&x)!==0)){var i=v;(i.effects??(i.effects=[])).push(l)}return l}function Cn(t){const e=U(ut,null,!1);return R(e,y),e.teardown=t,e}function Pe(t){Zt();var e=h!==null&&(h.f&O)!==0&&p!==null&&!p.m;if(e){var n=p;(n.e??(n.e=[])).push({fn:t,effect:h,reaction:v})}else{var r=zt(t);return r}}function Fe(t){return Zt(),Pn(t)}function Me(t){const e=U(B,t,!0);return(n={})=>new Promise(r=>{n.outro?qn(e,()=>{M(e),r(void 0)}):(M(e),r(void 0))})}function zt(t){return U(Ft,t,!1)}function Pn(t){return U(ut,t,!0)}function qe(t,e=[],n=mt){const r=e.map(n);return Fn(()=>t(...r.map(V)))}function Fn(t,e=0){return U(ut|gt|e,t,!0)}function Le(t,e=!0){return U(ut|O,t,!0,e)}function Wt(t){var e=t.teardown;if(e!==null){const n=X,r=v;Nt(!0),H(null);try{e.call(null)}finally{Nt(n),H(r)}}}function Xt(t,e=!1){var n=t.first;for(t.first=t.last=null;n!==null;){var r=n.next;(n.f&B)!==0?n.parent=null:M(n,e),n=r}}function Mn(t){for(var e=t.first;e!==null;){var n=e.next;(e.f&O)===0&&M(e),e=n}}function M(t,e=!0){var n=!1;if((e||(t.f&dn)!==0)&&t.nodes_start!==null){for(var r=t.nodes_start,a=t.nodes_end;r!==null;){var l=r===a?null:L(r);r.remove(),r=l}n=!0}Xt(t,e&&!n),it(t,0),R(t,ot);var u=t.transitions;if(u!==null)for(const s of u)s.stop();Wt(t);var i=t.parent;i!==null&&i.first!==null&&Jt(t),t.next=t.prev=t.teardown=t.ctx=t.deps=t.fn=t.nodes_start=t.nodes_end=null}function Jt(t){var e=t.parent,n=t.prev,r=t.next;n!==null&&(n.next=r),r!==null&&(r.prev=n),e!==null&&(e.first===t&&(e.first=r),e.last===t&&(e.last=n))}function qn(t,e){var n=[];Qt(t,n,!0),Ln(n,()=>{M(t),e&&e()})}function Ln(t,e){var n=t.length;if(n>0){var r=()=>--n||e();for(var a of t)a.out(r)}else e()}function Qt(t,e,n){if((t.f&Y)===0){if(t.f^=Y,t.transitions!==null)for(const u of t.transitions)(u.is_global||n)&&e.push(u);for(var r=t.first;r!==null;){var a=r.next,l=(r.f&Mt)!==0||(r.f&O)!==0;Qt(r,e,l?n:!1),r=a}}}function je(t){tn(t,!0)}function tn(t,e){if((t.f&Y)!==0){t.f^=Y,(t.f&y)===0&&(t.f^=y),J(t)&&(R(t,I),ht(t));for(var n=t.first;n!==null;){var r=n.next,a=(n.f&Mt)!==0||(n.f&O)!==0;tn(n,a?e:!1),n=r}if(t.transitions!==null)for(const l of t.transitions)(l.is_global||e)&&l.in()}}const jn=typeof requestIdleCallback>"u"?t=>setTimeout(t,1):requestIdleCallback;let z=[],W=[];function nn(){var t=z;z=[],Pt(t)}function en(){var t=W;W=[],Pt(t)}function Ye(t){z.length===0&&queueMicrotask(nn),z.push(t)}function He(t){W.length===0&&jn(en),W.push(t)}function St(){z.length>0&&nn(),W.length>0&&en()}let nt=!1,at=!1,lt=null,P=!1,X=!1;function Nt(t){X=t}let K=[];let v=null,D=!1;function H(t){v=t}let h=null;function st(t){h=t}let w=null;function rn(t){v!==null&&v.f&dt&&(w===null?w=[t]:w.push(t))}let d=null,g=0,T=null;function Yn(t){T=t}let an=1,ft=0,N=!1;function ln(){return++an}function J(t){var o;var e=t.f;if((e&I)!==0)return!0;if((e&q)!==0){var n=t.deps,r=(e&m)!==0;if(n!==null){var a,l,u=(e&rt)!==0,i=r&&h!==null&&!N,s=n.length;if(u||i){var f=t,_=f.parent;for(a=0;a<s;a++)l=n[a],(u||!((o=l==null?void 0:l.reactions)!=null&&o.includes(f)))&&(l.reactions??(l.reactions=[])).push(f);u&&(f.f^=rt),i&&_!==null&&(_.f&m)===0&&(f.f^=m)}for(a=0;a<s;a++)if(l=n[a],J(l)&&Ut(l),l.wv>t.wv)return!0}(!r||h!==null&&!N)&&R(t,y)}return!1}function Hn(t,e){for(var n=e;n!==null;){if((n.f&et)!==0)try{n.fn(t);return}catch{n.f^=et}n=n.parent}throw nt=!1,t}function Bn(t){return(t.f&ot)===0&&(t.parent===null||(t.parent.f&et)===0)}function vt(t,e,n,r){if(nt){if(n===null&&(nt=!1),Bn(e))throw t;return}n!==null&&(nt=!0);{Hn(t,e);return}}function sn(t,e,n=!0){var r=t.reactions;if(r!==null)for(var a=0;a<r.length;a++){var l=r[a];w!=null&&w.includes(t)||((l.f&x)!==0?sn(l,e,!1):e===l&&(n?R(l,I):(l.f&y)!==0&&R(l,q),ht(l)))}}function fn(t){var A;var e=d,n=g,r=T,a=v,l=N,u=w,i=p,s=D,f=t.f;d=null,g=0,T=null,N=(f&m)!==0&&(D||!P||v===null),v=(f&(O|B))===0?t:null,w=null,Dt(t.ctx),D=!1,ft++,t.f|=dt;try{var _=(0,t.fn)(),o=t.deps;if(d!==null){var c;if(it(t,g),o!==null&&g>0)for(o.length=g+d.length,c=0;c<d.length;c++)o[g+c]=d[c];else t.deps=o=d;if(!N)for(c=g;c<o.length;c++)((A=o[c]).reactions??(A.reactions=[])).push(t)}else o!==null&&g<o.length&&(it(t,g),o.length=g);if(ct()&&T!==null&&!D&&o!==null&&(t.f&(x|q|I))===0)for(c=0;c<T.length;c++)sn(T[c],t);return a!==t&&(ft++,T!==null&&(r===null?r=T:r.push(...T))),_}finally{d=e,g=n,T=r,v=a,N=l,w=u,Dt(i),D=s,t.f^=dt}}function Un(t,e){let n=e.reactions;if(n!==null){var r=_n.call(n,t);if(r!==-1){var a=n.length-1;a===0?n=e.reactions=null:(n[r]=n[a],n.pop())}}n===null&&(e.f&x)!==0&&(d===null||!d.includes(e))&&(R(e,q),(e.f&(m|rt))===0&&(e.f^=rt),Ht(e),it(e,0))}function it(t,e){var n=t.deps;if(n!==null)for(var r=e;r<n.length;r++)Un(t,n[r])}function At(t){var e=t.f;if((e&ot)===0){R(t,y);var n=h,r=p,a=P;h=t,P=!0;try{(e&gt)!==0?Mn(t):Xt(t),Wt(t);var l=fn(t);t.teardown=typeof l=="function"?l:null,t.wv=an;var u=t.deps,i}catch(s){vt(s,t,n,r||t.ctx)}finally{P=a,h=n}}}function Vn(){try{mn()}catch(t){if(lt!==null)vt(t,lt,null);else throw t}}function un(){var t=P;try{var e=0;for(P=!0;K.length>0;){e++>1e3&&Vn();var n=K,r=n.length;K=[];for(var a=0;a<r;a++){var l=Kn(n[a]);Gn(l)}$.clear()}}finally{at=!1,P=t,lt=null}}function Gn(t){var e=t.length;if(e!==0)for(var n=0;n<e;n++){var r=t[n];if((r.f&(ot|Y))===0)try{J(r)&&(At(r),r.deps===null&&r.first===null&&r.nodes_start===null&&(r.teardown===null?Jt(r):r.fn=null))}catch(a){vt(a,r,null,r.ctx)}}}function ht(t){at||(at=!0,queueMicrotask(un));for(var e=lt=t;e.parent!==null;){e=e.parent;var n=e.f;if((n&(B|O))!==0){if((n&y)===0)return;e.f^=y}}K.push(e)}function Kn(t){for(var e=[],n=t;n!==null;){var r=n.f,a=(r&(O|B))!==0,l=a&&(r&y)!==0;if(!l&&(r&Y)===0){if((r&Ft)!==0)e.push(n);else if(a)n.f^=y;else{var u=v;try{v=n,J(n)&&At(n)}catch(f){vt(f,n,null,n.ctx)}finally{v=u}}var i=n.first;if(i!==null){n=i;continue}}var s=n.parent;for(n=n.next;n===null&&s!==null;)n=s.next,s=s.parent}return e}function $n(t){var e;for(St();K.length>0;)at=!0,un(),St();return e}async function Be(){await Promise.resolve(),$n()}function V(t){var e=t.f,n=(e&x)!==0;if(v!==null&&!D){if(!(w!=null&&w.includes(t))){var r=v.deps;t.rv<ft&&(t.rv=ft,d===null&&r!==null&&r[g]===t?g++:d===null?d=[t]:(!N||!d.includes(t))&&d.push(t))}}else if(n&&t.deps===null&&t.effects===null){var a=t,l=a.parent;l!==null&&(l.f&m)===0&&(a.f^=m)}return n&&(a=t,J(a)&&Ut(a)),X&&$.has(t)?$.get(t):t.v}function Ue(t){var e=D;try{return D=!0,t()}finally{D=e}}const Zn=-7169;function R(t,e){t.f=t.f&Zn|e}function Ve(t){if(!(typeof t!="object"||!t||t instanceof EventTarget)){if(C in t)Et(t);else if(!Array.isArray(t))for(let e in t){const n=t[e];typeof n=="object"&&n&&C in n&&Et(n)}}}function Et(t,e=new Set){if(typeof t=="object"&&t!==null&&!(t instanceof EventTarget)&&!e.has(t)){e.add(t),t instanceof Date&&t.getTime();for(let r in t)try{Et(t[r],e)}catch{}const n=Ct(t);if(n!==Object.prototype&&n!==Array.prototype&&n!==Map.prototype&&n!==Set.prototype&&n!==Date.prototype){const r=cn(n);for(let a in r){const l=r[a].get;if(l)try{l.call(t)}catch{}}}}}export{kn as $,yt as A,be as B,Te as C,Ie as D,fe as E,xe as F,b as G,Rn as H,Dn as I,je as J,Le as K,qn as L,Y as M,zn as N,h as O,le as P,On as Q,se as R,C as S,Tt as T,ie as U,Qt as V,Ce as W,Ln as X,M as Y,ue as Z,L as _,Ee as a,on as a0,ct as a1,ge as a2,H as a3,st as a4,v as a5,Mt as a6,bn as a7,E as a8,dn as a9,Sn as aA,pe as aB,de as aC,$n as aD,k as aE,Be as aF,me as aG,De as aH,Xn as aa,Cn as ab,Wn as ac,G as ad,j as ae,te as af,ve as ag,re as ah,Qn as ai,ce as aj,jt as ak,he as al,_t as am,_e as an,oe as ao,wn as ap,Ct as aq,ne as ar,we as as,cn as at,He as au,Oe as av,Yt as aw,Gt as ax,ee as ay,Me as az,Pn as b,ke as c,S as d,zt as e,Se as f,V as g,p as h,Fe as i,Pe as j,Pt as k,Jn as l,Ae as m,Ve as n,mt as o,ye as p,Ye as q,Re as r,Ne as s,qe as t,Ue as u,ae as v,wt as w,Fn as x,Z as y,F as z};
