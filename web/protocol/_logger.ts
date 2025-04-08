import { KyRequest } from "ky";

const FLAG_METHOD = "-X";
const FLAG_HEADER = "-H";
const FLAG_BODY = "--data-raw";

function methodSegment(method: string): string {
  return `${FLAG_METHOD} ${method}`;
}
function headerSegment(headers: Headers): string {
  const pairs = [...headers.entries()];
  if (!pairs.length) return "";

  const list: string[] = [];
  pairs.forEach(([k, v]) => {
    list.push(`${FLAG_HEADER} "${k}: ${v}"`);
  });
  return list.join(" ");
}

async function mutBodySegment(req: KyRequest): Promise<string> {
  let body = "";
  try {
    const actualBody = await req.json();
    body = JSON.stringify(actualBody);
  } catch {}
  return `${FLAG_BODY} '${body}'`;
}

/**
 * WARNING: THIS REQUEST WILL BE MODIFIED AND THE BODY WILL BE CONSUMED
 * use a different request by using `.clone()`
 */
export async function curlOutput(request: KyRequest): Promise<string> {
  const url = request.url;
  const method = methodSegment(request.method);
  const header = headerSegment(request.headers);
  const body = await mutBodySegment(request);
  return `curl '${url}' ${method} ${header} ${body}`;
}
