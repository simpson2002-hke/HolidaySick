# Roamwise — shared travel expenses

A polished, mobile-responsive travel ledger PWA plus a Cloudflare Worker foundation. The dashboard demonstrates shared trip spend, simplified settle-up suggestions, activity, and an add-expense interaction.

## Run the web app

```bash
npm install
npm run dev
```

## Cloudflare setup

1. Install Wrangler and authenticate: `npm install -g wrangler && wrangler login`.
2. Create the D1 database: `wrangler d1 create roamwise`. Copy its ID into `worker/wrangler.toml`.
3. Create the receipts bucket: `wrangler r2 bucket create roamwise-receipts`.
4. Apply the schema: `wrangler d1 execute roamwise --remote --file=worker/migrations/0001_initial.sql`.
5. Store the admin API token securely: `cd worker && wrangler secret put API_TOKEN`.
6. Deploy: `cd worker && wrangler deploy`.

Workers access D1 and R2 through bindings, so credentials never need to be exposed in the mobile/web app. Treat Worker secrets as the production mechanism for API and storage credentials; an admin UI can initiate rotation but must never display secret values.

## API starter routes

- `GET /trips/:id/balances` produces simplified debtor-to-creditor transfers from paid amounts and shares.
- `POST /sync/push` applies offline changes using last-write-wins based on server-compatible `updated_at` values.
- `POST /sync/pull?since=<ISO timestamp>` returns changed expenses for device reconciliation.
- `GET /admin/health` (Bearer `API_TOKEN`) performs D1 and R2 read/write health checks.

Amounts are stored as integer minor units (for example, cents), avoiding floating-point errors. Authentication and membership authorization should be applied before exposing trip routes in production.

## Publish a live preview with GitHub Pages

The repository includes a GitHub Actions workflow that builds the web app and publishes it to GitHub Pages whenever you push to the `main` or `work` branch.

1. Create a GitHub repository, then add it as this project's remote:
   ```bash
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git
   git push -u origin main
   ```
2. On GitHub, open **Settings → Pages**. Under **Build and deployment**, select **GitHub Actions** as the source, then save. This is required only once per repository.
3. Open the **Actions** tab and select **Deploy web app to GitHub Pages**. The first push starts it automatically; use **Run workflow** to publish manually later.
4. When the job is green, click its **deploy** job or open **Settings → Pages**. GitHub shows the public address, normally `https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPOSITORY_NAME/`.

### Before you publish

- The live preview contains sample travel and expense data only; it does **not** connect to the Worker yet.
- GitHub Pages is suitable for hosting this frontend. Deploy the API separately with the Cloudflare steps above, and use Worker secrets—not GitHub Pages variables—for private keys.
- If your production branch has a different name, update `branches: [main, work]` in `.github/workflows/deploy-pages.yml` to include it.
- For a private repository, GitHub Pages availability depends on your GitHub plan and organization policy.
