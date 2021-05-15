// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/3.5.0/firebase-app.js");
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/3.5.0/firebase-messaging.js");
// eslint-disable-next-line no-undef
firebase.initializeApp({
    apiKey: "AIzaSyBojiMwwMhAkiJiXazZts3mN5yZtkPQwvA",
    authDomain: "fcmpushnotification-cb06e.firebaseapp.com",
    projectId: "fcmpushnotification-cb06e",
    storageBucket: "fcmpushnotification-cb06e.appspot.com",
    messagingSenderId: "353080031779",
    appId: "1:353080031779:web:648eeb12c0c8dde14ecf96",
    measurementId: "G-P3732553ZB"
});
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
    // eslint-disable-next-line no-restricted-globals
    return self.registration.showNotification(payload.data.title, {
        body: payload.data.body,
        icon: payload.data.icon,
        tag: payload.data.tag,
        data: payload.data.link,
    });
});
// eslint-disable-next-line no-restricted-globals
self.addEventListener("notificationclick", (event) => {
    const clickedNotification = event.notification;
    const link = clickedNotification.data;

    clickedNotification.close();
    // eslint-disable-next-line no-restricted-globals
    const promiseChain = self.clients
        .matchAll({
            type: "window",
            includeUncontrolled: true,
        })
        .then((windowClients) => {
            let matchingClient = null;
            windowClients.forEach((client) => {
                // eslint-disable-next-line no-undef
                clientURL = new URL(client.url);
                // eslint-disable-next-line no-undef
                targetUrl = new URL(link);

                // eslint-disable-next-line no-undef
                if (clientURL.host === targetUrl.host) {
                    matchingClient = client;
                }
            });
            if (matchingClient) {
                sendMessageToClient(matchingClient, {
                    type: "USER_NOTIFICATION_CLICKED",
                    link,
                });
                return matchingClient.focus();
            }
            // eslint-disable-next-line no-undef
            return clients.openWindow(link);
        });
    event.waitUntil(promiseChain);
});

const sendMessageToClient = (client, message) => {
    const messageChannel = new MessageChannel();
    client.postMessage(message, [messageChannel.port2]);
};