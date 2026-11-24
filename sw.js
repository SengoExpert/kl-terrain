// KL Groupe Terrain : mode hors ligne. Version 20261124-232824
const APP='kl-terrain-20261124-232824',FONTS='kl-terrain-polices';
const FILES=["./", "index.html", "manifest.webmanifest", "lib/jspdf.umd.min.js", "lib/jspdf.plugin.autotable.min.js", "lib/jszip.min.js", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(APP).then(c=>c.addAll(FILES)))});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==APP&&k!==FONTS).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);if(r.method!=='GET')return;
  if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){
    e.respondWith(caches.open(FONTS).then(c=>c.match(r).then(hit=>{const net=fetch(r).then(res=>{c.put(r,res.clone());return res}).catch(()=>hit);return hit||net})));return}
  if(u.origin!==location.origin)return;
  if(r.mode==='navigate'||u.pathname.endsWith('/index.html')){
    const net=fetch(r.url,{cache:'no-store'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(APP).then(c=>c.put('index.html',cp))}return res});
    const late=new Promise(ok=>setTimeout(()=>caches.match('index.html').then(h=>h&&ok(h)),4000));
    e.respondWith(Promise.race([net,late]).catch(()=>caches.match('index.html')));return}
  if(u.pathname.endsWith('/version.json'))return;
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r)));
});
