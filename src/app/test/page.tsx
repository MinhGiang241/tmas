"use client";
import React, { useEffect, useRef } from "react";
import MButton from "../components/config/MButton";
import { useRouter } from "next/navigation";

function Test() {
  const ref = useRef(null);
  const router = useRouter();
  useEffect(() => {
    document.addEventListener("eee", (event: any) => {
      console.log("đang Lắng nghe được sự kiện eee");
      console.log("data từ sự kiện eee", event.data);
    });

    window.addEventListener("authorization", (event: any) => {
      console.log("đã Lắng nghe được sự kiện authorization");
      console.log("data từ sự kiện authorization", event.data);
      sessionStorage.setItem("access_token", event.data);
    });

    return () => {
      document.removeEventListener("eee", (event: any) => {
        console.log("Gỡ lắng nghe sự kiện eee", event);
      });
      document.removeEventListener("authorization", (event: any) => {
        console.log("Gỡ lắng nghe sự kiện authorization", event);
      });
    };
  }, []);
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <MButton
        onClick={() => {
          router.push("/");
        }}
        text="Home Page"
      />
      <div className="w-4" />
      <MButton
        onClick={(e) => {
          var event = new MessageEvent("eee", {
            bubbles: true,
            data: "Đây là lời nhắn được phát ra từ sự kiện eee",
          });
          e.target.dispatchEvent(event);
          console.log("Phát ra sự kiện eee");
        }}
        text="Dispatch Event"
      />

      <div ref={ref}></div>
    </div>
  );
}

export default Test;
