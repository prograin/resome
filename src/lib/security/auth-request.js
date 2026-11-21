import { z } from "zod";
import { signInInput } from "../validation/sign-in.js";
import { readJsonRequest } from "./json-request.js";

const emptyBody = z.strictObject({});

export async function validateAuthRequest(request, endpoint) {
  const data = await readJsonRequest(
    request,
    endpoint === "sign-in/username" ? signInInput : emptyBody,
  );
  if (data instanceof Response) return data;
  const headers = new Headers(request.headers);
  headers.delete("content-length");
  headers.delete("transfer-encoding");
  return new Request(request.url, {
    method: request.method,
    headers,
    body: JSON.stringify(data),
  });
}
