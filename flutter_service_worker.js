'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"main.dart.js": "55f4a68733f9ac79711313bd7967fb30",
"assets/AssetManifest.bin": "75ca25516b38972973d02db09111705a",
"assets/assets/logos/logo_nobackground_smaller2.png": "53bb719bb28ccf11afdd47fc2b075454",
"assets/assets/logos/squircle_logo_nobackground.png": "42b68ce3ad77e00d4287d69b1cd95e27",
"assets/assets/placeholders/default_profile_image.png": "43bb3d57eeb7b08ad8b2934361054ad1",
"assets/assets/backgrounds/typewriter1.jpg": "b2b124a080803d6abcff7d1f3c22961c",
"assets/assets/backgrounds/typewriter2.jpg": "261fbe3b4d8d61cdbb8d413254fabcbb",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"assets/NOTICES": "6e6b9d16948e796d1f6a27b9d0f3909a",
"assets/fonts/MaterialIcons-Regular.otf": "f346f94d485c6ad9ae64e10769abb582",
"assets/packages/nowplaying/assets/apple_music.png": "3cd841a0aecd64a9b221d7b9d4448f96",
"assets/AssetManifest.json": "edf52d8877764d0f22d4d155a5c37aa0",
"index.html": "7e4fb885a858ae8f3aa7cef448436960",
"/": "7e4fb885a858ae8f3aa7cef448436960",
"flutter.js": "6fef97aeca90b426343ba6c5c9dc5d4a",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"version.json": "db1a5452de2708e17a108418b4b7df33",
"icons/ms-icon-70x70.png": "64a2b4c813def324dbd41d9cafe3bde0",
"icons/favicon-32x32.png": "508f968970c277b74abecac320b9b65c",
"icons/apple-icon-76x76.png": "be70aa125e7826cfe54caab721455edf",
"icons/ms-icon-310x310.png": "d2034cf85c0ceafbba70bc32520620f0",
"icons/ms-icon-150x150.png": "0171088f263b914af19310b517f08109",
"icons/favicon.ico": "d4ad23ce6eb1eb54ba17bb68bc06d4ac",
"icons/android-icon-96x96.png": "c58155b992f8c47593f2176d32b99103",
"icons/ms-icon-144x144.png": "1dcce611d4b79349ac6f162b036ba5cc",
"icons/apple-icon-152x152.png": "8a1776417136e2776fb5c3960966c1b9",
"icons/apple-icon-180x180.png": "a2758f108dd5eab42ef6487455e4eabd",
"icons/android-icon-36x36.png": "561cece426499d44d3e91598ec31e1b0",
"icons/apple-icon-120x120.png": "da32f0b4a69e7025799b04d2829ba0b7",
"icons/android-icon-48x48.png": "cb5b3e7230008952a3b7d6f652f7c529",
"icons/apple-icon-72x72.png": "6b0139d149399aa1f793012bacb3bc72",
"icons/browserconfig.xml": "653d077300a12f09a69caeea7a8947f8",
"icons/apple-icon-144x144.png": "1dcce611d4b79349ac6f162b036ba5cc",
"icons/favicon-16x16.png": "e629b2d5bc5be0ce9bc582443b0d0e5f",
"icons/manifest.json": "09a1e52b003f9f4e1be898df49006cb2",
"icons/favicon-96x96.png": "c58155b992f8c47593f2176d32b99103",
"icons/android-icon-72x72.png": "6b0139d149399aa1f793012bacb3bc72",
"icons/android-icon-192x192.png": "69a5327f4b619523564c78bb17eedf00",
"icons/apple-icon-114x114.png": "f1fe2aa26e905b3a9f80f9c06a23149a",
"icons/apple-icon-57x57.png": "5ea16108f4ce3454954059b9724f2d0c",
"icons/apple-icon-precomposed.png": "ebd5aa0a3e40491c8378d38917f3cbd8",
"icons/android-icon-144x144.png": "1dcce611d4b79349ac6f162b036ba5cc",
"icons/apple-icon.png": "ebd5aa0a3e40491c8378d38917f3cbd8",
"icons/apple-icon-60x60.png": "6b6216aa1a26b6f75d0fa84fbbea4efd"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
