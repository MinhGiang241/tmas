import { Pagination, Select } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  total?: number;
  recordNum?: number;
  onChangeIndexPage?: any;
  setIndexPage?: any;
  indexPage?: number;
  onChangeRecordNum?: any;
  setRecordNum?: any;
}

function MPagination(props: Props) {
  const { t } = useTranslation();
  return (
    <>
      <div className="w-full flex h-12 items-center  justify-center">
        <span className="body_regular_14 mr-2">{`${props.total} ${t(
          "result",
        )}`}</span>
        <Pagination
          i18nIsDynamicList
          pageSize={props.recordNum}
          onChange={
            props.onChangeIndexPage
              ? props.onChangeIndexPage
              : (v) => {
                  props.setIndexPage(v);
                }
          }
          current={props.indexPage}
          total={props.total}
          showSizeChanger={false}
        />
        <div className="hidden ml-2 h-12 lg:flex items-center">
          <Select
            optionRender={(oriOption) => (
              <div className="flex justify-center">{oriOption?.label}</div>
            )}
            rootClassName="m-0 p-0"
            onChange={
              props.onChangeRecordNum
                ? props.onChangeRecordNum
                : (v) => {
                    props.setRecordNum(v);
                    props.setIndexPage(1);
                  }
            }
            defaultValue={15}
            options={[
              ...[15, 25, 30, 50, 100].map((i: number) => ({
                value: i,
                label: (
                  <span className=" body_regular_14">{`${i}/${t(
                    "page",
                  )}`}</span>
                ),
              })),
            ]}
            className="select-page min-w-[124px]"
          />
        </div>
      </div>
    </>
  );
}

export default MPagination;
