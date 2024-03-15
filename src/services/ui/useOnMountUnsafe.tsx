/* eslint-disable react-hooks/exhaustive-deps */
import type { EffectCallback } from "react";
import { useEffect, useRef } from "react";

export function useOnMountUnsafe(effect: any, dependencies?: any) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      effect();
    }
  }, dependencies ?? []);
}
