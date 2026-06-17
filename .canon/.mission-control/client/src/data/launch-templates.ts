import type { EcosystemId } from "@/types";

export interface LaunchField {
  key: string;
  label: string;
  type: "text" | "url" | "email" | "password" | "select" | "note" | "platform-handles";
  placeholder?: string;
  options?: string[];
  sensitive?: boolean;
  generatable?: boolean;
  generatePrompt?: string;
  defaultPlatforms?: string[];
}

export interface LaunchStep {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  category: "brand" | "accounts" | "affiliate" | "content" | "tracking";
  urls?: string[];
  dependsOn?: string[];
  fields?: LaunchField[];
}

export interface LaunchTemplate {
  ecosystemId: EcosystemId;
  steps: LaunchStep[];
}

const SURGE_STEPS: LaunchStep[] = [
  {
    id: "email",
    title: "Create anonymous email",
    description: "New email with no personal identity. Use for all platform accounts.",
    instructions: [
      "Go to your domain registrar (Cloudflare recommended)",
      "Set up Email Routing for your domain",
      "Create a forwarding address: [brandname]@abundenz.com",
      "Forward to your personal Gmail (never shown publicly)",
      "Test: send an email to the new address, confirm it arrives",
    ],
    category: "brand",
    urls: ["https://dash.cloudflare.com"],
    fields: [
      { key: "email", label: "Brand email created", type: "email", placeholder: "zrodinger@abundenz.com" },
      { key: "forwards_to", label: "Forwards to", type: "email", placeholder: "your-personal@gmail.com", sensitive: true },
    ],
  },
  {
    id: "brand-name",
    title: "Select brand name",
    description: "Pick from ecosystem category (Scientists for Surge). Apply z-rule. Check trademark + handle availability.",
    instructions: [
      "Open vault/shared/brand-naming.md for the name pool",
      "Pick a name from the Scientists sub-category",
      "Search TikTok, YouTube, Instagram for @[name] handle availability",
      "Search Google for '[name] trademark' to check conflicts",
      "Record chosen name and available handles below",
    ],
    category: "brand",
    fields: [
      { key: "brand_name", label: "Brand name", type: "text", placeholder: "Zrodinger" },
      { key: "handle", label: "Handle", type: "text", placeholder: "@zrodinger" },
      { key: "platform_handles", label: "Platform handles", type: "platform-handles" as const, defaultPlatforms: ["TikTok", "YouTube", "Instagram", "Pinterest", "X / Twitter", "Reddit", "Threads", "Blog"] },
    ],
  },
  {
    id: "tiktok",
    title: "Create TikTok account",
    description: "Anonymous brand account. Switch to Business account. Set niche in bio.",
    instructions: [
      "Download TikTok or go to tiktok.com",
      "Sign up with brand email",
      "Set username to your chosen handle",
      "Switch to Business Account (Settings → Manage account → Switch to Business)",
      "Set category to 'Technology'",
      "Write bio: short, niche-relevant, include 'Link in bio ↓'",
      "Add profile photo (brand logo or icon — no face)",
    ],
    category: "accounts",
    urls: ["https://www.tiktok.com/signup"],
    dependsOn: ["email", "brand-name"],
    fields: [
      { key: "tiktok_handle", label: "TikTok handle", type: "text", placeholder: "@zrodinger" },
      { key: "tiktok_bio", label: "Bio text (copy this)", type: "text", placeholder: "free tools exist in superposition until tested ⚛️↓", generatable: true, generatePrompt: "Write a TikTok bio for @zrodinger — a faceless tech/AI tools and gadgets review channel. Schrödinger/quantum theme. Must be under 80 characters. Witty, lowercase, end with emoji + ↓ for link. One line only. Don't just rewrite the current text — give a fresh take." },
      { key: "account_type", label: "Account type", type: "select", options: ["Personal", "Business", "Creator"] },
    ],
  },
  {
    id: "youtube",
    title: "Create YouTube channel",
    description: "Shorts-focused. Keyword-rich description. No face, no personal identity.",
    instructions: [
      "Go to YouTube → sign in with brand email",
      "Create a new channel (use brand name)",
      "Set custom handle to @zrodinger",
      "Copy channel description from field below",
      "Upload profile photo and banner (brand identity, no face)",
      "Set channel category to Science & Technology",
    ],
    category: "accounts",
    urls: ["https://www.youtube.com/create_channel"],
    dependsOn: ["email", "brand-name"],
    fields: [
      { key: "youtube_handle", label: "YouTube handle", type: "text", placeholder: "@zrodinger" },
      { key: "youtube_url", label: "Channel URL", type: "url", placeholder: "https://youtube.com/@zrodinger" },
      { key: "channel_description", label: "Channel description (copy this)", type: "note", placeholder: "Free AI tools that replace expensive software. New discoveries daily.\n\nIs the tool good? You won't know until you open the box.\n\n🔗 Tools & links below", generatable: true, generatePrompt: "Write a YouTube channel description for @zrodinger — a faceless tech/AI tools channel under the Abundenz brand. Schrödinger's cat theme (quantum uncertainty). Short, witty, keyword-rich (AI tools, free software, tech reviews). Max 150 words. No hashtags." },
    ],
  },
  {
    id: "instagram",
    title: "Create Instagram account",
    description: "Reels-focused. Switch to Creator account. Bio link to link tree.",
    instructions: [
      "Download Instagram or go to instagram.com",
      "Sign up with brand email",
      "Set username to @zrodinger",
      "Switch to Creator Account (Settings → Account → Switch to Creator)",
      "Set category to 'Digital Creator'",
      "Copy bio from TikTok (keep consistent across platforms)",
      "Add profile photo (same as TikTok — consistent brand)",
    ],
    category: "accounts",
    urls: ["https://www.instagram.com/accounts/emailsignup/"],
    dependsOn: ["email", "brand-name"],
    fields: [
      { key: "instagram_handle", label: "Instagram handle", type: "text", placeholder: "@zrodinger" },
      { key: "instagram_bio", label: "Bio text (copy this)", type: "text", placeholder: "tech you didn't know you needed ⚛️ ai · gadgets · reviews", generatable: true, generatePrompt: "Write an Instagram bio for @zrodinger — a faceless tech/AI tools and gadgets review channel. Must be under 80 characters. Include topic keywords (tech, AI, gadgets, reviews). Witty, lowercase. One line only. Don't just rewrite the current text — give a fresh take." },
      { key: "account_type", label: "Account type", type: "select", options: ["Personal", "Creator", "Business"] },
    ],
  },
  {
    id: "pinterest",
    title: "Create Pinterest business account",
    description: "Visual search engine. Pins with affiliate links get indexed by Google. Evergreen traffic.",
    instructions: [
      "Go to pinterest.com/business/create",
      "Sign up with brand email",
      "Set business name to brand name",
      "Claim your website (if you have one) for rich pins",
      "Create 3-5 boards by product category (e.g., 'Best AI Tools', 'Tech Gadgets', 'Productivity Apps')",
      "Enable rich pins for better click-through",
      "Profile description: keyword-rich, mention what you review",
    ],
    category: "accounts",
    urls: ["https://www.pinterest.com/business/create/"],
    dependsOn: ["email", "brand-name"],
    fields: [
      { key: "pinterest_handle", label: "Pinterest handle", type: "text", placeholder: "@zrodinger" },
      { key: "pinterest_url", label: "Profile URL", type: "url", placeholder: "https://pinterest.com/zrodinger" },
      { key: "pinterest_bio", label: "Bio text", type: "text", placeholder: "AI tools, tech gadgets & free software — tested and reviewed ⚛️", generatable: true, generatePrompt: "Write a Pinterest bio for @zrodinger — a faceless tech/AI tools and gadgets review account. Must be under 160 characters. Keyword-rich (AI tools, tech, gadgets, reviews, free software). Professional but approachable. One line only." },
      { key: "boards_created", label: "Boards created", type: "text", placeholder: "0" },
    ],
  },
  {
    id: "twitter",
    title: "Create X (Twitter) account",
    description: "Tech tool threads and quick product recommendations. Good for viral reach.",
    instructions: [
      "Go to x.com/i/flow/signup",
      "Sign up with brand email",
      "Set handle to @zrodinger (or closest available)",
      "Copy bio from TikTok (keep consistent)",
      "Add profile photo (same as other platforms)",
      "Add bio link to link tree",
      "Pin a thread introducing what you review",
    ],
    category: "accounts",
    urls: ["https://x.com/i/flow/signup"],
    dependsOn: ["email", "brand-name"],
    fields: [
      { key: "twitter_handle", label: "X handle", type: "text", placeholder: "@zrodinger" },
      { key: "twitter_bio", label: "Bio text", type: "text", placeholder: "testing AI tools so you don't have to ⚛️", generatable: true, generatePrompt: "Write an X/Twitter bio for @zrodinger — a faceless tech/AI tools review account. Must be under 160 characters. Witty, lowercase, tech-focused. One line only. Don't just rewrite the current text — give a fresh take." },
    ],
  },
  {
    id: "reddit",
    title: "Create Reddit account",
    description: "Contribute to tech subreddits. Genuine engagement, not spam. Long-tail traffic via comments.",
    instructions: [
      "Go to reddit.com/register",
      "Sign up with brand email (or separate throwaway for anonymity)",
      "Join relevant subreddits: r/gadgets, r/cooltech, r/aitools, r/productivity, r/SideProject",
      "Build karma first — comment helpfully for 1-2 weeks before posting links",
      "Never hard-sell. Mention products naturally in relevant threads.",
      "Add affiliate links only where subreddit rules allow",
      "Note: Reddit hates obvious self-promo — authenticity is mandatory",
    ],
    category: "accounts",
    urls: ["https://www.reddit.com/register"],
    dependsOn: ["email"],
    fields: [
      { key: "reddit_username", label: "Reddit username", type: "text", placeholder: "zrodinger" },
      { key: "subreddits_joined", label: "Subreddits joined", type: "text", placeholder: "r/gadgets, r/aitools" },
      { key: "karma", label: "Current karma", type: "text", placeholder: "0" },
    ],
  },
  {
    id: "blog",
    title: "Set up blog / website",
    description: "Amazon prefers affiliates with a website. SEO traffic compounds over time. Free options available.",
    instructions: [
      "OPTION A — Free: Create Medium.com account or WordPress.com (free tier)",
      "OPTION B — Owned ($5-10/mo): Ghost, WordPress.org on Vercel/Cloudflare, or Hashnode",
      "Use brand name as site title",
      "Write 2-3 product review posts before applying to affiliate programs",
      "Add affiliate disclosure page (required by Amazon + FTC)",
      "Link from all social bios",
      "SEO tip: target '[product name] review' keywords — low competition, high buyer intent",
    ],
    category: "accounts",
    urls: ["https://medium.com", "https://wordpress.com", "https://ghost.org"],
    dependsOn: ["email", "brand-name"],
    fields: [
      { key: "blog_platform", label: "Platform", type: "select", options: ["Medium", "WordPress.com", "WordPress.org", "Ghost", "Hashnode", "Other"] },
      { key: "blog_url", label: "Blog URL", type: "url", placeholder: "https://zrodinger.medium.com" },
      { key: "posts_published", label: "Posts published", type: "text", placeholder: "0" },
    ],
  },
  {
    id: "threads",
    title: "Create Threads account",
    description: "Meta's X competitor. Links to Instagram. Growing tech audience.",
    instructions: [
      "Open Threads app (or threads.net)",
      "Log in with Instagram account (auto-linked)",
      "Bio and handle carry over from Instagram",
      "Cross-post tech takes from X/Twitter",
    ],
    category: "accounts",
    urls: ["https://www.threads.net"],
    dependsOn: ["instagram"],
    fields: [
      { key: "threads_handle", label: "Threads handle", type: "text", placeholder: "@zrodinger" },
    ],
  },
  {
    id: "amazon",
    title: "Sign up Amazon Associates",
    description: "Day 1 — instant approval, no followers needed. 1-4.5% commission. Start earning via bio links immediately.",
    instructions: [
      "Go to affiliate-program.amazon.com",
      "Sign up with brand email",
      "Enter website/social profile URLs (TikTok, YouTube)",
      "Choose store ID (e.g., schrodingzer-20)",
      "Select preferred payment method",
      "You'll get a tracking ID immediately — can start linking",
      "Add product links to your bio link tree right away",
      "Note: must make 3 sales within 180 days or account closes",
    ],
    category: "affiliate",
    urls: ["https://affiliate-program.amazon.com"],
    dependsOn: ["email"],
    fields: [
      { key: "amazon_store_id", label: "Store ID", type: "text", placeholder: "schrodingzer-20" },
      { key: "amazon_tracking_id", label: "Tracking ID", type: "text", placeholder: "schrodingzer-20" },
      { key: "amazon_status", label: "Status", type: "select", options: ["Applied", "Active", "Pending review"] },
    ],
  },
  {
    id: "tiktok-shop",
    title: "Apply for TikTok Shop affiliate",
    description: "Unlock at 1K followers. 10-25% commission on in-app purchases — much higher than Amazon.",
    instructions: [
      "Requirement: 1,000+ followers to apply (focus on content + Amazon links first)",
      "Once at 1K: Open TikTok → Creator tools → TikTok Shop → Affiliate",
      "Complete identity verification (required since July 2025)",
      "Apply as affiliate creator — approval takes 1-3 days",
      "Browse trending tech products, sort by commission rate",
      "Add 3-5 high-commission products to your showcase",
      "New accounts (<5K followers) get 30-day pilot: limited product access, 3 posts/day max",
      "Commission rates: 10-15% open collab, 18-25%+ targeted/invite-only",
      "This replaces Amazon as primary revenue once unlocked — 5-10x higher commissions",
    ],
    category: "affiliate",
    urls: ["https://shop.tiktok.com/"],
    dependsOn: ["tiktok", "daily-30"],
    fields: [
      { key: "follower_count", label: "Current followers", type: "text", placeholder: "0" },
      { key: "tiktok_shop_status", label: "Application status", type: "select", options: ["Under 1K — not eligible yet", "Applied", "Approved", "In 30-day pilot", "Full access", "Rejected"] },
      { key: "products_added", label: "Products in showcase", type: "text", placeholder: "0" },
    ],
  },
  {
    id: "notion",
    title: "Apply to Notion affiliate",
    description: "50% commission for 12 months per signup. 180-day cookie.",
    instructions: [
      "Go to notion.so/affiliates",
      "Apply with brand email",
      "Describe your audience: tech-curious creators/freelancers on TikTok and YouTube",
      "Approval may take a few days",
      "Once approved: get unique referral link",
    ],
    category: "affiliate",
    urls: ["https://www.notion.so/affiliates"],
    dependsOn: ["email"],
    fields: [
      { key: "notion_status", label: "Status", type: "select", options: ["Not applied", "Applied", "Approved", "Rejected"] },
      { key: "notion_ref_link", label: "Referral link", type: "url", placeholder: "https://notion.so/?r=..." },
    ],
  },
  {
    id: "nordvpn",
    title: "Apply to NordVPN affiliate",
    description: "40% initial + 30% recurring commission.",
    instructions: [
      "Go to nordvpn.com/affiliate",
      "Apply with brand email",
      "Describe content: tech tool reviews on short-form video",
      "Approval typically fast (1-3 days)",
    ],
    category: "affiliate",
    urls: ["https://nordvpn.com/affiliate"],
    dependsOn: ["email"],
    fields: [
      { key: "nordvpn_status", label: "Status", type: "select", options: ["Not applied", "Applied", "Approved", "Rejected"] },
      { key: "nordvpn_ref_link", label: "Referral link", type: "url", placeholder: "" },
    ],
  },
  {
    id: "systeme",
    title: "Apply to Systeme.io affiliate",
    description: "60% lifetime recurring commission. 180-day cookie.",
    instructions: [
      "Go to systeme.io/affiliate",
      "Sign up — approval is automatic",
      "Get referral link immediately",
      "60% of every payment, forever — highest recurring rate available",
    ],
    category: "affiliate",
    urls: ["https://systeme.io/affiliate"],
    dependsOn: ["email"],
    fields: [
      { key: "systeme_status", label: "Status", type: "select", options: ["Not applied", "Applied", "Approved"] },
      { key: "systeme_ref_link", label: "Referral link", type: "url", placeholder: "" },
    ],
  },
  {
    id: "canva",
    title: "Apply to Canva affiliate via Impact",
    description: "Search 'Canva' in Impact.com marketplace. Commission varies.",
    instructions: [
      "Create Impact.com account if you don't have one",
      "Search marketplace for 'Canva'",
      "Apply to Canva's affiliate program",
      "Approval may take a few days",
    ],
    category: "affiliate",
    urls: ["https://impact.com"],
    dependsOn: ["email"],
    fields: [
      { key: "canva_status", label: "Status", type: "select", options: ["Not applied", "Applied", "Approved", "Rejected"] },
      { key: "impact_username", label: "Impact.com username", type: "text", placeholder: "" },
    ],
  },
  {
    id: "linktree",
    title: "Set up link tree",
    description: "Beacons.ai or Linktree free tier. Organize affiliate links by category.",
    instructions: [
      "Sign up at beacons.ai or linktr.ee (free tier)",
      "Create sections: 'Tools I Recommend', 'Today's Gadget', 'Free Resources'",
      "Add affiliate links as they get approved",
      "Set as bio link on TikTok, YouTube, Instagram",
      "Use UTM parameters on links for tracking: ?ref=tiktok, ?ref=youtube",
    ],
    category: "affiliate",
    urls: ["https://beacons.ai", "https://linktr.ee"],
    dependsOn: ["tiktok-shop", "amazon"],
    fields: [
      { key: "linktree_provider", label: "Provider", type: "select", options: ["Beacons.ai", "Linktree", "Other"] },
      { key: "linktree_url", label: "Link tree URL", type: "url", placeholder: "https://beacons.ai/schrodingzer" },
      { key: "links_added", label: "Affiliate links added", type: "text", placeholder: "0" },
    ],
  },
  {
    id: "first-10",
    title: "Produce first 10 shorts",
    description: "Two paths: Manual (OBS + ElevenLabs + CapCut, free) or Flik AI (all-in-one agent, $40/mo). Pick based on budget.",
    instructions: [
      "OPTION A — Manual (free):",
      "  Install OBS (free) for screen recording",
      "  Sign up ElevenLabs free tier for AI voiceover",
      "  Install CapCut (free) for editing",
      "  Per video: write script → screen record demo → generate voiceover → edit in CapCut → add captions",
      "",
      "OPTION B — Flik AI ($40/mo Pro, 7-day free trial with 400 credits):",
      "  Sign up at flik.ai — describe video in plain English",
      "  Agent picks best model per shot (Veo 3.1, Kling 3.0 Pro, Seedance 2.0, etc.)",
      "  Generates video + voiceover (ElevenLabs 3.0) + music (Suno 5.5) in one workspace",
      "  Iterate until result matches intent — no manual editing needed",
      "  Commercial use permitted on paid plans",
      "",
      "BOTH OPTIONS:",
      "Pick 10 AI tools to review (scan Product Hunt, HN, TikTok trending)",
      "Target: 15-60 seconds each, hook in first 3 seconds",
      "TITLE FORMULA: [Number] [Adjective] [Topic] [Enforcement]",
      "Example: '7 Free AI Tools You Must Try Before They Go Paid'",
      "Always use second person (you/your) in enforcement — '...you must see' not '...that exist'",
      "Steal like an artist: find viral video → break down title → apply formula to your topic",
    ],
    category: "content",
    dependsOn: ["tiktok", "youtube", "linktree"],
    fields: [
      { key: "video_title", label: "Generate a video title", type: "text", placeholder: "7 Free AI Tools You Must Try Before They Go Paid", generatable: true, generatePrompt: "Generate a viral YouTube Shorts / TikTok title for @zrodinger, a faceless tech/AI tools channel. Use this EXACT formula: [Number] [Adjective] [Topic] [Enforcement]. The enforcement MUST use second person (you/your) — e.g. 'you must see', 'you won't believe', 'you need to try'. Topic should be tech, AI tools, gadgets, or free software. Make it clickable and curiosity-driven. One title only, no quotes." },
      { key: "video_script", label: "Generate a video script", type: "note", placeholder: "", generatable: true, generatePrompt: "Write a 30-45 second video script for @zrodinger, a faceless tech/AI tools review channel. Format: Hook (0-3s, attention-grabbing question or statement using 'you'), Demo (show the tool/gadget in action, 3-5 key points), CTA (3s, 'link in bio' or 'follow for more'). Keep it punchy, no filler. Use second person throughout. Conversational tone, not corporate." },
      { key: "videos_produced", label: "Videos produced", type: "text", placeholder: "0 / 10" },
      { key: "tools_reviewed", label: "Tools reviewed (comma-separated)", type: "text", placeholder: "Notion, CapCut, Canva..." },
      { key: "avg_time_per_video", label: "Avg time per video (minutes)", type: "text", placeholder: "40" },
      { key: "notes", label: "Notes (what's working, what's not)", type: "note", placeholder: "" },
    ],
  },
  {
    id: "daily-30",
    title: "Post daily for 30 days",
    description: "2-3 TikToks/day, 1-2 YouTube Shorts/day, 1 Instagram Reel/day. No automation until complete.",
    instructions: [
      "Post schedule: 7am, 12pm, 7pm EST (TikTok). 9am, 5pm (YouTube). 11am (Instagram).",
      "Cross-post best performers from TikTok to other platforms",
      "Track daily: views, likes, comments, shares, affiliate clicks",
      "Note which hooks and formats get most engagement",
      "Do NOT automate anything during this phase — learn the craft manually",
      "Day 30: compile data for evaluation",
    ],
    category: "content",
    dependsOn: ["first-10"],
    fields: [
      { key: "start_date", label: "Start date", type: "text", placeholder: "2026-05-20" },
      { key: "current_day", label: "Current day", type: "text", placeholder: "0 / 30" },
      { key: "total_views", label: "Total views (all platforms)", type: "text", placeholder: "0" },
      { key: "total_affiliate_clicks", label: "Total affiliate clicks", type: "text", placeholder: "0" },
      { key: "total_revenue", label: "Total revenue so far", type: "text", placeholder: "$0" },
      { key: "best_performing_video", label: "Best performing video", type: "text", placeholder: "" },
      { key: "notes", label: "Observations", type: "note", placeholder: "" },
    ],
  },
  {
    id: "evaluate",
    title: "30-day evaluation",
    description: "Review all data. Decide: scale, pivot vertical, or add second vertical.",
    instructions: [
      "Compile: total views, RPM, affiliate revenue, time invested",
      "Calculate: revenue per hour of work",
      "Identify: top 3 performing videos — what do they have in common?",
      "Identify: which affiliate links convert best?",
      "Decision matrix: scale this vertical, pivot to different niche, or add second vertical",
      "If monthly cloud spend >$30: evaluate GPU upgrade ROI",
    ],
    category: "tracking",
    dependsOn: ["daily-30"],
    fields: [
      { key: "total_views_30d", label: "Total views (30 days)", type: "text", placeholder: "" },
      { key: "total_revenue_30d", label: "Total revenue (30 days)", type: "text", placeholder: "$0" },
      { key: "hours_invested", label: "Hours invested", type: "text", placeholder: "" },
      { key: "revenue_per_hour", label: "Revenue per hour", type: "text", placeholder: "$0" },
      { key: "top_format", label: "Best performing format", type: "text", placeholder: "" },
      { key: "top_affiliate", label: "Best converting affiliate", type: "text", placeholder: "" },
      { key: "decision", label: "Decision", type: "select", options: ["Scale this vertical", "Pivot to different niche", "Add second vertical", "Pause and reassess"] },
      { key: "notes", label: "Notes", type: "note", placeholder: "" },
    ],
  },
];

