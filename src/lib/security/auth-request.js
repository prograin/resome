import { z } from "zod";
import { signInInput } from "../validation/sign-in.js";
import { readJsonRequest } from "./json-request.js";
import { passwordChangeInput } from "../validation/password.js";

const emptyBody = z.strictObject({});

export async function validateAuthRequest(request, endpoint) {
  const data = await readJsonRequest(
    request,
    endpoint === "sign-in/username"
      ? signInInput
      : endpoint === "change-password"
        ? passwordChangeInput
        : emptyBody,
  );
  if (data instanceof Response) return data;
  const body = { ...data };
  delete body.confirmPassword;
  const headers = new Headers(request.headers);
  headers.delete("content-length");
  headers.delete("transfer-encoding");
  return new Request(request.url, {
    method: request.method,
    headers,
    body: JSON.stringify(body),
  });
}
