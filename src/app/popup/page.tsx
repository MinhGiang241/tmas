"use client";
import React, { useEffect, useState } from "react";
import BasePopup from "./BasePopup";
import { useSearchParams } from "next/navigation";

function PopupScreen() {
  const [open, setOpen] = useState(true);
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const msg = searchParams.get("msg");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <div>
      {isClient &&
        ["info", "success", "warning", "danger"].includes(type ?? "") && (
          <BasePopup
            onOk={() => {
              setOpen(false);
            }}
            msg={msg}
            open={open}
            type={type as "info" | "success" | "warning" | "danger"}
            onCancel={() => setOpen(false)}
          />
        )}
    </div>
  );
}

export default PopupScreen;
