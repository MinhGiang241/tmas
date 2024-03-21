//import edge from "edge-js";
//
// var helloWorld = edge.func(`
//     async (input) => {
//         return ".NET Welcomes " + input.ToString();
//     }
// `);

export async function POST(req: Request) {
  // helloWorld("JavaScript", function (error, result) {
  //   if (error) throw error;
  //   console.log(result);
  // });

  return new Response(req.body);
}
