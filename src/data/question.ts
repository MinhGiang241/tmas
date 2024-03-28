interface MultiAnswer {
  id?: string;
  label?: string;
  text?: string;
  isCorrectAnswer?: boolean;
}

interface ConnectQuestAns {
  id?: string;
  label?: string;
  content?: string;
}
interface ConnectPairing {
  idQuestion?: string;
  idAnswer?: string;
}
