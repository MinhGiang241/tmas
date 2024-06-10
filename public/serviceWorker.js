

self.addEventListener('push', (event) => {
    console.log('push received 1');

    const data = event.data.json();
    console.log(data);
    event.waitUntil(
        self.registration.showNotification(data.title, data.payload)
    );
})


self.addEventListener('notificationclick', (event) => {
    console.log("notification click event")
    console.log('On notification click: ', event.notification);
    event.notification.close();

    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(clients.matchAll({
        type: "window"
    }).then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (client.url == '/' && 'focus' in client)
                return client.focus();
        }
        if (clients.openWindow) {
            if (event.notification.data && event.notification.data.url)
                return clients.openWindow(event.notification.data.url)
            else
                return clients.openWindow('/');
        }
    }));
});

// self.onnotificationclick = function (event) {
//     console.log('On notification click: ', event.notification);
//     event.notification.close();

//     // This looks to see if the current is already open and
//     // focuses if it is
//     event.waitUntil(clients.matchAll({
//         type: "window"
//     }).then(function (clientList) {
//         for (var i = 0; i < clientList.length; i++) {
//             var client = clientList[i];
//             if (client.url == '/' && 'focus' in client)
//                 return client.focus();
//         }
//         if (clients.openWindow) {
//             if (event.notification.data && event.notification.data.url)
//                 return clients.openWindow(event.notification.data.url)
//             else
//                 return clients.openWindow('/');
//         }
//     }));
// };