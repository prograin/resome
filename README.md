# Prograin

Bilingual software development and programming education website built with Next.js App Router.

```sh
npm ci
npm run dev
```

Open [http://localhost:4173](http://localhost:4173). The development server supports fast refresh for page and content changes. Restart it after changing stylesheet sources or original images so it can regenerate the assets.

- `src/app/` defines routes, the shared layout, metadata endpoints and the 404 page.
- `src/features/` contains route components. Shared UI and browser preferences live in `src/components/`.
- `src/content/` stores bilingual copy, prices, FAQs and portfolio data.
- `src/css/` contains small stylesheet modules. `src/css/index.css` sets their order.
- `src/seo/` supplies route metadata and structured data. Update the domain in `src/config/site.js`.
- `src/resume/` contains the portfolio sections, rendering and filtering. Its runtime and data are scoped to the portfolio routes.

For production, run `npm run package`. Next.js prerenders public routes and serves student authentication and dashboards on demand. Deploy with the Next.js preset on Vercel or run `npm run preview` on a Node.js host. The asset preparation step creates responsive WebP backgrounds and release-versioned assets. Keep originals in `assets/`. See [the editing guide](docs/STRUCTURE.md) and [SEO and publication](docs/SEO.md).

To test the production build, run `npm run preview` after packaging and open port 4173. For a different port, run `npx next start -H 127.0.0.1 -p 4183` and use a matching `BETTER_AUTH_URL` when testing sign-in. `npm run test:browser`, `npm run test:performance` and `npm run test:updates` target that preview by default and accept a `SITE_URL` override. Browser tests use Microsoft Edge through Playwright.

Use `npm run lint` and `npm run format:check` to check code style. Use `npm run format` to apply formatting.

Backend security, shared PostgreSQL rate limits, request validation, headers and deployment requirements are documented in [the security guide](docs/SECURITY.md). Run `npm run test:security` for checks without a database, and `npm run test:security:db` against an isolated PostgreSQL test server.

## Student sign-in

Set `DATABASE_URL`, `BETTER_AUTH_URL` and `BETTER_AUTH_SECRET` in `.env` locally or in the deployment environment. See `.env.example` for the variable names. Use the browser origin as `BETTER_AUTH_URL` and set the database password in `DATABASE_URL` if required. Generate a secret with `npx @better-auth/cli secret` or Node's `randomBytes(32)`.

Email setup requires `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in the same environment, including Vercel Production. The profile sends a four-digit code with the official Resend SDK and uses Better Auth Email OTP to save and verify the address only after a valid code. No new database migration is needed. Codes expire after five minutes, allow three attempts, and are stored hashed. `npm run test:email:otp` covers this flow with a separate test database and a mocked sender.

Run `npm run auth:migrate` to create or update the authentication and student progress tables. An operator can create an account by setting `STUDENT_PASSWORD` in the shell and running `npm run student:add -- --username student01 --email student@example.com --name "Student Name"`. Clear `STUDENT_PASSWORD` from the shell afterward. Keep account creation on the operator's machine.

Create an account for the administrator the same way, set `STUDENT_ADMIN_USERNAME` to that account's username, and restart the app. The administrator can assign courses, change their status, and record scores from 1 to 5 with optional notes. An entry linked to a course counts toward that course and the overall score. General entries count toward the overall score only. Ordinary students see their own scores, rank, and history.

With a local scratch PostgreSQL server, set `STUDENT_TEST_DATABASE_URL` to its connection URL, run the build, then run `npm run test:students`. The test starts a separate Next.js process on port 4183 and creates an isolated database with temporary accounts, then removes that database. The test account needs database-creation rights. `npm run test:validation` checks shared Zod schemas without a database.

Weekly KPI snapshots use a protected Vercel cron job, scheduled for Saturday at 00:00 Tehran time. Set `CRON_SECRET` in the deployment environment after migrating the database. Run `npm run student:weekly` for an initial snapshot or manual execution. See [weekly statistics setup and rules](docs/STUDENT-WEEKLY-STATS.md).

Academy data and Better Auth use Drizzle ORM with the existing PostgreSQL tables. Use `npm run db:generate` for a new migration and `npm run db:migrate` to apply migrations; existing complete legacy databases are adopted without recreating student tables. See [academy architecture and testing](docs/ACADEMY-ARCHITECTURE.md).
