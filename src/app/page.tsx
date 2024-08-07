"use client";
import { useEffect, useState } from "react";
import { registerServiceWorker } from "@/utils/serviceWorker";
//@ts-ignore
import {
  getCurrentPushSubscription,
  registerPushNotifications,
  unregisterPushNotifications,
} from "@/notifiCations/pushService";
import OverViewPage from "./overview/OverViewPage";

export default function Home() {
  useEffect(() => {
    async function setUpServiceWorker() {
      try {
        await registerServiceWorker();

        await registerPushNotifications();
      } catch (error: any) {
        console.error(error);
      }
    }
    setUpServiceWorker();
  }, []);

  return (
    <>
      {/* <PushSubscriptionToggleButton /> */}
      <OverViewPage />
    </>
  );
}

function PushSubscriptionToggleButton() {
  const [hasActivePushSubscription, setHasActivePushSubscription] = useState<
    boolean | undefined
  >();

  useEffect(() => {
    async function getActivePushSubscription() {
      const subscription = await getCurrentPushSubscription();
      setHasActivePushSubscription(!!subscription);
    }
    getActivePushSubscription();
  }, []);

  async function setPushNotificationsEnabled(enabled: boolean) {
    try {
      if (enabled) {
        await registerPushNotifications();
      } else {
        await unregisterPushNotifications();
      }
      setHasActivePushSubscription(enabled);
    } catch (error) {
      console.error(error);
      if (enabled && Notification.permission === "denied") {
        alert("Please enable push notifications in your browser settings");
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  }

  if (hasActivePushSubscription === undefined) return null;
  return (
    <div>
      {hasActivePushSubscription ? (
        <span title="Disable push notifications on this device">
          <div
            onClick={() => setPushNotificationsEnabled(false)}
            className="cursor-pointer p-2 bg-orange-500"
          >
            Tắt thông báo
          </div>
        </span>
      ) : (
        <span title="Enable push notifications on this device">
          <div
            onClick={() => setPushNotificationsEnabled(true)}
            className="cursor-pointer p-2 bg-orange-500"
          >
            Hiện thông báo
          </div>
        </span>
      )}
    </div>
  );
}
