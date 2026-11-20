import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";
import { studentAuthPolicy as policy } from "./config";

export const studentAuth = createAuthClient({
  plugins: [usernameClient()],
  fetchOptions: { timeout: policy.requestTimeout, retry: 0 },
  sessionOptions: { refetchInterval: policy.sessionRefreshInterval, refetchOnWindowFocus: true },
});
