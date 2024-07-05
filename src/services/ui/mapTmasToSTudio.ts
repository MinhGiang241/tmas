import {
  BaseTmasQuestionData,
  BaseTmasQuestionExamData,
  CodeTmasQuestionData,
  ConnectTmasQuestionData,
  EssayTmasQuestionData,
  FillBlankTmasQuestionData,
  MultiTmasQuestionData,
  RandomTmasQuestionData,
  SQLTmasQuestionData,
  SurveyTmasQuestionData,
  TrueFalseTmasQuestionData,
} from "@/data/exam";
import {
  BaseQuestionData,
  CodingQuestionData,
  ConnectQuestionData,
  EssayQuestionData,
  FillBlankQuestionData,
  MultiAnswerQuestionData,
  QuestionType,
  RandomQuestionData,
  SqlQuestionData,
  SurveyQuestionData,
} from "@/data/question";
import _ from "lodash";
import { mapStudioToTmaslanguage } from "./coding_services";

export const mapTmasQuestionToStudioQuestion: (
  question: BaseTmasQuestionExamData
) => BaseQuestionData = (question: BaseTmasQuestionExamData) => {
  switch (question?.QuestionType) {
    case QuestionType?.MutilAnswer:
      var questClone: MultiTmasQuestionData = _.cloneDeep(question);
      var studioQuestion: MultiAnswerQuestionData = {
        createdTime: questClone?.createdTime,
        id: questClone?._id,
        idExam: questClone?.IdExam,
        idExamQuestionPart: questClone?.IdExamQuestionPart,
        idGroupQuestion: questClone?.IdGroupQuestion,
        numberPoint: questClone?.NumberPoint,
        numberPointAsInt: questClone?.NumberPointAsInt,
        questionType: questClone?.QuestionType,
        question: questClone?.Question,
        updateTime: questClone?.updatedTime,
        content: {
          answers: (questClone?.Content?.Answers ?? []).map((e) => ({
            text: e.Text,
            label: e.Label,
            isCorrectAnswer: e.IsCorrectAnswer,
          })),
          explainAnswer: questClone?.Content?.ExplainAnswer,
          isChangePosition: questClone?.Content?.IsChangePosition,
        },
      };
      return studioQuestion;

    case QuestionType.YesNoQuestion:
      var questClone: TrueFalseTmasQuestionData = _.cloneDeep(question);
      var studioQuestion: MultiAnswerQuestionData = {
        createdTime: questClone?.createdTime,
        id: questClone?._id,
        idExam: questClone?.IdExam,
        idExamQuestionPart: questClone?.IdExamQuestionPart,
        idGroupQuestion: questClone?.IdGroupQuestion,
        numberPoint: questClone?.NumberPoint,
        numberPointAsInt: questClone?.NumberPointAsInt,
        questionType: questClone?.QuestionType,
        question: questClone?.Question,
        updateTime: questClone?.updatedTime,
        content: {
          answers: (questClone?.Content?.Answers ?? []).map((e) => ({
            text: e.Text,
            label: e.Label,
            isCorrectAnswer: e.IsCorrectAnswer,
          })),
          explainAnswer: questClone?.Content?.ExplainAnswer,
          isChangePosition: questClone?.Content?.IsChangePosition,
        },
      };
      return studioQuestion;

    case QuestionType.SQL:
      var sqlQuestClone: SQLTmasQuestionData = _.cloneDeep(question);
      var studioSqlQuestion: SqlQuestionData = {
        createdTime: sqlQuestClone?.createdTime,
        id: sqlQuestClone?._id,
        idExam: sqlQuestClone?.IdExam,
        idExamQuestionPart: sqlQuestClone?.IdExamQuestionPart,
        idGroupQuestion: sqlQuestClone?.IdGroupQuestion,
        numberPoint: sqlQuestClone?.NumberPoint,
        numberPointAsInt: sqlQuestClone?.NumberPointAsInt,
        questionType: sqlQuestClone?.QuestionType,
        question: sqlQuestClone?.Question,
        updateTime: sqlQuestClone?.updatedTime,
        content: {
          expectedOutput: sqlQuestClone?.Content?.ExpectedOutput,
          schemaSql: sqlQuestClone?.Content?.SchemaSql,
          explainAnswer: sqlQuestClone?.Content?.ExplainAnswer,
        },
      };
      return studioSqlQuestion;

    case QuestionType.Essay:
      var essayQuestClone: EssayTmasQuestionData = _.cloneDeep(question);
      var studioEssayQuestion: EssayQuestionData = {
        createdTime: essayQuestClone?.createdTime,
        id: essayQuestClone?._id,
        idExam: essayQuestClone?.IdExam,
        idExamQuestionPart: essayQuestClone?.IdExamQuestionPart,
        idGroupQuestion: essayQuestClone?.IdGroupQuestion,
        numberPoint: essayQuestClone?.NumberPoint,
        numberPointAsInt: essayQuestClone?.NumberPointAsInt,
        questionType: essayQuestClone?.QuestionType,
        question: essayQuestClone?.Question,
        updateTime: essayQuestClone?.updatedTime,
        content: {
          gradingNote: essayQuestClone?.Content?.GradingNote,
          requiredFile: essayQuestClone?.Content?.RequiredFile,
        },
      };
      return studioEssayQuestion;

    case QuestionType.FillBlank:
      var fillQuestClone: FillBlankTmasQuestionData = _.cloneDeep(question);
      var studiofillQuestion: FillBlankQuestionData = {
        createdTime: fillQuestClone?.createdTime,
        id: fillQuestClone?._id,
        idExam: fillQuestClone?.IdExam,
        idExamQuestionPart: fillQuestClone?.IdExamQuestionPart,
        idGroupQuestion: fillQuestClone?.IdGroupQuestion,
        numberPoint: fillQuestClone?.NumberPoint,
        numberPointAsInt: fillQuestClone?.NumberPointAsInt,
        questionType: fillQuestClone?.QuestionType,
        question: fillQuestClone?.Question,
        updateTime: fillQuestClone?.updatedTime,
        content: {
          anwserItems: (fillQuestClone?.Content?.AnwserItems ?? []).map(
            (e) => ({
              anwsers: e.Anwsers,
              label: e.Label,
            })
          ),
          explainAnswer: fillQuestClone?.Content?.ExplainAnswer,
          formatBlank: fillQuestClone?.Content?.FormatBlank,
          fillBlankScoringMethod:
            fillQuestClone?.Content?.FillBlankScoringMethod,
        },
      };
      return studiofillQuestion;

    case QuestionType.Pairing:
      var connQuestClone: ConnectTmasQuestionData = _.cloneDeep(question);
      var studioConnQuestion: ConnectQuestionData = {
        createdTime: connQuestClone?.createdTime,
        id: connQuestClone?._id,
        idExam: connQuestClone?.IdExam,
        idExamQuestionPart: connQuestClone?.IdExamQuestionPart,
        idGroupQuestion: connQuestClone?.IdGroupQuestion,
        numberPoint: connQuestClone?.NumberPoint,
        numberPointAsInt: connQuestClone?.NumberPointAsInt,
        questionType: connQuestClone?.QuestionType,
        question: connQuestClone?.Question,
        updateTime: connQuestClone?.updatedTime,
        content: {
          questions: (connQuestClone?.Content?.Questions ?? []).map((e) => ({
            id: e?._id,
            content: e?.Content,
            label: e?.Label,
          })),
          answers: (connQuestClone?.Content?.Answers ?? []).map((e) => ({
            id: e?._id,
            content: e?.Content,
            label: e?.Label,
          })),

          pairings: (connQuestClone?.Content?.Pairings ?? []).map((e) => ({
            idAnswer: e?.IdAnswer,
            idQuestion: e?.IdQuestion,
          })),

          explainAnswer: connQuestClone?.Content?.ExplainAnswer,
        },
      };
      return studioConnQuestion;

    case QuestionType.Random:
      var ranQuestClone: RandomTmasQuestionData = _.cloneDeep(question);
      var studioRanQuestion: RandomQuestionData = {
        createdTime: ranQuestClone?.createdTime,
        id: ranQuestClone?._id,
        idExam: ranQuestClone?.IdExam,
        idExamQuestionPart: ranQuestClone?.IdExamQuestionPart,
        idGroupQuestion: ranQuestClone?.IdGroupQuestion,
        numberPoint: ranQuestClone?.NumberPoint,
        numberPointAsInt: ranQuestClone?.NumberPointAsInt,
        questionType: ranQuestClone?.QuestionType,
        question: ranQuestClone?.Question,
        updateTime: ranQuestClone?.updatedTime,
      };
      return studioRanQuestion;

    case QuestionType.Coding:
      var codeQuestClone: CodeTmasQuestionData = _.cloneDeep(question);
      var studioCodeQuestion: CodingQuestionData = {
        createdTime: codeQuestClone?.createdTime,
        id: codeQuestClone?._id,
        idExam: codeQuestClone?.IdExam,
        idExamQuestionPart: codeQuestClone?.IdExamQuestionPart,
        idGroupQuestion: codeQuestClone?.IdGroupQuestion,
        numberPoint: codeQuestClone?.NumberPoint,
        numberPointAsInt: codeQuestClone?.NumberPointAsInt,
        questionType: QuestionType.Coding,
        question: codeQuestClone?.Question,
        updateTime: codeQuestClone?.updatedTime,
        content: {
          codeLanguages: (codeQuestClone?.Content?.CodeLanguages ?? []).map(
            (e) => mapStudioToTmaslanguage(e)
          ),
          testcases: (codeQuestClone?.Content?.Testcases ?? []).map((e) => ({
            inputData: e?.InputData,
            name: e?.Name,
            outputData: e?.OutputData,
          })),
          codingScroringMethod: codeQuestClone?.Content?.CodingScroringMethod,
          codingTemplate: {
            nameFunction: codeQuestClone?.Content?.CodingTemplate?.NameFunction,
            returnType: codeQuestClone?.Content?.CodingTemplate?.ReturnType,
            template: codeQuestClone?.Content?.CodingTemplate?.Template,
            parameterInputs: (
              codeQuestClone?.Content?.CodingTemplate?.ParameterInputs ?? []
            ).map((e) => ({
              returnType: e?.ReturnType,
              nameParameter: e?.NameParameter,
            })),

            explainAnswer:
              codeQuestClone?.Content?.CodingTemplate?.ExplainAnswer,
          },
        },
      };
      return studioCodeQuestion;
    case QuestionType?.Evaluation:
      var surQuestClone: SurveyTmasQuestionData = _.cloneDeep(question);
      var studioSurQuestion: SurveyQuestionData = {
        createdTime: surQuestClone?.createdTime,
        id: surQuestClone?._id,
        idExam: surQuestClone?.IdExam,
        idExamQuestionPart: surQuestClone?.IdExamQuestionPart,
        idGroupQuestion: surQuestClone?.IdGroupQuestion,
        numberPoint: surQuestClone?.NumberPoint,
        numberPointAsInt: surQuestClone?.NumberPointAsInt,
        questionType: surQuestClone?.QuestionType,
        question: surQuestClone?.Question,
        updateTime: surQuestClone?.updatedTime,
        content: {
          answers: (surQuestClone?.Content?.Answers ?? []).map((e) => ({
            text: e.Text,
            point: e.Point,
            idIcon: e.idIcon,
            label: e.Label,
          })),
          explainAnswer: surQuestClone?.Content?.ExplainAnswer,
          isChangePosition: surQuestClone?.Content?.IsChangePosition,
        },
      };
      return studioSurQuestion;
    default:
      return {};
  }
};
