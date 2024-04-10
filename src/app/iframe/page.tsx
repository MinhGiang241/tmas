"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

function Test() {
  const ref = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl") || "/";

  useEffect(() => {
    const eventHandler = (event: MessageEvent<any>) => {
      console.log("Event nhận từ bên ngoài:", event);
      console.log(redirectUrl, "redirectUrl");

      if (event?.data?.type == "authorization") {
        sessionStorage.setItem("access_token", event.data?.data);
        router.push(redirectUrl);
      }
    };
    window.addEventListener("message", eventHandler);
    return () => {
      window.removeEventListener("message", eventHandler);
    };
  }, [redirectUrl, router]);

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      {/* <MButton
        onClick={() => {
          router.push("/");
        }}
        text="Home Page"
      />
      <div className="w-4" />
      <MButton
        onClick={(e) => {
          window.parent.postMessage(
            { type: "event-name", data: "đây là data tù bên trong iframe" },
            "*"
          );
          console.log("Phát ra sự kiện eee");
        }}
        text="Dispatch Event"
      /> */}

      <div ref={ref}>Đang thực hiện chuyển hướng...</div>
    </div>
  );
}

export default Test;
