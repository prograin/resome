import assert from "node:assert/strict";
import { studentPaths } from "../../src/lib/student-auth/paths.js";
import { accountCopy } from "../../src/features/students/account-copy.js";
import { accountBannedCode } from "../../src/lib/student-account.js";

export async function checkBannedAccess(fixture, context, profileRequest) {
  const { origin, password } = fixture;
  const requests = [
    ["GET", "/api/auth/get-session/"],
    ["POST", "/api/auth/get-session/", {}],
    ["GET", "/api/students/notifications/"],
    ["PATCH", "/api/students/notifications/", { through: 1 }],
    ["GET", "/api/students/push/"],
    [
      "POST",
      "/api/auth/change-password/",
      {
        currentPassword: password,
        newPassword: "NewPassword!987",
        confirmPassword: "NewPassword!987",
        revokeOtherSessions: true,
      },
    ],
  ];
  for (const [method, path, data] of requests) {
    const response = await context.request.fetch(origin + path, {
      method,
      headers: { Origin: origin },
      data,
    });
    assert.equal(response.status(), 403, method + " " + path);
    assert.equal((await response.json()).code, accountBannedCode);
  }
  for (const path of [
    studentPaths.dashboard,
    studentPaths.history,
    studentPaths.chart,
    studentPaths.courses,
    studentPaths.goals,
    studentPaths.links,
    studentPaths.notifications,
    studentPaths.profile,
    studentPaths.password,
  ]) {
    const response = await context.request.get(origin + path);
    const html = await response.text();
    if (new URL(response.url()).pathname === studentPaths.signIn) {
      assert.equal(new URL(response.url()).searchParams.get("notice"), "banned");
      assert.ok(html.includes(accountCopy.fa.bannedDescription));
    } else {
      assert.ok(html.includes("NEXT_REDIRECT") && html.includes("notice=banned"), path);
    }
    assert.ok(!html.includes("Private activity score note"));
  }
  const denied = await context.request.post(profileRequest.url(), {
    headers: {
      Origin: origin,
      "next-action": profileRequest.headers()["next-action"],
      "content-type": profileRequest.headers()["content-type"],
    },
    data: profileRequest.postDataBuffer(),
  });
  assert.match(denied.headers()["x-action-redirect"] ?? (await denied.text()), /notice=banned/);
  console.log(
    "PASS banned existing sessions: pages, server actions, notifications, push, session renewal and password changes denied",
  );
}
