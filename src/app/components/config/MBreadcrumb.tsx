import { Breadcrumb } from "antd";
import React from "react";
import Link from "next/link";
import { RightOutlined } from "@ant-design/icons";

interface BreadcrumbProps {
  items: Item[];
}
interface Item {
  text?: string;
  active?: boolean;
  href?: string;
  hidden?: boolean;
}

function MBreadcrumb({ items }: BreadcrumbProps) {
  return (
    <Breadcrumb
      className="max-lg:ml-5 mb-3"
      separator={<RightOutlined />}
      items={[
        ...items
          ?.filter((d) => !d.hidden)
          .map((c) => ({
            title: (
              <Link
                className={`body_regular_14 ${
                  c?.active ? "text-m_neutral_900" : ""
                }`}
                href={c?.href ?? "/"}
              >
                {c.text}
              </Link>
            ),
          })),
      ]}
    />
  );
}

export default MBreadcrumb;
