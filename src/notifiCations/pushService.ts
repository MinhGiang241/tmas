import { callApi } from "@/services/api_services/base_api";
import { getReadyServiceWorker } from "@/utils/serviceWorker";

export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
    const sw = await getReadyServiceWorker();
    return sw.pushManager.getSubscription();
}
// export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
//     const sw = await getReadyServiceWorker();
//     const subscription = await sw.pushManager.getSubscription();

//     if (subscription && subscription.expirationTime) {
//         const expirationTime = new Date(subscription.expirationTime);
//         if (Date.now() > expirationTime.getTime()) {
//             console.log('Token has expired');
//             return null; 
//             // Trả về null nếu token đã hết hạn
//         }
//     }

//     return subscription;
// }


// export async function registerPushNotifications() {
//     if (!("PushManager" in window)) {
//         throw Error("Push notifications are not supported by this browser")
//     }
//     const existingSubscription = await getCurrentPushSubscription();

//     if (existingSubscription) {
//         throw Error("Existing push subscription found")

//     }
//     const sw = await getReadyServiceWorker();

//     const subscription = await sw.pushManager.subscribe({
//         userVisibleOnly: true,
//         applicationServerKey: "BKi3dJK8IiwbY2QqFZDJ7hOA5Yus7PpkS7kVNH0zvMBQ_h51soB1OLCYu108W7530hXoU8Lp-g8BmkwZUMvar-Y"
//     })
//     await sendPushSubscriptionToServer(subscription);
// }
export async function registerPushNotifications() {
    if (!("PushManager" in window)) {
        throw Error("Push notifications are not supported by this browser");
    }

    try {
        const existingSubscription = await getCurrentPushSubscription();
        if (!existingSubscription) {
            const sw = await getReadyServiceWorker();
            const subscription = await sw.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: "BKi3dJK8IiwbY2QqFZDJ7hOA5Yus7PpkS7kVNH0zvMBQ_h51soB1OLCYu108W7530hXoU8Lp-g8BmkwZUMvar-Y"
            });
            await sendPushSubscriptionToServer(subscription);
        } else {
            console.log('Subscription is still valid.');
        }
    } catch (error) {
        console.error('Error while registering push notifications:', error);
    }
}


export async function unregisterPushNotifications() {
    const existingSubscription = await getCurrentPushSubscription();

    if (!existingSubscription) {
        throw Error("No existing push subscription found");
    }
    await deletePushSubscriptionFromServer(existingSubscription);

    await existingSubscription.unsubscribe();
}


function base64Encode(data: any): string {
    // Convert the array of numbers to a Uint8Array.
    // const uint8Array = new Uint8Array(data);
    var numberArr = arrayBufferToNumberArray(data);
    // Encode the Uint8Array to base64.
    const base64String = btoa(String.fromCharCode.apply(null, numberArr));
    console.log({ data, base64String })
    // Return the base64 string.
    return base64String;
}

function arrayBufferToNumberArray(buffer?: ArrayBuffer): number[] {
    if (!buffer) {
        return [];
    }
    const view = new Uint8Array(buffer);
    const numbers = [];
    for (let i = 0; i < view.length; i++) {
        numbers.push(view[i]);
    }
    return numbers;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    const binary = String.fromCharCode.apply(null, bytes as any);
    return btoa(binary);
}

export const submit = async (data: any) => {
    const results = await callApi.post(
        `${process.env.NEXT_PUBLIC_API_BC}/apimodel/pushdevice.web_subscribe`,
        data,
    );
    console.log("data noti", results);
    return results;
};

export async function sendPushSubscriptionToServer(
    subscription: PushSubscription) {
    console.log("Sending push subscription to server", subscription);
    var p256dh_arr = subscription.getKey('p256dh');
    var auth_arr = subscription.getKey('auth');

    var p256dh = base64Encode(p256dh_arr);
    var auth = base64Encode(auth_arr)
    var fingerprint = window.navigator.userAgent;//tạm dùng luôn cái này thay vì phải thêm thư viện fingersprint
    var pushInfo = {
        name: window.navigator.userAgent,
        device_info: window.navigator.userAgent,
        deviceId: fingerprint,
        p256dh,
        auth,
        tokenId: subscription.endpoint,
        // userId: userData.userName, 
        //cái này em phải tự lấy được thông tin để fill vào
        platform: "WEB",
        // extra_info: userData.user
    };
    console.log({ pushInfo })
    try {
        const response = await submit(pushInfo);
        console.log("Push subscription sent successfully", response);
    } catch (error) {
        console.error("Error:", error);
    }
}

export async function deletePushSubscriptionFromServer(
    subscription: PushSubscription) {
    console.log("Deleting push subscription from server", subscription);
}

/**
 * test shows a notification => test thử cả hàm này xem có thấy push notify hiện lên không nhé -> thêm 1 cái button nữa mà test
 */
export async function sendNotification() {
    const img = "/logo.jpg";
    const text = "Take a look at this brand new t-shirt!";
    const title = "New Product Available";
    const options = {
        body: text,
        icon: "/logo.jpg",
        vibrate: [200, 100, 200],
        data: { url: "https://google.com" },
        tag: "new-product",
        image: img,
        badge: "https://spyna.it/icons/android-icon-192x192.png",
        actions: [{ action: "Detail", title: "View", icon: "https://d25tv1xepz39hi.cloudfront.net/2016-01-31/files/1045.jpg" }]
    };
    // navigator.serviceWorker.ready.then(function (serviceWorker) {
    //     console.log("should show notification")
    //     serviceWorker.showNotification(title, options);
    // });

    // navigator.serviceWorker.ready
    //     .then(registration => {
    //         return registration.showNotification(title, options);
    //     })
    //     .catch(error => {
    //         console.error('Error while showing notification:', error);
    //     });

    const subscription = await navigator.serviceWorker.ready.then(registration => registration.pushManager.getSubscription());

    if (subscription) {
        console.log('Expiration time:', subscription.expirationTime);
    } else {
        console.log('No subscription found.');
    }
}
