export const studentAuthPolicy = {
  cookiePrefix: "prograin-students",
  username: { min: 3, max: 30, pattern: /^[a-zA-Z0-9_.]+$/ },
  password: { min: 8, max: 128 },
  requestTimeout: 15_000,
  sessionRefreshInterval: 60,
  emailResendSeconds: 120,
};
