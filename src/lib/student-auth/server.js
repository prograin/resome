import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDatabase, databaseSchemaVersion } from "../db/client.js";
import { authSchema } from "../db/schema/auth.js";
import { studentAuthPolicy as policy } from "./config.js";
import { nextCookies } from "better-auth/next-js";
import { profileFields } from "./profile-fields.js";
import { readAuthEnvironment } from "../security/environment.js";
import { createMutationLimits } from "../security/mutation-limit.js";
import { loginRateLimit } from "./login-limit.js";
import { profileEmailOTP } from "./email-otp.js";
import { accountSessionPolicy } from "./account-policy.js";

let runtime;
const authVersion =
  "email-otp-3:github-url-1:links-page-1:notifications-1:request-guards-2:password-1:activity-2";
const developmentRuntime = Symbol.for("prograin.student-auth.runtime");

export function createStudentAuth({ provision = false, database, sendVerificationOTP } = {}) {
  const { DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL } = readAuthEnvironment();

  const { pool, db } = database ?? createDatabase(DATABASE_URL);
  const limits = createMutationLimits(db);
  const auth = betterAuth({
    appName: "Prograin",
    secret: BETTER_AUTH_SECRET,
    baseURL: BETTER_AUTH_URL,
    trustedOrigins: process.env.NODE_ENV === "development" ? ["http://localhost:4173"] : [],
    advanced: {
      cookiePrefix: policy.cookiePrefix,
      skipTrailingSlashes: true,
      useSecureCookies: new URL(BETTER_AUTH_URL).protocol === "https:",
      defaultCookieAttributes: { httpOnly: true, sameSite: "lax" },
      ipAddress: {
        ipAddressHeaders: process.env.VERCEL ? ["x-vercel-forwarded-for"] : ["x-forwarded-for"],
      },
    },
    emailAndPassword: {
      enabled: true,
      disableSignUp: !provision,
      autoSignIn: false,
      minPasswordLength: policy.password.min,
      maxPasswordLength: policy.password.max,
    },
    user: {
      modelName: "student_user",
      additionalFields: {
        ...profileFields,
        academyActive: { type: "boolean", required: false, defaultValue: true, input: false },
        academyBanned: { type: "boolean", required: false, defaultValue: false, input: false },
        academyInactiveReason: { type: "string", required: false, input: false },
        academyInactiveAt: { type: "date", required: false, input: false },
      },
      changeEmail: { enabled: false },
    },
    account: { modelName: "student_account" },
    session: {
      modelName: "student_session",
      deferSessionRefresh: true,
      cookieCache: { enabled: false },
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      freshAge: 60 * 15,
    },
    verification: { modelName: "student_verification" },
    rateLimit: {
      enabled: true,
      storage: "database",
      modelName: "student_rate_limit",
      window: 60,
      max: 120,
      customRules: { "/sign-in/username": { window: 10, max: 3 } },
    },
    database: drizzleAdapter(db, { provider: "pg", schema: authSchema, transaction: true }),
    databaseHooks: { session: accountSessionPolicy(db) },
    hooks: { before: loginRateLimit(limits, BETTER_AUTH_SECRET) },
    plugins: [
      profileEmailOTP(sendVerificationOTP),
      username({ minUsernameLength: policy.username.min, maxUsernameLength: policy.username.max }),
      nextCookies(),
    ],
  });

  return { auth, pool, db, limits, schemaVersion: databaseSchemaVersion, authVersion };
}

export function getStudentAuth() {
  return getStudentRuntime().auth;
}

export function getStudentRuntime() {
  if (process.env.NODE_ENV === "development") {
    const cached = globalThis[developmentRuntime];
    if (
      !cached ||
      cached.schemaVersion !== databaseSchemaVersion ||
      cached.authVersion !== authVersion
    ) {
      globalThis[developmentRuntime] = createStudentAuth({
        database: createDatabase(process.env.DATABASE_URL, cached?.pool),
      });
    }
    return globalThis[developmentRuntime];
  }
  runtime ??= createStudentAuth();
  return runtime;
}
