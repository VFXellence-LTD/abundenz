# Surge — Account Management

Multi-account strategy, setup protocol, and operational guidelines.

---

## Strategy

Surge operates multiple anonymous accounts across multiple platforms. Each account has:
- A distinct brand name and visual identity
- Content from one vertical only (or a defined content mix)
- No connection to the operator's personal identity
- No connection to other Surge accounts (or any other Polymath ecosystem)

## Account structure

```
Vertical 1 (e.g., "horror stories")
  ├── TikTok:    @[brand1]
  ├── YouTube:   @[brand1]
  └── Instagram: @[brand1]

Vertical 2 (e.g., "impossible history")
  ├── TikTok:    @[brand2]
  ├── YouTube:   @[brand2]
  └── Instagram: @[brand2]

... (one brand per vertical, across all platforms)
```

Each vertical gets ONE brand identity used consistently across all platforms. This builds recognizable presence per niche while maintaining full anonymity.

## Account setup protocol

For each new account:

1. **Choose brand name** — unique, niche-relevant, not similar to other Surge brands
2. **Register handles** — same handle across TikTok, YouTube, Instagram
3. **Create visual identity** — profile picture, banner, color scheme (AI-generated)
4. **Write bio** — niche-specific, includes CTA ("Follow for daily [content type]")
5. **Configure per platform:**
   - TikTok: Creator account, enable Creator Rewards when eligible
   - YouTube: New channel under new Google account, enable Shorts monetization when eligible
   - Instagram: Professional account, configure bio link
6. **Document in vertical README** — handles, status, monetization status

## Operational guidelines

### Content isolation
- Each account posts content from its own vertical ONLY
- No cross-posting identical content between accounts
- No referencing other Surge accounts in posts or bios
- No shared visual assets between accounts (different brand = different everything)

### Posting cadence
- Minimum 1 post/day per account to maintain algorithmic favor
- Target 2-3 posts/day at scale
- Schedule posts for peak engagement hours (see platform-rpm.md)
- Never post same content to multiple platforms simultaneously — stagger by 4-24 hours

### Account health
- Monitor for shadow bans or reduced reach (RPM Tracker flags this)
- If account is restricted: pause posting for 48 hours, then resume at reduced cadence
- If account is banned: document reason, create replacement account with different brand, do NOT re-upload banned content
- Rotate content styles periodically to avoid "sameness" algorithmic penalty

### Platform ToS compliance
- TikTok: technically limits to 1 account per phone number. Use different registration methods per account.
- YouTube: multiple channels per Google account is allowed
- Instagram: limit of 5 accounts per person. Use Creator accounts.

=== DO NOT STORE ACCOUNT CREDENTIALS IN THIS VAULT ===
=== USE A PASSWORD MANAGER FOR ALL ACCOUNT CREDENTIALS ===

## Tracking

All accounts tracked in Airtable:

| Field | Description |
|-------|-------------|
| account_id | Unique identifier |
| vertical | Which content vertical |
| platform | TikTok / YouTube / Instagram |
| handle | @username |
| brand_name | Brand identity |
| created_date | When account was created |
| first_post_date | When first content was posted |
| followers | Current follower count |
| monetized | Yes/No |
| monetized_date | When monetization was enabled |
| status | active / paused / restricted / banned |
| monthly_revenue | Current month's revenue |
| lifetime_revenue | Total revenue to date |
