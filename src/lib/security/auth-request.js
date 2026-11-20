import { Readable } from "node:stream";
import getRawBody from "raw-body";
import { z } from "zod";
import { signInInput } from "../validation/sign-in.js";
const emptyBody = z.strictObject({});

export async function validateAuthRequest(request, endpoint) {
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json"
  ) {
    return new Response(null, { status: 415 });
  }
  const stream = request.body ? Readable.fromWeb(request.body) : null;
  try {
    const raw = stream ? await getRawBody(stream, { limit: "8kb", encoding: "utf8" }) : "{}";
    const schema = endpoint === "sign-in/username" ? signInInput : emptyBody;
    const result = schema.safeParse(JSON.parse(raw));
    if (!result.success) return new Response(null, { status: 400 });
    const headers = new Headers(request.headers);
    headers.delete("content-length");
    headers.delete("transfer-encoding");
    return new Request(request.url, {
      method: request.method,
      headers,
      body: JSON.stringify(result.data),
    });
  } catch (error) {
    return new Response(null, { status: error.type === "entity.too.large" ? 413 : 400 });
  } finally {
    stream?.destroy();
  }
}