const SIGNAL_STEPS: LaunchStep[] = [
  {
    id: "email",
    title: "Create brand email",
    description: "Dedicated email for Signal brand.",
    instructions: ["Create [brandname]@abundenz.com via Cloudflare Email Routing"],
    category: "brand",
    fields: [
      { key: "email", label: "Brand email", type: "email", placeholder: "socratez@abundenz.com" },
    ],
  },
  {
    id: "brand-name",
    title: "Select brand name",
    description: "Pick from Philosophers category. Apply z-rule.",
    instructions: ["Open vault/shared/brand-naming.md", "Pick from Philosophers category"],
    category: "brand",
    fields: [
      { key: "brand_name", label: "Brand name", type: "text", placeholder: "" },
      { key: "handle", label: "Handle", type: "text", placeholder: "" },
      { key: "platform_handles", label: "Platform handles", type: "platform-handles" as const, defaultPlatforms: ["YouTube", "Podcast", "Substack", "X / Twitter", "LinkedIn", "Instagram", "Blog", "Newsletter"] },
    ],
  },
  {
    id: "domain",
    title: "Register domain",
    description: "Brand domain for blog/newsletter.",
    instructions: ["Register via Cloudflare Registrar"],
    category: "brand",
    dependsOn: ["brand-name"],
    fields: [
      { key: "domain", label: "Domain", type: "url", placeholder: "" },
    ],
  },
  {
    id: "youtube",
    title: "Create YouTube channel",
    description: "Long-form + Shorts. Real voice, real expertise.",
    instructions: ["Sign in with brand email", "Create channel", "Set custom handle"],
    category: "accounts",
    dependsOn: ["email", "brand-name"],
    fields: [
      { key: "youtube_handle", label: "YouTube handle", type: "text", placeholder: "" },
    ],
  },
  {
    id: "newsletter",
    title: "Set up newsletter (beehiiv)",
    description: "Free tier up to 2500 subs. Connect to domain.",
    instructions: ["Sign up at beehiiv.com with brand email", "Connect custom domain"],
    category: "accounts",
    urls: ["https://beehiiv.com"],
    dependsOn: ["email", "domain"],
    fields: [
      { key: "newsletter_url", label: "Newsletter URL", type: "url", placeholder: "" },
    ],
  },
  {
    id: "blog",
    title: "Set up blog (Ghost)",
    description: "Clean, fast, SEO-ready. Free trial to start.",
    instructions: ["Sign up at ghost.org", "Connect custom domain"],
    category: "accounts",
    urls: ["https://ghost.org"],
    dependsOn: ["domain"],
    fields: [
      { key: "blog_url", label: "Blog URL", type: "url", placeholder: "" },
    ],
  },
  {
    id: "socials",
    title: "Register social handles",
    description: "X, LinkedIn, Instagram, TikTok — all under brand name.",
    instructions: ["Register handle on each platform"],
    category: "accounts",
    dependsOn: ["brand-name"],
    fields: [
      { key: "x_handle", label: "X handle", type: "text", placeholder: "" },
      { key: "linkedin_handle", label: "LinkedIn", type: "text", placeholder: "" },
      { key: "instagram_handle", label: "Instagram", type: "text", placeholder: "" },
      { key: "tiktok_handle", label: "TikTok", type: "text", placeholder: "" },
    ],
  },
  {
    id: "first-pillar",
    title: "Record first pillar episode",
    description: "Audio-only is fine. Real voice. Deep expertise on one topic.",
    instructions: ["Pick topic", "Record with your real voice", "Aim for 10-30 minutes"],
    category: "content",
    dependsOn: ["youtube"],
    fields: [
      { key: "topic", label: "Topic", type: "text", placeholder: "" },
      { key: "duration", label: "Duration", type: "text", placeholder: "" },
    ],
  },
  {
    id: "atomize",
    title: "Atomize into 12-18 derivatives",
    description: "Shorts, newsletter excerpt, blog post, social clips, Pinterest pins.",
    instructions: ["Use content-atomizer skill", "Create derivatives from pillar"],
    category: "content",
    dependsOn: ["first-pillar"],
    fields: [
      { key: "derivatives_count", label: "Derivatives created", type: "text", placeholder: "0" },
    ],
  },
  {
    id: "daily-30",
    title: "Publish daily for 30 days",
    description: "1 pillar/week + daily derivatives. Track audience growth.",
    instructions: ["Post daily", "Track engagement"],
    category: "content",
    dependsOn: ["atomize"],
    fields: [
      { key: "current_day", label: "Day", type: "text", placeholder: "0 / 30" },
    ],
  },
  {
    id: "evaluate",
    title: "30-day evaluation",
    description: "Review audience growth, engagement, topic resonance.",
    instructions: ["Compile data", "Decide monetization path"],
    category: "tracking",
    dependsOn: ["daily-30"],
    fields: [
      { key: "subscribers", label: "Total subscribers", type: "text", placeholder: "" },
      { key: "decision", label: "Decision", type: "select", options: ["Scale", "Pivot", "Add vertical", "Pause"] },
    ],
  },
];

