interface MultiAnswer {
  id?: string;
  label?: string;
  text?: string;
  isCorrectAnswer?: boolean;
}

interface ConnectAnswer {
  type: "Quest" | "Answ";
  id?: string;
  labelQuestion?: string;
  labelAnwser?: string;
  contentQuestion?: string;
  contentAnwser?: string;
  idQuest?: undefined;
  idAns?: undefined;
}
