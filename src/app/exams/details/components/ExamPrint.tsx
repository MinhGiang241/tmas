/* eslint-disable @next/next/no-img-element */
import React, { useTransition } from "react";
import "./exam-print.css";
import { useTranslation } from "react-i18next";
import { indexToAlphabet } from "@/utils/utils";
import shuffle from "lodash/shuffle";
import { QuestionType } from "@/data/question";

type Props = {
  exam: any;
  name?: string;
};

const ResultSkeleton = ({ numOfLine = 5 }) => {
  return (
    <div>
      {Array.from(Array(numOfLine).keys()).map((line, index) => (
        <div
          key={index}
          className="border-b-[0.5px] border-dotted h-7 border-black"
        />
      ))}
    </div>
  );
};

const ExamQuestion = ({
  question,
  index,
}: {
  question: any;
  index: number;
}) => {
  const { t } = useTranslation("question");

  const renderAnswerContent = (ques: any) => {
    switch (ques.questionType) {
      case QuestionType.MutilAnswer:
      case QuestionType.YesNoQuestion: {
        const { answers, isChangePosition, explainAnswer } = ques.content ?? {};
        const sufferAnswers = isChangePosition ? shuffle(answers) : answers;
        return (
          <div className="flex flex-col gap-2 p-4">
            {sufferAnswers?.map((ans: any, index: number) => (
              <p key={index} className="inline-flex gap-1">
                <span className="font-semibold mr-2">
                  {indexToAlphabet(index + 1)})
                </span>
                <span
                  className="font-semibold"
                  dangerouslySetInnerHTML={{ __html: ans.label }}
                />
                <span dangerouslySetInnerHTML={{ __html: ans.text }} />
              </p>
            ))}
          </div>
        );
      }
      case QuestionType.SQL: {
        const { explainAnswer } = ques.content ?? {};
        return (
          <div className="flex flex-col gap-1 p-4">
            <ResultSkeleton numOfLine={3} />
          </div>
        );
      }
      case QuestionType.FillBlank: {
        const { formatBlank, anwserItems } = ques.content ?? {};
        return (
          <div className="flex flex-col gap-4 p-4">
            <div
              dangerouslySetInnerHTML={{ __html: formatBlank }}
              className="mb-2"
            />
            <div className="flex flex-col gap-4">
              {anwserItems?.map((awn: any, index: number) => {
                return (
                  <div key={index} className="flex gap-1">
                    <span
                      dangerouslySetInnerHTML={{ __html: awn.label }}
                      className="font-semibold"
                    />
                    <span>__________________________________</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
      case QuestionType.Pairing: {
        const { explainAnswer, answers, questions } = ques.content ?? {};
        return (
          <div className="flex flex-col gap-2 p-4">
            <div className="grid grid-cols-2">
              <div className="flex flex-col space-y-2">
                {answers?.map((ans: any, index: number) => (
                  <p key={index} className="inline-flex gap-1">
                    <span
                      className="font-semibold"
                      dangerouslySetInnerHTML={{ __html: ans.label }}
                    />
                    <span dangerouslySetInnerHTML={{ __html: ans.text }} />
                  </p>
                ))}
              </div>
              <div className="flex flex-col space-y-2">
                {questions?.map((ans: any, index: number) => (
                  <p key={index} className="inline-flex gap-1">
                    <span
                      className="font-semibold"
                      dangerouslySetInnerHTML={{ __html: ans.label }}
                    />
                    <span dangerouslySetInnerHTML={{ __html: ans.text }} />
                  </p>
                ))}
              </div>
            </div>
          </div>
        );
      }
      case QuestionType.Coding: {
        const { template } = ques.content ?? {};
        return (
          <div className="flex flex-col gap-1 p-4">
            <div dangerouslySetInnerHTML={{ __html: template }} />
            <ResultSkeleton numOfLine={10} />
          </div>
        );
      }
      default:
        return (
          <div className="flex flex-col gap-1 p-4">
            <ResultSkeleton numOfLine={6} />
          </div>
        );
    }
  };

  const renderSubTitleQuestionType = (ques: any) => {
    return <span>({t(ques.questionType)})</span>;
  };

  return (
    <div className="p-2 space-y-2">
      <h2 className="flex flex-row gap-2 font-semibold">
        <span className="uppercase">
          {t("question")} {index}:{" "}
        </span>

        <span className="font-normal">
          {renderSubTitleQuestionType(question)}
        </span>
      </h2>
      {question?.questionType !== QuestionType.FillBlank && (
        <div dangerouslySetInnerHTML={{ __html: question.question }} />
      )}
      <hr />
      {renderAnswerContent(question)}
    </div>
  );
};

const ExamSection = ({ section }: { section: any }) => {
  return (
    <section>
      <h1 className="text-lg font-bold uppercase">{section.name}</h1>
      <div className="p-2">
        {section?.examQuestions?.map((question: any, index: number) => {
          return (
            <ExamQuestion key={index} question={question} index={index + 1} />
          );
        })}
      </div>
    </section>
  );
};

const ExamPrint = React.forwardRef<HTMLDivElement, any>(
  ({ exam, name }: Props, ref) => {
    return (
      <div className="page text-black" ref={ref}>
        <h1 className="text-3xl font-bold">Đề thi: {name}</h1>
        <h1 className="text-2xl">
          Họ và tên: ...........................................................
        </h1>
        <br />
        <br />
        {exam?.map((ex: any, key: number) => {
          return <ExamSection key={key} section={ex} />;
        })}
        <br />
        <br />
        <div className="flex justify-end px-5">
          <img alt="logo" src="/images/logo.png" className="w-5/12" />
        </div>
        <br />
      </div>
    );
  },
);

ExamPrint.displayName = "ExamPrint";
export { ExamPrint };
