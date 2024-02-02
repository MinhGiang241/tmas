"use client";

import React, { ReactNode } from "react";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import type Entity from "@ant-design/cssinjs/es/Cache";
import { useServerInsertedHTML } from "next/navigation";

const StyledComponentsRegistry: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const cache = React.useMemo<Entity>(() => createCache(), [createCache]);
  useServerInsertedHTML(() => (
    <style
      id="antd"
      dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
    />
  ));
  return <StyleProvider cache={cache}>{children}</StyleProvider>;
};
export default StyledComponentsRegistry;
