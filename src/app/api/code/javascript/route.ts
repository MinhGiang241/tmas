import { spawn, exec } from "child_process";
import vm from "vm";

export async function POST(req: Request) {
  const body = await req.json();
  // var code = body.code;

  const code = `
  const add = (a, b) => {
    return a + b;
  }
  console.log(add(3, 5));
`;
  const child = exec(code);
  console.log("child", child);

  const context = {};

  var res: any = {};

  eval(code);

  return new Response(JSON.stringify(child));
}
