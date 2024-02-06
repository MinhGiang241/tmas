"use client";

import React, { ReactNode } from "react";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import type Entity from "@ant-design/cssinjs/es/Cache";
import { useServerInsertedHTML } from "next/navigation";
import { ConfigProvider } from "antd";

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
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: "#6DB3C2",
          borderRadius: 2,

          // Alias Token
          colorBgContainer: "#FFF",
        },
      }}
    >
      <StyleProvider cache={cache}>{children}</StyleProvider>
    </ConfigProvider>
  );
};
export default StyledComponentsRegistry;
