import assert from "node:assert/strict";
import { eq } from "drizzle-orm";
import pRetry from "p-retry";
import { users, courseDefinitions, awards, courses } from "../../src/lib/db/schema/index.js";
import { writeAdminCourse } from "../../src/lib/db/admin-courses.js";
import { studentPaths } from "../../src/lib/student-auth/paths.js";
import { notificationHref } from "../../src/lib/notifications/targets.js";
import { createStudentContext } from "../lib/student-browser-context.mjs";

export async function checkNotificationUI(fixture, db) {
  const { browser, context, origin, studentId, username, password, admin } = fixture;
  const api = origin + "/api/students/notifications/";
  assert.equal((await context.request.get(api)).status(), 401);
  await db.update(users).set({ emailVerified: true }).where(eq(users.id, studentId));
  const [definition] = await db
    .insert(courseDefinitions)
    .values({ title: "Notification Course" })
    .returning();
  await writeAdminCourse(db, admin, definition.id, "enroll", null, { studentId });
  const [assignment] = await db.select().from(courses).where(eq(courses.studentId, studentId));
  const teacher = await createStudentContext(browser, { viewport: { width: 1440, height: 960 } });
  const login = async (target, account) =>
    assert.equal(
      (
        await target.request.post(origin + "/api/auth/sign-in/username/", {
          headers: { Origin: origin },
          data: { username: account, password },
        })
      ).status(),
      200,
    );
  try {
    await login(teacher, admin);
    const page = await teacher.newPage();
    await page.goto(origin + studentPaths.dashboard + "?student=" + studentId);
    const form = page.locator(".student-management__award");
    await form.locator('[name="points"]').fill("4");
    await form.locator('[name="note"]').fill("Private grade note");
    await form.locator('button[type="submit"]').click();
    await form.locator('[data-status="saved"]').waitFor();
    await pRetry(
      async () =>
        assert.equal(
          (await fixture.readEmailMessages()).filter((m) => m.subject.includes("امتیاز جدید"))
            .length,
          1,
        ),
      { retries: 30, minTimeout: 100, maxTimeout: 200 },
    );
    const [award] = await db.select().from(awards).where(eq(awards.studentId, studentId));
    const mail = (await fixture.readEmailMessages()).find((m) => m.subject.includes("امتیاز جدید"));
    assert.ok(mail.text.includes(notificationHref({ kind: "award", entityId: award.id })));
    assert.ok(mail.text.includes("توضیحات استاد:\nPrivate grade note"));
    await login(context, username);
    const inbox = await (await context.request.get(api)).json();
    assert.equal(inbox.unread, 2);
    assert.equal(inbox.items.length, 2);
    assert.ok(!JSON.stringify(inbox).includes("@example.test"));
    const score = inbox.items.find((item) => item.kind === "award");
    assert.equal(
      (
        await teacher.request.patch(api, { headers: { Origin: origin }, data: { id: score.id } })
      ).status(),
      404,
    );
    assert.equal(
      (
        await context.request.patch(api, {
          headers: { Origin: "https://evil.test" },
          data: { id: score.id },
        })
      ).status(),
      403,
    );
    assert.equal(
      (
        await context.request.post(origin + "/api/students/push/", {
          headers: { Origin: origin },
          data: {
            endpoint: "https://127.0.0.1/private",
            keys: { p256dh: "invalid", auth: "invalid" },
          },
        })
      ).status(),
      400,
    );
    const student = await context.newPage();
    await student.goto(origin + studentPaths.dashboard);
    const bell = student.locator(".student-notifications__bell:visible");
    await bell.waitFor();
    await bell.click();
    let dialog = student.getByRole("dialog", { name: "اعلان‌ها", exact: true });
    await dialog.getByRole("link").filter({ hasText: "امتیاز جدید برای شما ثبت شد" }).click();
    await student.waitForURL(origin + studentPaths.history);
    await student.locator(`#award-${award.id}`).waitFor();
    assert.equal(await student.locator("[data-notification-selected]").count(), 0);
    assert.equal((await (await context.request.get(api)).json()).unread, 2);
    await bell.click();
    dialog = student.getByRole("dialog", { name: "اعلان‌ها", exact: true });
    await dialog.getByRole("link").filter({ hasText: "دورهٔ جدید برای شما اضافه شد" }).click();
    await student.waitForURL(origin + studentPaths.courses);
    await student.locator(`#course-${assignment.id}`).waitFor();
    assert.equal(await student.locator("[data-notification-selected]").count(), 0);
    await student.goto(origin + studentPaths.notifications);
    await pRetry(
      async () => assert.equal((await (await context.request.get(api)).json()).unread, 0),
      { retries: 20, minTimeout: 100, maxTimeout: 200 },
    );
    await student.reload();
    assert.equal((await (await context.request.get(api)).json()).unread, 0);
    const anonymous = await browser.newContext();
    try {
      const signIn = await anonymous.newPage();
      await signIn.goto(origin + notificationHref({ kind: "award", entityId: award.id }));
      await signIn.waitForURL((url) => url.pathname === studentPaths.signIn);
      assert.equal(
        new URL(signIn.url()).searchParams.get("next"),
        notificationHref({ kind: "award", entityId: award.id }),
      );
      await signIn.locator('[name="username"]').fill(username);
      await signIn.locator('[name="password"]').fill(password);
      await signIn.locator('button[type="submit"]').click();
      await signIn.waitForURL((url) => url.pathname === studentPaths.history);
      await signIn.locator(`#award-${award.id}`).waitFor();
      assert.equal(await signIn.locator("[data-notification-selected]").count(), 0);
      await signIn.goto(
        origin + studentPaths.signIn + "?next=" + encodeURIComponent("https://evil.test/"),
      );
      await signIn.waitForURL(origin + studentPaths.dashboard);
    } finally {
      await anonymous.close();
    }
    await db.delete(awards).where(eq(awards.id, award.id));
    await student.goto(origin + notificationHref({ kind: "award", entityId: award.id }));
    await student.getByRole("heading", { name: "تاریخچهٔ امتیازها", exact: true }).waitFor();
    await student.goto(origin + notificationHref({ kind: "course", entityId: 999999 }));
    await student.locator(".student-progress__grid").waitFor();
    console.log(
      "PASS notification UI: real grade action with mocked Resend, automatic inbox reads, plain score/course destinations, verified-only email and return after login.",
    );
  } finally {
    await teacher.close();
  }
}
