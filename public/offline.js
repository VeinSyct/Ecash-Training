let _o = {
    name: "webapp-v001",
    offline: "index.html", 
    caches: []
};
_o.caches.push(_o.offline);
this.addEventListener("install", async (e) => {
    try {
        e.cache = await caches.open(_o.name);
        await e.cache.addAll(_o.caches);
    } catch (error) {}
});
this.addEventListener("fetch", (e) => {
    e.respondWith(
        (async () => {
            e.cache = await caches.open(_o.name);
            try {
                e.response = await e.cache.match(e.request);
                if (e.response) return e.response;
                e.response = await fetch(e.request);
                if (e.response) {
                    await e.cache.put(e.request, e.response.clone());
                    return e.response;
                };
            } catch (err) {
                return await e.cache.match(_o.offline);
            }
        })()
    );
});