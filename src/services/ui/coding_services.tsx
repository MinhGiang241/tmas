import { javascript } from "@codemirror/lang-javascript";
import { LanguageSupport, StreamLanguage } from "@codemirror/language";
import { loadLanguage, langs } from "@uiw/codemirror-extensions-langs";

export const renderExtension: (
  lan: string,
) => LanguageSupport | StreamLanguage<unknown> | undefined = (lan: string) => {
  switch (lan) {
    case "javascript":
      return javascript({ jsx: true });
    case "python":
      return langs.python();
    case "java":
      return langs.java();
    case "csharp":
      return langs.csharp();
    case "html":
      return langs.html();
    case "css":
      return langs.css();
    case "lua":
      return langs.lua();
    case "dart":
      return langs.dart();
    case "php":
      return langs.php();
    case "ruby":
      return langs.ruby();
    case "rust":
      return langs.rust();
    default:
      return langs.javascript();
  }
};

export const laguageOptions = [
  { value: "javascript", label: "javascript" },
  { value: "csharp", label: "C#" },
  { value: "python", label: "python" },
  { value: "go", label: "go" },
  { value: "cpp", label: "C++" },
  { value: "html", label: "HTML" },
  { value: "dart", label: "dart" },
  { value: "php", label: "PHP" },
  { value: "java", label: "Java" },
  { value: "css", label: "CSS" },
];
