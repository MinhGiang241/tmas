import { PythonShell } from "python-shell";
export async function POST(req: Request) {
  const body = await req.json();
  var code = body.code;
  console.log("code", req.body);

  var res: any = {};
  await PythonShell.runString(code, undefined)
    .then((v: any) => {
      res.data = v;
      res.code = 0;
    })
    .catch((e: any) => {
      res.message = e;
      res.code = 1;
    });
  console.log("message", res);

  return new Response(JSON.stringify(res));
}
