import{y as d,C as f,at as v,Q as u,au as p,av as h,B as i,J as o,D as E,A as T}from"./sDBeb3T2.js";function g(r){var t=document.createElement("template");return t.innerHTML=r,t.content}function n(r,t){var e=u;e.nodes_start===null&&(e.nodes_start=r,e.nodes_end=t)}function x(r,t){var e=(t&p)!==0,_=(t&h)!==0,a,c=!r.startsWith("<!>");return()=>{if(i)return n(o,null),o;a===void 0&&(a=g(c?r:"<!>"+r),e||(a=f(a)));var s=_||v?document.importNode(a,!0):a.cloneNode(!0);if(e){var m=f(s),l=s.lastChild;n(m,l)}else n(s,s);return s}}function M(r=""){if(!i){var t=d(r+"");return n(t,t),t}var e=o;return e.nodeType!==3&&(e.before(e=d()),T(e)),n(e,e),e}function A(){if(i)return n(o,null),o;var r=document.createDocumentFragment(),t=document.createComment(""),e=d();return r.append(t,e),n(t,e),r}function N(r,t){if(i){u.nodes_end=o,E();return}r!==null&&r.before(t)}export{N as a,M as b,A as c,n as d,x as t};
