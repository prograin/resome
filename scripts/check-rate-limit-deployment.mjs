import assert from "node:assert/strict";
import { copyFile, mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";

const app = resolve(".next/server/app");
const modules = resolve("node_modules");
const graphs = new Map();
const routes = [];
for (const file of await readdir(app, { recursive: true })) {
  if (!file.endsWith(".nft.json")) continue;
  const tracePath = join(app, file);
  const trace = JSON.parse(await readFile(tracePath, "utf8"));
  if (!trace.files.some((path) => path.includes("/node_modules/rate-limiter-flexible/"))) continue;
  const files = trace.files.map((path) => resolve(dirname(tracePath), path));
  const dependencies = files
    .map((path) => relative(modules, path).replaceAll("\\", "/"))
    .filter((path) => !path.startsWith("../"))
    .sort();
  assert.ok(dependencies.includes("drizzle-orm/package.json"), file);
  assert.ok(dependencies.includes("pg/package.json"), file);
  routes.push(file.replaceAll("\\", "/"));
  graphs.set(JSON.stringify(dependencies), dependencies);
}
for (const required of ["api/auth/", "api/cron/", "api/students/", "academy/students/"])
  assert.ok(
    routes.some((route) => route.startsWith(required)),
    required,
  );

async function checkGraph(dependencies) {
  const root = await mkdtemp(join(tmpdir(), "prograin-rate-limit-trace-"));
  try {
    for (const path of dependencies) {
      const source = join(modules, path);
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
    import pg from 'pg';
    import { drizzle } from 'drizzle-orm/node-postgres';
    const pool = new pg.Pool({ connectionString: 'postgresql://test@127.0.0.1/test' });
    assert.equal(typeof drizzle(pool).select, 'function');
    await pool.end();
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
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

for (const graph of graphs.values()) await checkGraph(graph);
console.log(
  `PASS deployment: ${routes.length} private/API/cron traces, ${graphs.size} isolated dependency graphs, rate limiter, ORM and PostgreSQL driver.`,
);
