import{as as o,at as n,au as v,l as g,t as E,ay as L,B as c,I as u,az as A,aA as p}from"./DTUKudzx.js";let l=!1;function N(){l||(l=!0,document.addEventListener("reset",s=>{Promise.resolve().then(()=>{var t;if(!s.defaultPrevented)for(const a of s.target.elements)(t=a.__on_r)==null||t.call(a)})},{capture:!0}))}function y(s){if(c){var t=!1,a=()=>{if(!t){if(t=!0,s.hasAttribute("value")){var e=s.value;f(s,"value",null),s.value=e}if(s.hasAttribute("checked")){var r=s.checked;f(s,"checked",null),s.checked=r}}};s.__on_r=a,p(a),N()}}function R(s,t){var a=s.__attributes??(s.__attributes={});a.value===(a.value=t??void 0)||s.value===t&&(t!==0||s.nodeName!=="PROGRESS")||(s.value=t??"")}function k(s,t){var a=s.__attributes??(s.__attributes={});a.checked!==(a.checked=t??void 0)&&(s.checked=t)}function f(s,t,a,e){var r=s.__attributes??(s.__attributes={});c&&(r[t]=s.getAttribute(t),t==="src"||t==="srcset"||t==="href"&&s.nodeName==="LINK")||r[t]!==(r[t]=a)&&(t==="style"&&"__styles"in s&&(s.__styles={}),t==="loading"&&(s[L]=a),a==null?s.removeAttribute(t):typeof a!="string"&&d(s).includes(t)?s[t]=a:s.setAttribute(t,a))}function I(s,t,a){var e=v,r=g;let i=c;c&&u(!1),o(null),n(null);try{(_.has(s.nodeName)||!customElements||customElements.get(s.tagName.toLowerCase())?d(s).includes(t):a&&typeof a=="object")?s[t]=a:f(s,t,a==null?a:String(a))}finally{o(e),n(r),i&&u(!0)}}var _=new Map;function d(s){var t=_.get(s.nodeName);if(t)return t;_.set(s.nodeName,t=[]);for(var a,e=s,r=Element.prototype;r!==e;){a=A(e);for(var i in a)a[i].set&&t.push(i);e=E(e)}return t}function M(s,t,a){var e=s.__className,r=h(t,a);c&&s.className===r?s.__className=r:(e!==r||c&&s.className!==r)&&(t==null&&!a?s.removeAttribute("class"):s.className=r,s.__className=r)}function h(s,t){return(s??"")+(t?" "+t:"")}function O(s,t,a){if(a){if(s.classList.contains(t))return;s.classList.add(t)}else{if(!s.classList.contains(t))return;s.classList.remove(t)}}const D={VILLAGER:"村人",SEER:"占い師",MEDIUM:"霊能者",BODYGUARD:"騎士",WEREWOLF:"人狼",POSSESSED:"狂人"},W={ALIVE:"生存",DEAD:"死亡"},T={HUMAN:"人間",WEREWOLF:"人狼"},w={VILLAGER:"村人陣営",WEREWOLF:"人狼陣営"},G={kanolab1:"[チーム名]"};function b(s){return`Agent[${s.toString().padStart(2,"0")}]`}export{b as I,G as R,W as S,w as T,I as a,R as b,k as c,M as d,D as e,T as f,y as r,f as s,O as t};
