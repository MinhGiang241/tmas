"use client";
import React, { useEffect, useRef } from "react";
import MButton from "../components/config/MButton";
import { useRouter } from "next/navigation";

function Test() {
  const ref = useRef(null);
  const router = useRouter();
  useEffect(() => {
    window.addEventListener("message", function (event) {
      console.log("Event nhận từ bên ngoài:", event);
      if (event?.data?.type == "authorization") {
        sessionStorage.setItem("access_token", event.data?.data);
      }
    });
    return () => {
      window.removeEventListener("authorization", (event: any) => {
        console.log("Gỡ lắng nghe message", event);
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
          window.parent.postMessage(
            { type: "event-name", data: "đây là data tù bên trong iframe" },
            "*",
          );
          console.log("Phát ra sự kiện eee");
        }}
        text="Dispatch Event"
      />

      <div ref={ref}></div>
    </div>
  );
}

export default Test;
