import { createStudentFixture } from "./students/fixture.mjs";
import { studentHelpers } from "./students/helpers.mjs";
import { checkAuthentication } from "./students/authentication.mjs";
import { checkDashboardNavigation } from "./students/navigation.mjs";
import { checkGoals } from "./students/goals.mjs";
import { checkAdministration } from "./students/administration.mjs";
import { checkStudentReview } from "./students/review.mjs";
import { checkSession } from "./students/session.mjs";
import { checkProfile } from "./students/profile.mjs";
import { checkSecurity } from "./students/security.mjs";
import { checkAccountBoundaries } from "./students/account-boundaries.mjs";
import { checkLoginFailure } from "./students/login-failure.mjs";
import { checkSessionExpiry } from "./students/session-expiry.mjs";
import { checkSessionRenewal } from "./students/session-renewal.mjs";
import { checkLogoutFailure } from "./students/logout-failure.mjs";
import { checkSecureCookies } from "./students/secure-cookies.mjs";
import { createTestDatabase } from "./lib/test-database.mjs";

const database = await createTestDatabase("students");
let fixture;
try {
  process.env.STUDENT_TEST_DATABASE_URL = database.url;
  fixture = await createStudentFixture();
  const test = { ...fixture, ...studentHelpers(fixture) };
  await checkLoginFailure(test);
  await checkAccountBoundaries(test);
  await checkAuthentication(test);
  await checkDashboardNavigation(test);
  const goal = await checkGoals(test);
  const courseCard = await checkAdministration({ ...test, goal });
  await checkStudentReview({ ...test, goal, courseCard });
  await checkProfile(test);
  await checkSecurity(test);
  await checkSecureCookies(test);
  await checkSessionRenewal(test);
  await checkLogoutFailure(test);
  await checkSession(test);
  await checkSessionExpiry(test);
  console.log(
    "PASS login, timeout recovery, session expiry, profile editing, rate limits and student isolation",
  );
} finally {
  try {
    await fixture?.close();
  } finally {
    await database.close();
  }
}
