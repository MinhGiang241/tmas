import {
  ExamFormData,
  ExaminationFormData,
  ExaminationListParams,
  ParamGetExamList,
  SendRemindParams,
} from "@/data/form_interface";
import { callApi, callStudioAPI } from "./base_api";
import { ExamData } from "@/data/exam";

export const createExaminationList = async (data: ExamFormData) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Exam`,
    data,
  );

  return results;
};

export const getExaminationList = async (params: ParamGetExamList) => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Exam`,
    { params },
  );

  return results;
};

export const getAllExaminationList = async (Id?: string, StudioId?: string) => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Exam/${StudioId}/${Id}`,
  );

  return results;
};

export const deleteExamination = async (Id?: string) => {
  const results = await callStudioAPI.delete(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Exam/${Id}`,
  );

  return results;
};

export const getExamById = async (Id?: string | null) => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Exam/${Id}`,
  );

  return results;
};

export const updateExam = async (data?: ExamFormData) => {
  const results = await callStudioAPI.put(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Exam`,
    data,
  );

  return results;
};

export const createSessionUpload = async () => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Session`,
    {},
  );

  return results;
};

export const saveDocumentSessionUpload = async (
  items?: { id?: string; isCommited?: boolean }[],
) => {
  const results = await callStudioAPI.put(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Session`,
    { items },
  );

  return results;
};

export const deleteAllDocument = async (ids?: string[]) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Document/PostDelete`,
    {
      ids,
    },
  );

  return results;
};

export const deleteDocumentById = async (idSession?: string, id?: string) => {
  const results = await callStudioAPI.delete(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Document/${idSession}/${id}`,
  );

  return results;
};

export const uploadStudioDocument = async (IdSession?: string, data?: any) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Document/upload/${IdSession}`,
    data,
  );

  return results;
};

export const downloadStudioDocument = async (id: string) => {
  const results = await callStudioAPI.download(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Document/download/${id}`,
  );
  return results;
};

export const getInfoStudioDocuments = async (ids: string[]) => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Document/`,
    { params: { "Ids.InValues": ids, "Ids.Name": "Name" } },
  );
  return results;
};

export const getInfoAStudioDocument = async (id?: string) => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Document/${id}`,
  );
  return results;
};

export const createExamination = async (data: ExaminationFormData) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamTest`,
    data,
  );
  return results;
};

export const updateExamination = async (data: ExaminationFormData) => {
  const results = await callStudioAPI.put(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamTest`,
    data,
  );
  return results;
};

export const getExaminationTestList = async (params: ExaminationListParams) => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamTest`,
    { params },
  );
  return results;
};

export const getExaminationById = async (id?: string) => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamTest/${id}`,
  );
  return results;
};

export const deleteExaminationById = async (id?: string) => {
  const results = await callStudioAPI.delete(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamTest/${id}`,
  );
  return results;
};

export const createSession = async (sessionId?: string) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Session/${sessionId ?? ""}`,
    {},
  );
  return results;
};

export const duplicateExamination = async (data: {
  ids?: string[];
  documentLinkFormatById?: string;
}) => {
  const results = await callStudioAPI.post(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamTest/Copy`,
    data,
  );
  return results;
};

export const getTmasExaminationList = async ({
  text,
  skip,
  limit,
  fields,
  tags,
}: {
  text?: string;
  skip?: number;
  limit?: number;
  fields?: any;
  tags?: any;
}) => {
  const results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/examlibrary.search`,
    {
      text: text ?? "",
      skip,
      limit,
      fields,
      tags,
    },
  );
  return results;
};

export const getTemplateSendMail = async ({
  name,
  start_time,
  end_time,
}: {
  name?: string;
  start_time?: string;
  end_time?: string;
}) => {
  const results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/mailtemplate.get_exam_remind_template`,
    { name, start_time, end_time },
  );
  return results;
};

export const getTemplateSendResultMail = async ({
  name,
  start_time,
  end_time,
}: {
  name?: string;
  start_time?: string;
  end_time?: string;
}) => {
  const results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/mailtemplate.generate_result_exam`,
    { name, start_time, end_time },
  );
  return results;
};

export const sendRemindEmail = async (data: SendRemindParams) => {
  const results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/examtestmaillist.send_remind`,
    data,
  );
  return results;
};

export const sendResultEmail = async (data: SendRemindParams) => {
  const results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/examtestmaillist.send_result`,
    data,
  );
  return results;
};

export const loadRemindMailList = async (
  examtestId?: string,
  type?: "Reminder" | "HasResult",
) => {
  const results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/examtestmaillist.load_by_exam`,
    { examtestId, type },
  );
  return results;
};

export const deleteRemindMail = async (maillistId?: string) => {
  const results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/examtestmaillist.delete`,
    { maillistId },
  );
  return results;
};

export const getOverViewExamination = async (
  examinationId?: string,
  includeExam?: boolean,
) => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/ExamTest/${examinationId}?IsIncludeExamVersion=${includeExam}`,
  );
  return results;
};

export const exportExelFile = async (examinationId?: string) => {
  const results = await callStudioAPI.get(
    `${process.env.NEXT_PUBLIC_API_STU}/api/studio/AdminExamTestResult/ExportExcel/${examinationId}`,
    {
      responseType: "blob",
    },
  );
  return results;
};

export const getQuestionPartDetails = async (examTestId?: string) => {
  const results = await callApi.get(
    `${process.env.NEXT_PUBLIC_API_STU}/ActivitiesReport/DeTailListQuestionByPart`,
    { params: { examTestId } },
  );
  return results;
};

export const getAbilityReport = async (examTestId?: string) => {
  const results = await callApi.get(
    `${process.env.NEXT_PUBLIC_API_STU}/ActivitiesReport/TableStatisticalReportByExamQuestionPart`,
    { params: { examTestId } },
  );
  return results;
};
