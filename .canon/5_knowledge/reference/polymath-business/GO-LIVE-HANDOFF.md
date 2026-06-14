# GO-LIVE HANDOFF — Polymath Publish Layer

**These steps are Boss-only. Claude never performs steps 1, 2, 3, or 5.**

This document describes the exact sequence for going from dry-run publish to live social distribution.

---

## Prerequisites

- Plan 5 (render pipeline) landed: rendered `.mp4` artifacts exist at `approval_queue.artifact_path`
- At least one approval row with `content_type='video'` AND `status='approved'` exists
- Mission Control server is running and `/api/publish` returns `200` with `dryRun: true`

---

## Boss-Only Go-Live Steps

### Step 1 (Boss): Create social accounts

Create `@zrodinger` accounts (or your chosen anonymous handle) on each platform:

| Platform | Account purpose | Notes |
|----------|----------------|-------|
| TikTok | Surge brand posts | Anonymous; never linked to Signal/Robin Dutta identity |
| YouTube | Surge brand posts | Separate channel from any personal account |
| Instagram | Surge brand posts | Separate from personal account |

**Brand isolation rule:** Surge (viral ecosystem) accounts must NEVER share identity, email, or credentials with Signal (content ecosystem) accounts. Separate email addresses per brand.

### Step 2 (Boss): Connect accounts to Buffer or Postiz

Choose ONE distribution tool per brand (or use platform tokens directly):

**Option A — Buffer (hosted, paid):**
1. Create a Buffer account (separate workspace per brand for isolation)
2. Connect the TikTok/YouTube/Instagram accounts from Step 1
3. Obtain a Buffer API token for the connected workspace
4. Note: Buffer is a paid tool. Boss must approve spend before connecting.

**Option B — Postiz (self-hosted, recommended for cost/control):**
1. Deploy or access your Postiz instance
2. Connect the accounts from Step 1
3. Obtain your `POSTIZ_API_KEY` and note your `POSTIZ_API_URL`

**ToS note:** Verify current Buffer/Postiz API rules before going live. Platform ToS for TikTok/YouTube/Instagram API usage must also be checked — these change. This is a Boss go-live concern, not a Claude concern.

### Step 3 (Boss): Set environment variables on the server

Set these env vars on the Mission Control server host. Use **suffixed keys only** — bare tokens like `BUFFER_TOKEN` are rejected by design (prevents cross-brand bleed).

**For Surge (viral ecosystem):**
```
# Buffer option:
BUFFER_TOKEN__VIRAL=<your Buffer API token for Surge workspace>

# OR Postiz option:
POSTIZ_API_KEY__VIRAL=<your Postiz API key>
POSTIZ_API_URL__VIRAL=<your Postiz instance URL, e.g. https://postiz.yourdomain.com>
```

**For Signal (content ecosystem):**
```
# Buffer option:
BUFFER_TOKEN__CONTENT=<your Buffer API token for Signal workspace>

# OR Postiz option:
POSTIZ_API_KEY__CONTENT=<your Postiz API key>
POSTIZ_API_URL__CONTENT=<your Postiz instance URL>
```

**Do NOT set:**
- `BUFFER_TOKEN` (no suffix) — rejected as credential source, resolves to dry-run
- Any credential shared between brands

**Never commit env vars to the repository.** Use `.env` (git-ignored) or your hosting platform's secret manager.

### Step 4 (Boss): Restart the Mission Control server

The server reads env vars at startup. After setting creds:

```bash
# Restart server (exact command depends on your deployment)
npm run dev    # development
# or restart your process manager / container
```

Verify: The server log should show no credential errors. A test POST to `/api/publish` with a dry-run approval should now return `dryRun: false` (once real creds are present).

### Step 5 (Boss): Click Publish per asset

In the Mission Control dashboard:
1. Navigate to the **Approval Queue**
2. Find an item with `content_type: video` and `status: approved`
3. Click the **Publish** button on the card
4. Review the result — no "DRY RUN" banner = live post

**Per-asset rule:** There is no bulk publish. Each approved video requires a separate Boss click. This is by design.

---

## Affiliate Ecosystem Note

If publishing from the `affiliate` ecosystem, the `contentJson.affiliateDisclosure` field must be non-empty. The server will 409 with reason `ftc-disclosure-missing` if it is absent. This is an FTC compliance requirement — ensure captions include the required disclosure text before approving affiliate content.

---

## What Claude Never Does

- **Never creates social accounts** (Step 1)
- **Never connects accounts to Buffer/Postiz** (Step 2)
- **Never enters, stores, or reads credentials** (Step 3) — credentials exist only as env vars at runtime
- **Never auto-publishes** — there is no scheduler, cron, or agent trigger for /api/publish
- **Never clicks Publish** (Step 5) — the button exists only in the browser, for Boss

---

## Verification Checklist (Boss)

- [ ] Dry-run confirms `selectDistributor` returns the right adapter (check server logs)
- [ ] `/api/publish` with an approved video returns `200` and `dryRun: false`
- [ ] Post appears on platform (TikTok/YouTube/Instagram)
- [ ] Task status shows `published` in the board
- [ ] No cross-brand credential bleed (viral creds don't affect content ecosystem)
- [ ] FTC disclosure present on affiliate captions before publish

---

*Last updated: 2026-06-14 — Plan 6 (publish layer)*
