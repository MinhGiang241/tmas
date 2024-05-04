// const webpush = require('web-push');

// // Replace these with your Vapid keys
// const publicKey = 'BKi3dJK8IiwbY2QqFZDJ7hOA5Yus7PpkS7kVNH0zvMBQ_h51soB1OLCYu108W7530hXoU8Lp-g8BmkwZUMvar-Y';
// const privateKey = 'your-private-key';

// webpush.setVapidDetails(
//     'mailto:your-email@example.com',
//     publicKey,
//     privateKey
// );

// const payload = JSON.stringify({
//     title: 'New Notification',
//     body: 'This is a notification from your server.',
//     icon: '/path/to/icon.png'
// });

// const options = {
//     // Add more options if needed
// };

// // Replace subscriptionObject with the subscription object obtained from the client
// webpush.sendNotification(subscriptionObject, payload, options)
//     .then(response => {
//         console.log('Notification sent successfully:', response);
//     })
//     .catch(error => {
//         console.error('Error sending notification:', error);
//     });

console.log(1);
const publicKey = 'BKi3dJK8IiwbY2QqFZDJ7hOA5Yus7PpkS7kVNH0zvMBQ_h51soB1OLCYu108W7530hXoU8Lp-g8BmkwZUMvar-Y';

self.addEventListener('push', function (event) {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon
    });
});

self.addEventListener('pushsubscriptionchange', function (event) {
    event.waitUntil(
        self.registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey)
        })
            .then(function (subscription) {
                // Send the updated subscription to your server
                console.log('Push subscription change:', subscription);
            })
            .catch(function (error) {
                console.error('Error during push subscription change:', error);
            })
    );
});

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}