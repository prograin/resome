import { generateVAPIDKeys } from "web-push";
import { createTestDatabase } from "./lib/test-database.mjs";
import { createStudentFixture } from "./students/fixture.mjs";
import { checkNotificationUI } from "./students/notifications.mjs";
import { checkNotificationLayout } from "./students/notification-layout.mjs";
import { checkNotificationPage } from "./students/notification-page.mjs";
import { checkPushOwnership } from "./students/push-ownership.mjs";
import { checkPushRecovery } from "./students/push-recovery.mjs";

const database = await createTestDatabase("notification_ui");
let fixture;
try {
  const keys = generateVAPIDKeys();
  Object.assign(process.env, {
    VAPID_PUBLIC_KEY: keys.publicKey,
    VAPID_PRIVATE_KEY: keys.privateKey,
    VAPID_SUBJECT: "mailto:test@example.test",
    STUDENT_TEST_DATABASE_URL: database.url,
  });
  fixture = await createStudentFixture();
  await checkNotificationUI(fixture, database.db);
  await checkNotificationLayout(fixture, database.db);
  await checkNotificationPage(fixture, database.db);
  await checkPushOwnership(fixture, database.db);
  await checkPushRecovery(fixture);
} finally {
  try {
    await fixture?.close();
  } finally {
    await database.close();
  }
}
