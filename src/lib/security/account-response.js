import { apiJson } from "./api-response.js";
import { accountBannedCode } from "../student-account.js";

export const bannedAccountResponse = () =>
  apiJson(
    {
      code: accountBannedCode,
      error: "This account is banned. Contact academy support.",
    },
    403,
  );
