if(!self.define){let e,i={};const t=(t,o)=>(t=new URL(t+".js",o).href,i[t]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=t,e.onload=i,document.head.appendChild(e)}else e=t,importScripts(t),i()})).then((()=>{let e=i[t];if(!e)throw new Error(`Module ${t} didn’t register its module`);return e})));self.define=(o,r)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(i[n])return;let s={};const l=e=>t(e,n),d={module:{uri:n},exports:s,require:l};i[n]=Promise.all(o.map((e=>d[e]||l(e)))).then((e=>(r(...e),s)))}}define(["./workbox-fa446783"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"registerSW.js",revision:"2c81d9b0ad45b1d70d93e4e5be816fdc"},{url:"index.html",revision:"0.4o9icipk93g"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"),{allowlist:[/^\/$/]}))}));
