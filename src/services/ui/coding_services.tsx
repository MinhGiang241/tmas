import { CodingDataType, ParameterType } from "@/data/form_interface";
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

export const mapStudioToTmaslanguage = (index: number) => {
  switch (index) {
    case 0:
      return "PHP"; // "php";
    case 1:
      return "Javascript"; //"javascript";
    case 2:
      return "Java"; //"java";
    case 3:
      return "Python"; //"python";
    case 4:
      return "Ruby"; //"ruby";
    case 5:
      return "CSharp"; //"c#";
  }
};
// | "PHP"
// | "Javascrip"
// | "Java"
// | "Python"
// | "Ruby"
// | "CShape"[];

export const mapLanguage = (lang?: string) => {
  switch (lang) {
    case "php":
      return "PHP";
    case "javascript":
      return "Javascript";
    case "java":
      return "Java";
    case "python":
      return "Python";
    case "ruby":
      return "Ruby";
    case "c#":
      return "CSharp";
    default:
      return "";
  }
};

export const revertLanguage = (lang?: string) => {
  switch (lang) {
    case "PHP":
      return "php";
    case "Javascrip":
      return "javascript";
    case "Java":
      return "java";
    case "Python":
      return "python";
    case "Ruby":
      return "ruby";
    case "CSharp":
      return "c#";
    default:
      return undefined;
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

export interface SampleCode {
  params?: ParameterType[];
  returnType?: string;
  functionName?: string;
  lang?: string;
}
export const genSampleCode = ({
  params,
  functionName,
  returnType,
  lang,
}: SampleCode) => {
  switch (lang) {
    case "javascript":
      return `function ${functionName ?? "sample"} (${
        params?.map((s: any) => `${s?.nameParameter ?? ""}`).join(", ") ?? ""
      }) {
  // Write code here
      
}`;
    case "java":
      return `public class Main {
    public static ${returnType ?? "void"} ${functionName ?? "main"} (${
      params
        ?.map(
          (s: any) => `${s?.returnType ?? "void"} ${s?.nameParameter ?? ""}`,
        )
        .join(", ") ?? ""
    }) {
    // Write code here
       
    }
}`;
    case "c#":
      return `using System;

class Program {
    public static ${returnType ?? "void"} ${functionName ?? "Main"} (${
      params
        ?.map(
          (s: any) => `${s?.returnType ?? "void"} ${s?.nameParameter ?? ""}`,
        )
        .join(", ") ?? ""
    })  {
    // Write code here 
        
    }
}`;
    case "ruby":
      return `def ${functionName ?? "main"} (${
        params?.map((s: any) => `${s?.nameParameter ?? ""}`).join(", ") ?? ""
      }) {
    # Write code here 
      
}`;
    case "php":
      return `<?php
function ${functionName ?? "main"}(${
        params?.map((s: any) => `$${s?.nameParameter ?? ""}`).join(", ") ?? ""
      }) {
    // Write code here 
      
}
?>`;
    case "python":
      return `def ${functionName ?? "main"}(${
        params?.map((s: any) => `${s?.nameParameter ?? ""}`).join(", ") ?? ""
      }){
    # Write code here

}
      `;
    default:
      return "";
  }
};

export const serverLanguageList: CodingDataType[] = [
  "String",
  "Integer",
  "LongInteger",
  "Float",
  "Boolean",
  "Double",
  "Character",
  "IntegerArray",
  "StringArray",
  "LongIntegerArray",
  "FloatArray",
  "DoubleArray",
  "CharacterArray",
  "BooleanArray",
  "Integer2DArray",
  "String2DArray",
  "LongInteger2DArray",
  "Float2DArray",
  "Double2DArray",
  "Character2DArray",
  "Boolean2DArray",
  "Void",
];
