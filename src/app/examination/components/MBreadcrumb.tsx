import { Breadcrumb } from "antd";
import React from "react";
import { RightOutlined } from "@ant-design/icons";
import Link from "next/link";

interface Props {}

function MBreadcrumb({ items }: Props) {
  return (
    <Breadcrumb
      className="max-lg:ml-5 mb-3"
      separator={<RightOutlined />}
      items={[
        {
          title: (
            <Link
              className={`body_regular_14 ${
                active ? "text-m_neutral_900" : ""
              }`}
              href={"/examination"}
            >
              {t("examination_list")}
            </Link>
          ),
        },
      ]}
    />
  );
}

export default MBreadcrumb;
