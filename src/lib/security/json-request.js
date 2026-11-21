import { Readable } from "node:stream";
import getRawBody from "raw-body";
import { apiJson } from "./api-response.js";

export async function readJsonRequest(request, schema) {
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json"
  )
    return apiJson({ error: "JSON required" }, 415);
  const stream = request.body ? Readable.fromWeb(request.body) : null;
  try {
    const raw = stream ? await getRawBody(stream, { limit: "8kb", encoding: "utf8" }) : "{}";
    const result = schema.safeParse(JSON.parse(raw));
    return result.success ? result.data : apiJson({ error: "Invalid request" }, 400);
  } catch (error) {
    return apiJson({ error: "Invalid request" }, error.type === "entity.too.large" ? 413 : 400);
  } finally {
    stream?.destroy();
  }
}
