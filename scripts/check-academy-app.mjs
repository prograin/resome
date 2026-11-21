import { createTestDatabase } from "./lib/test-database.mjs";
import { createStudentFixture } from "./students/fixture.mjs";
import { checkAcademyAppUI } from "./students/academy-app-ui.mjs";
import { checkInstallInvitation } from "./students/install-invitation.mjs";
import { checkAcademyTheme } from "./students/academy-theme.mjs";

const database = await createTestDatabase("academy_app");
let fixture;
try {
  process.env.STUDENT_TEST_DATABASE_URL = database.url;
  fixture = await createStudentFixture({ showInstallInvitation: true });
  await checkAcademyAppUI(fixture);
  await checkInstallInvitation(fixture);
  await checkAcademyTheme(fixture);
} finally {
  try {
    await fixture?.close();
  } finally {
    await database.close();
  }
}