const ATELIER_STEPS: LaunchStep[] = [
  { id: "email", title: "Create brand email", description: "Dedicated email for Atelier brand.", instructions: ["Create [color]@abundenz.com"], category: "brand", fields: [{ key: "email", label: "Email", type: "email", placeholder: "" }] },
  { id: "brand-name", title: "Select brand name", description: "Pick from Colors category.", instructions: ["Pick from Pantone/Crayola pool"], category: "brand", fields: [{ key: "brand_name", label: "Brand name", type: "text", placeholder: "" }, { key: "platform_handles", label: "Platform handles", type: "platform-handles" as const, defaultPlatforms: ["Instagram", "Pinterest", "TikTok", "YouTube", "Blog", "X / Twitter", "Etsy", "Newsletter"] }] },
  { id: "etsy", title: "Set up Etsy storefront", description: "Digital downloads first.", instructions: ["Sign up at etsy.com/sell"], category: "accounts", urls: ["https://www.etsy.com/sell"], dependsOn: ["email", "brand-name"], fields: [{ key: "etsy_url", label: "Shop URL", type: "url", placeholder: "" }] },
  { id: "gumroad", title: "Set up Gumroad", description: "Free + 10% fee.", instructions: ["Sign up at gumroad.com"], category: "accounts", urls: ["https://gumroad.com"], dependsOn: ["email"], fields: [{ key: "gumroad_url", label: "Gumroad URL", type: "url", placeholder: "" }] },
  { id: "first-product", title: "Create and list first product", description: "AI-generated digital product.", instructions: ["Create product", "List on Etsy + Gumroad"], category: "content", dependsOn: ["etsy", "gumroad"], fields: [{ key: "product_name", label: "Product", type: "text", placeholder: "" }] },
  { id: "daily-30", title: "List daily for 30 days", description: "1 new product/day.", instructions: ["Create and list daily"], category: "content", dependsOn: ["first-product"], fields: [{ key: "products_listed", label: "Products listed", type: "text", placeholder: "0 / 30" }] },
  { id: "evaluate", title: "30-day evaluation", description: "Review sales data.", instructions: ["Compile data", "Scale winners"], category: "tracking", dependsOn: ["daily-30"], fields: [{ key: "total_sales", label: "Total sales", type: "text", placeholder: "$0" }, { key: "decision", label: "Decision", type: "select", options: ["Scale", "Pivot", "Pause"] }] },
];

