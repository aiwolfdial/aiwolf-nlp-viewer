import{B,ah as O,ai as A,af as H,aj as M,a3 as I,ax as b,R as P,as as j,ae as C,ay as T,W as g,O as D,T as W,X as v,Y as $,az as q,aA as z,aa as K,a2 as Q,aB as X,K as F,_ as G,Q as E,p as J,D as U,a as Z}from"./WljbgmZ9.js";import{r as x}from"./DvJjqZJ0.js";import{b as aa}from"./KF065-Of.js";const ra=["touchstart","touchmove"];function ea(a){return ra.includes(a)}const L=new Set,R=new Set;function ia(a){for(var r=0;r<a.length;r++)L.add(a[r]);for(var t of R)t(a)}function m(a){var N;var r=this,t=r.ownerDocument,c=a.type,i=((N=a.composedPath)==null?void 0:N.call(a))||[],e=i[0]||a.target,d=0,_=a.__root;if(_){var u=i.indexOf(_);if(u!==-1&&(r===document||r===window)){a.__root=r;return}var h=i.indexOf(r);if(h===-1)return;u<=h&&(d=u)}if(e=i[d]||a.target,e!==r){B(a,"currentTarget",{configurable:!0,get(){return e||t}});var w=M,o=I;O(null),A(null);try{for(var s,n=[];e!==null;){var f=e.assignedSlot||e.parentNode||e.host||null;try{var l=e["__"+c];if(l!==void 0&&!e.disabled)if(H(l)){var[Y,...k]=l;Y.apply(e,[a,...k])}else l.call(e,a)}catch(y){s?n.push(y):s=y}if(a.cancelBubble||f===r||f===null)break;e=f}if(s){for(let y of n)queueMicrotask(()=>{throw y});throw s}}finally{a.__root=r,delete a.currentTarget,O(w),A(o)}}}function fa(a,r){var t=r==null?"":typeof r=="object"?r+"":r;t!==(a.__t??(a.__t=a.nodeValue))&&(a.__t=t,a.nodeValue=t+"")}function ta(a,r){return V(a,r)}function da(a,r){b(),r.intro=r.intro??!1;const t=r.target,c=E,i=v;try{for(var e=P(t);e&&(e.nodeType!==8||e.data!==j);)e=C(e);if(!e)throw T;g(!0),D(e),W();const d=V(a,{...r,anchor:e});if(v===null||v.nodeType!==8||v.data!==$)throw q(),T;return g(!1),d}catch(d){if(d===T)return r.recover===!1&&z(),b(),K(t),g(!1),ta(a,r);throw d}finally{g(c),D(i),x()}}const p=new Map;function V(a,{target:r,anchor:t,props:c={},events:i,context:e,intro:d=!0}){b();var _=new Set,u=o=>{for(var s=0;s<o.length;s++){var n=o[s];if(!_.has(n)){_.add(n);var f=ea(n);r.addEventListener(n,m,{passive:f});var l=p.get(n);l===void 0?(document.addEventListener(n,m,{passive:f}),p.set(n,1)):p.set(n,l+1)}}};u(Q(L)),R.add(u);var h=void 0,w=X(()=>{var o=t??r.appendChild(F());return G(()=>{if(e){J({});var s=U;s.c=e}i&&(c.$$events=i),E&&aa(o,null),h=a(o,c)||{},E&&(I.nodes_end=v),e&&Z()}),()=>{var f;for(var s of _){r.removeEventListener(s,m);var n=p.get(s);--n===0?(document.removeEventListener(s,m),p.delete(s)):p.set(s,n)}R.delete(u),o!==t&&((f=o.parentNode)==null||f.removeChild(o))}});return S.set(h,w),h}let S=new WeakMap;function ua(a,r){const t=S.get(a);return t?(S.delete(a),t(r)):Promise.resolve()}export{ia as d,da as h,ta as m,fa as s,ua as u};
