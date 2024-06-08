import React, { HTMLAttributes, ReactNode } from "react";
import MPagination from "./MPagination";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";

export interface TableDataRow {
  title?: ReactNode;
  dataIndex?: string;
  classNameTitle?: string;
  classNameRow?: string;
}

interface Props {
  loading?: boolean;
  recordNum?: number;
  indexPage?: number;
  total?: number;
  setRecordNum?: any;
  setIndexPage?: any;
  isHidePagination?: boolean;
  columns?: ColumnsType<any>;
  dataSource?: { [key: string]: any }[];
  dataRows?: TableDataRow[];
  rowStartStyle?: { [key: string]: any };
  rowStyle?: { [key: string]: any };
  rowEndStyle?: { [key: string]: any };
  totalComponent?: ReactNode;
  sumData?: { [key: string]: any };
}

function MTable(props: Props) {
  var rowStartStyle = props?.rowStartStyle ?? {
    style: {
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      color: "#003953",
      background: "#F4F5F5",
      borderRadius: "10px 0 0 0",
    },
  };

  var rowStyle = props?.rowStyle ?? {
    style: {
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      color: "#003953",
      background: "#F4F5F5",
    },
  };
  var rowEndStyle = props?.rowEndStyle ?? {
    style: {
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      color: "#003953",
      background: "#F4F5F5",
      borderRadius: "0 10px 0 0 ",
    },
  };

  var columns: ColumnsType<any> = props.columns ?? [
    ...(props?.dataRows ?? []).map((e, i) => ({
      onHeaderCell: (_: any) =>
        i === 0
          ? rowStartStyle
          : i === props?.dataRows?.length
            ? rowEndStyle
            : rowStyle,
      title: (
        <div className={` ${e.classNameTitle ?? "w-full flex justify-start"}`}>
          {e.title}
        </div>
      ),
      dataIndex: e?.dataIndex,
      key: e?.dataIndex,
      render: (text: any, data: any) => (
        <p
          key={text}
          className={
            e.classNameRow ?? "w-full  min-w-11 break-all caption_regular_14"
          }
        >
          {text}
        </p>
      ),
    })),
  ];

  return (
    <div className="w-full ">
      <Table
        // locale={{
        //   emptyText: <div className="bg-m_primary_300">HelloWOrld</div>,
        // }}
        loading={props.loading}
        className="w-full overflow-scroll"
        bordered={false}
        columns={columns}
        dataSource={props.dataSource}
        pagination={false}
        rowKey={"id"}
        onRow={(data: any, index: any) =>
          ({
            style: {
              background: "#FFFFFF",
              borderRadius: "20px",
            },
          }) as HTMLAttributes<any>
        }
        summary={
          props.sumData
            ? (data) => {
                var d = props.dataRows?.map((y) => y?.dataIndex);

                return (
                  <Table.Summary.Row className="w-full bg-m_primary_100 h-12 rounded-b-lg body_semibold_14">
                    {d?.map((k, i) => (
                      <Table.Summary.Cell key={k} index={i}>
                        {(props.sumData as any)[k as string]}
                      </Table.Summary.Cell>
                    ))}
                  </Table.Summary.Row>
                );
              }
            : undefined
        }
      />
      <div className="h-4" />
      {!props.isHidePagination && (
        <MPagination
          recordNum={props.recordNum}
          total={props.total}
          indexPage={props.indexPage}
          setIndexPage={props.setIndexPage}
          setRecordNum={props.setRecordNum}
        />
      )}
    </div>
  );
}

export default MTable;