const CONDUIT_STEPS: LaunchStep[] = [
  { id: "email", title: "Create brand email", description: "Dedicated email for Conduit brand.", instructions: ["Create [cartography]@abundenz.com"], category: "brand", fields: [{ key: "email", label: "Email", type: "email", placeholder: "" }] },
  { id: "brand-name", title: "Select brand name", description: "Pick from Cartography category.", instructions: ["Pick from Cartography pool"], category: "brand", fields: [{ key: "brand_name", label: "Brand name", type: "text", placeholder: "" }, { key: "platform_handles", label: "Platform handles", type: "platform-handles" as const, defaultPlatforms: ["Blog", "YouTube", "Instagram", "X / Twitter", "Pinterest", "Newsletter", "Reddit", "TikTok"] }] },
  { id: "domain", title: "Register domain", description: "SEO-focused domain.", instructions: ["Register via Cloudflare"], category: "brand", dependsOn: ["brand-name"], fields: [{ key: "domain", label: "Domain", type: "url", placeholder: "" }] },
  { id: "blog", title: "Set up blog", description: "Ghost or WordPress. SEO-optimized.", instructions: ["Set up and connect domain"], category: "accounts", dependsOn: ["domain"], fields: [{ key: "blog_url", label: "Blog URL", type: "url", placeholder: "" }] },
  { id: "affiliate-programs", title: "Apply to affiliate programs", description: "Amazon + SaaS programs.", instructions: ["Apply to relevant programs"], category: "affiliate", dependsOn: ["email"], fields: [{ key: "programs_applied", label: "Programs applied", type: "text", placeholder: "0" }] },
  { id: "first-article", title: "Publish first article", description: "SEO-optimized review. 1500+ words.", instructions: ["Write, optimize, publish"], category: "content", dependsOn: ["blog", "affiliate-programs"], fields: [{ key: "article_url", label: "Article URL", type: "url", placeholder: "" }] },
  { id: "daily-30", title: "Publish 30 articles", description: "1 article/day.", instructions: ["Write and publish daily"], category: "content", dependsOn: ["first-article"], fields: [{ key: "articles_published", label: "Articles", type: "text", placeholder: "0 / 30" }] },
  { id: "evaluate", title: "30-day evaluation", description: "Review traffic and conversions.", instructions: ["Compile data"], category: "tracking", dependsOn: ["daily-30"], fields: [{ key: "organic_traffic", label: "Organic traffic", type: "text", placeholder: "" }, { key: "decision", label: "Decision", type: "select", options: ["Scale", "Pivot", "Pause"] }] },
];

