/* 画面を更新したら CACHE の数字を1つ増やすこと（古い画面が残るため） */
var CACHE = 'excelquest-v1';
var FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './assets/hero-bg.jpg',
  './assets/pen-boy.png',
  './assets/pen-girl.png',
  './assets/face-boy.png',
  './assets/face-girl.png'
];

self.addEventListener('install', function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(FILES); }).catch(function(){}));
});

self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  // BGM(mp3)は大きいので通信から取得する
  if(e.request.url.indexOf('.mp3') >= 0) return;
  e.respondWith(
    fetch(e.request).then(function(res){
      var copy = res.clone();
      caches.open(CACHE).then(function(c){ c.put(e.request, copy); }).catch(function(){});
      return res;
    }).catch(function(){ return caches.match(e.request).then(function(r){ return r || caches.match('./index.html'); }); })
  );
});
