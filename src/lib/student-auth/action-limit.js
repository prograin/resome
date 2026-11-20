import { getStudentRuntime } from "./server.js";
import { consumeMutationLimit } from "../security/mutation-limit.js";

export function limitStudentAction(userId, scope) {
  return consumeMutationLimit(getStudentRuntime().limits, userId, scope);
}
