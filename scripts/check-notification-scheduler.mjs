import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, unlink, rmdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { load } from "js-yaml";

const workflow = load(await readFile(".github/workflows/student-notifications.yml", "utf8"));
assert.equal(workflow.on.schedule[0].cron, "17 * * * *");
assert.ok("workflow_dispatch" in workflow.on);
assert.deepEqual(workflow.permissions, {});
assert.equal(workflow.concurrency["cancel-in-progress"], false);
const job = workflow.jobs.retry;
assert.equal(job.env.CRON_SECRET, "${{ secrets.CRON_SECRET }}");
assert.equal(job.env.ACADEMY_URL, "${{ vars.ACADEMY_URL }}");
const bash = existsSync("C:/Program Files/Git/bin/bash.exe")
  ? "C:/Program Files/Git/bin/bash.exe"
  : "bash";
await mkdir(".backup", { recursive: true });
const directory = await mkdtemp(path.resolve(".backup/notification-scheduler-"));
const env = {
  ...process.env,
  ACADEMY_URL: "https://academy.example.test/",
  EXPECTED_URL: "https://academy.example.test/api/cron/student-notifications/",
  CRON_SECRET: "test-scheduler-secret-not-a-real-key-123456",
  RUNNER_TEMP: directory.replaceAll("\\", "/"),
};
function run(script, extra = {}) {
  return spawnSync(bash, ["--noprofile", "--norc", "-e", "-o", "pipefail", "-c", script], {
    env: { ...env, ...extra },
    encoding: "utf8",
    windowsHide: true,
  });
}
const stub = `
curl() {
  if [ "$MOCK_STATUS" = "transport-error" ]; then return 22; fi
  output=""
  while [ "$#" -gt 0 ]; do
    case "$1" in
      --output) output="$2"; shift ;;
      --header) [ "$2" = "Authorization: Bearer $CRON_SECRET" ] || return 99; shift ;;
      https://*) [ "$1" = "$EXPECTED_URL" ] || return 98 ;;
    esac
    shift
  done
  printf '{"sent":1}' > "$output"
  printf '%s' "$MOCK_STATUS"
}
`;
try {
  const validate = job.steps[0].run;
  assert.equal(run(validate).status, 0);
  assert.notEqual(run(validate, { CRON_SECRET: "" }).status, 0);
  assert.notEqual(run(validate, { ACADEMY_URL: "http://example.test" }).status, 0);
  const processQueue = stub + job.steps[1].run;
  const success = run(processQueue, { MOCK_STATUS: "200" });
  assert.equal(success.status, 0, success.stderr);
  assert.deepEqual(JSON.parse(success.stdout), { sent: 1 });
  for (const status of ["301", "401", "503", "transport-error"])
    assert.notEqual(run(processQueue, { MOCK_STATUS: status }).status, 0);
  console.log(
    "PASS hourly scheduler: YAML, least privilege, shared-secret header, configuration checks, HTTP/transport failures and no real requests.",
  );
} finally {
  await unlink(path.join(directory, "student-notifications.json")).catch(() => {});
  await rmdir(directory);
}