/*
 * Lullaby demoted to vertical under Surge. Steps kept for future use as vertical-specific launch checklist.
 *
 * const LULLABY_STEPS: LaunchStep[] = [
 *   { id: "safeguards", title: "Complete safeguards review", ... },
 *   { id: "brand-name", title: "Select brand name", ... },
 *   { id: "format", title: "Design content format", ... },
 *   { id: "recording", title: "Set up recording", ... },
 *   { id: "pilot", title: "Record pilot episode", ... },
 *   { id: "evaluate", title: "Pilot evaluation", ... },
 * ];
 */

const FORGE_STEPS: LaunchStep[] = [
  { id: "concept", title: "Define app concept", description: "Core idea, target audience, platform targets (Windows, iOS, Android).", instructions: [
    "Write one-sentence app description",
    "Identify target user and pain point",
    "Choose platforms: Windows / iOS / Android / all",
    "Decide monetization: freemium, one-time, subscription",
    "Check app stores for existing competition",
  ], category: "brand", fields: [
    { key: "app_name", label: "App name (z-rule)", type: "text", placeholder: "Dinnerz" },
    { key: "one_liner", label: "One-line description", type: "text", placeholder: "Speak directly through your kids' headphones" },
    { key: "platforms", label: "Target platforms", type: "text", placeholder: "Windows, iOS, Android" },
    { key: "monetization", label: "Monetization model", type: "select", options: ["Freemium", "One-time purchase", "Subscription", "Ads + premium"] },
    { key: "platform_handles", label: "Platform handles", type: "platform-handles" as const, defaultPlatforms: ["Product Hunt", "TikTok", "YouTube", "X / Twitter", "Reddit", "Instagram", "Blog", "Newsletter"] },
  ] },
  { id: "tech-stack", title: "Choose tech stack", description: "Cross-platform framework for multi-OS deployment.", instructions: [
    "React Native (mobile) or Electron (desktop) or Tauri (desktop, lighter)",
    "Flutter for true cross-platform (mobile + desktop)",
    "For audio/mic features: check platform-specific APIs",
    "Consider Expo for fastest React Native start",
  ], category: "brand", dependsOn: ["concept"], fields: [
    { key: "framework", label: "Framework", type: "select", options: ["React Native + Expo", "Flutter", "Electron", "Tauri", "Native per platform", "Other"] },
    { key: "tech_notes", label: "Tech notes", type: "note", placeholder: "" },
  ] },
  { id: "mvp", title: "Build MVP", description: "Minimum viable product — core feature only, one platform.", instructions: [
    "Pick ONE platform for MVP (easiest to test)",
    "Build core feature only — no polish, no extras",
    "Test with family/friends",
    "Target: working prototype in 2-4 weeks",
  ], category: "content", dependsOn: ["tech-stack"], fields: [
    { key: "mvp_platform", label: "MVP platform", type: "select", options: ["iOS", "Android", "Windows", "Web"] },
    { key: "mvp_status", label: "Status", type: "select", options: ["Not started", "In progress", "Testing", "Ready"] },
  ] },
  { id: "store-setup", title: "Set up app store accounts", description: "Developer accounts for publishing.", instructions: [
    "Apple Developer Program ($99/year) — required for iOS",
    "Google Play Console ($25 one-time) — required for Android",
    "Microsoft Store ($19 one-time) — for Windows",
    "Use VFXellence Ltd as publisher name",
  ], category: "accounts", dependsOn: ["concept"], fields: [
    { key: "apple_dev", label: "Apple Developer status", type: "select", options: ["Not started", "Applied", "Active"] },
    { key: "google_play", label: "Google Play status", type: "select", options: ["Not started", "Applied", "Active"] },
    { key: "ms_store", label: "Microsoft Store status", type: "select", options: ["Not started", "Applied", "Active"] },
  ] },
  { id: "launch", title: "Launch on stores", description: "Publish MVP, gather feedback, iterate.", instructions: [
    "Write store listing (screenshots, description, keywords)",
    "Set pricing / freemium gate",
    "Submit for review",
    "Plan launch marketing (TikTok, Product Hunt)",
  ], category: "content", dependsOn: ["mvp", "store-setup"], fields: [
    { key: "launch_date", label: "Launch date", type: "text", placeholder: "" },
    { key: "downloads_week1", label: "Downloads (week 1)", type: "text", placeholder: "0" },
  ] },
  { id: "evaluate", title: "30-day evaluation", description: "Downloads, retention, revenue, reviews.", instructions: [
    "Track: downloads, DAU, retention, revenue, reviews",
    "Decide: iterate, pivot, or build next app",
  ], category: "tracking", dependsOn: ["launch"], fields: [
    { key: "total_downloads", label: "Total downloads", type: "text", placeholder: "" },
    { key: "revenue_30d", label: "Revenue (30 days)", type: "text", placeholder: "$0" },
    { key: "avg_rating", label: "Avg rating", type: "text", placeholder: "" },
    { key: "decision", label: "Decision", type: "select", options: ["Iterate this app", "Build next app", "Pivot concept", "Pause"] },
  ] },
];

export const LAUNCH_TEMPLATES: Record<EcosystemId, LaunchStep[]> = {
  viral: SURGE_STEPS,
  content: SIGNAL_STEPS,
  products: ATELIER_STEPS,
  affiliate: CONDUIT_STEPS,
  apps: FORGE_STEPS,
};

export const CATEGORY_LABELS: Record<LaunchStep["category"], string> = {
  brand: "Brand Setup",
  accounts: "Accounts",
  affiliate: "Affiliate Programs",
  content: "Content Production",
  tracking: "Evaluation",
};

export const CATEGORY_COLORS: Record<LaunchStep["category"], string> = {
  brand: "text-purple-400",
  accounts: "text-blue-400",
  affiliate: "text-emerald-400",
  content: "text-orange-400",
  tracking: "text-pink-400",
};
