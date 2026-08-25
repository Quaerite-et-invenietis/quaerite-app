// Ce service worker n'a qu'un seul but : nettoyer un ancien service worker
// enregistré par une version précédente de l'app, qui pourrait servir
// une version en cache obsolète du site.
// Une fois ce fichier déployé et exécuté une fois sur chaque appareil concerné,
// il peut être retiré définitivement.

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            // vider tous les caches existants
            const keys = await caches.keys();
            await Promise.all(keys.map((key) => caches.delete(key)));
            // se desinstaller soi-meme
            await self.registration.unregister();
            // forcer tous les onglets ouverts a se recharger avec la vraie version
            const clientsList = await self.clients.matchAll({ type: 'window' });
            clientsList.forEach((client) => client.navigate(client.url));
        })()
    );
});
