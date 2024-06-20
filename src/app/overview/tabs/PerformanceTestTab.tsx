/* eslint-disable react-hooks/exhaustive-deps */
import { Divider } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ExamListTable from "../components/ExamListTable";
import ExaminationListTable from "../components/ExaminationListTable";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { ExamGroupData } from "@/data/exam";
import {
  fetchDataExamGroup,
  setExamGroupLoading,
} from "@/redux/exam_group/examGroupSlice";
import { APIResults } from "@/data/api_results";
import { getExamGroupTest } from "@/services/api_services/exam_api";

function PerformanceTestTab() {
  const router = useRouter();
  const { t } = useTranslation("exam");
  const user = useAppSelector((state: RootState) => state.user.user);
  const dispatch = useAppDispatch();
  const common = useTranslation();
  const [active, setActive] = useState("0");

  const examGroup = useAppSelector((state: RootState) => state.examGroup?.list);

  const loadExamGroupList = async (init?: boolean) => {
    if (init) {
      dispatch(setExamGroupLoading(true));
    }

    var dataResults: APIResults = await getExamGroupTest({
      text: "",
      studioId: user?.studio?._id,
    });

    if (dataResults.code != 0) {
      return [];
    } else {
      var data = dataResults?.data as ExamGroupData[];
      var levelOne = data?.filter((v: ExamGroupData) => v.level === 0);
      var levelTwo = data?.filter((v: ExamGroupData) => v.level === 1);

      var list = levelOne.map((e: ExamGroupData) => {
        var childs = levelTwo.filter(
          (ch: ExamGroupData) => ch.idParent === e.id,
        );
        return { ...e, childs };
      });
      return list;
    }
  };

  const optionSelect = (examGroup ?? []).map<any>(
    (v: ExamGroupData, i: number) => ({
      title: v?.name,
      value: v?.id,
      disabled: true,
      isLeaf: false,
      children: [
        ...(v?.childs ?? []).map((e: ExamGroupData, i: number) => ({
          title: e?.name,
          value: e?.id,
        })),
      ],
    }),
  );
  optionSelect.push({
    title: t("all_category"),
    value: "",
  });

  useEffect(() => {
    if (user?.studio?._id) {
      dispatch(fetchDataExamGroup(async () => loadExamGroupList(true)));
    }
  }, [user]);

  return (
    <div className="p-5 bg-white w-full rounded-lg flex flex-col items-center mt-2">
      <div className="flex border border-m_neutral_200 rounded-lg p-1">
        <button
          onClick={() => {
            setActive("0");
          }}
          className={`p-[10px] rounded-lg body_semibold_14 ${
            active == "0"
              ? "bg-m_primary_100 text-m_primary_500"
              : "text-m_neutral_400"
          }`}
        >
          {t("exam_list")}
        </button>
        <button
          onClick={() => {
            setActive("1");
          }}
          className={`p-[10px] rounded-lg body_semibold_14 ${
            active == "1"
              ? "bg-m_primary_100 text-m_primary_500"
              : "text-m_neutral_400"
          }`}
        >
          {t("examination_list")}
        </button>
      </div>
      <Divider className="my-5" />
      {/* Danh sách đề thi */}
      {active == "0" ? (
        <ExamListTable optionSelect={optionSelect} />
      ) : (
        <ExaminationListTable optionSelect={optionSelect} />
      )}
    </div>
  );
}

export default PerformanceTestTab;
