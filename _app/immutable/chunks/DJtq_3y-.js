function e(t){var o,n,r="";if(typeof t=="string"||typeof t=="number")r+=t;else if(typeof t=="object")if(Array.isArray(t)){var a=t.length;for(o=0;o<a;o++)t[o]&&(n=e(t[o]))&&(r&&(r+=" "),r+=n)}else for(n in t)t[n]&&(r&&(r+=" "),r+=n);return r}function s(){for(var t,o,n=0,r="",a=arguments.length;n<a;n++)(t=arguments[n])&&(o=e(t))&&(r&&(r+=" "),r+=o);return r}function i(t){return typeof t=="object"?s(t):t??""}const R={VILLAGER:"村人",SEER:"占い師",MEDIUM:"霊能者",BODYGUARD:"騎士",WEREWOLF:"人狼",POSSESSED:"狂人"},S={ALIVE:"生存",DEAD:"死亡"},E={HUMAN:"人間",WEREWOLF:"人狼"},f={VILLAGER:"村人陣営",WEREWOLF:"人狼陣営"},c={VILLAGER:"HUMAN",SEER:"HUMAN",MEDIUM:"HUMAN",BODYGUARD:"HUMAN",WEREWOLF:"WEREWOLF",POSSESSED:"HUMAN"},A={kanolab1:"[チーム名]"};function p(t){return`Agent[${t.toString().padStart(2,"0")}]`}function M(t){return t?E[c[t]]:"不明"}export{p as I,A as R,S,f as T,R as a,E as b,i as c,M as d};
