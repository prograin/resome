import assert from "node:assert/strict";
import { copyFile, mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";

const route = resolve(".next/server/app/api/auth/[...auth]");
const trace = JSON.parse(await readFile(join(route, "route.js.nft.json"), "utf8"));
const root = await mkdtemp(join(tmpdir(), "prograin-rate-limit-trace-"));
try {
  for (const file of trace.files) {
    const source = resolve(route, file);
    const path = relative(resolve("node_modules"), source).replaceAll("\\", "/");
    if (!/^(rate-limiter-flexible|drizzle-orm)\//.test(path)) continue;
    if (!(await stat(source)).isFile()) continue;
    const target = join(root, "node_modules", path);
    await mkdir(dirname(target), { recursive: true });
    await copyFile(source, target);
  }
  const probe = join(root, "probe.mjs");
  await writeFile(
    probe,
    `
    import assert from 'node:assert/strict';
    import { RateLimiterDrizzle } from 'rate-limiter-flexible';
    const client = { select: () => ({ from: () => ({ where: () => ({ limit: async () => [] }) }) }) };
    const limiter = new RateLimiterDrizzle({
      storeClient: client, schema: { key: 'key', expire: 'expire' }, points: 5, duration: 60,
      clearExpiredByTimeout: false,
    });
    assert.equal(await limiter.get('deployment-probe'), null);
  `,
  );
  const result = execFileSync(process.execPath, [probe], { cwd: root, encoding: "utf8" });
  assert.equal(result.trim(), "");
  console.log(
    "PASS rate limiter deployment: dynamically imported ORM is present in isolated traced files.",
  );
} finally {
  await rm(root, { recursive: true, force: true });
}
