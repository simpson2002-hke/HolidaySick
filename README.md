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
