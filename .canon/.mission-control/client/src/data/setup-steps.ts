import type { SetupStep } from "@/types";

export const SETUP_STEPS: SetupStep[] = [
  {
    id: "domain",
    ecosystemId: "content",
    order: 1,
    title: "Register Domain",
    description: "Secure the brand domain for your content empire.",
    instructions:
      "Pick a name that reflects your brand and niche — short, memorable, something you can own long-term. Register on Cloudflare Registrar (best pricing, no markup). Point DNS to your Ghost blog once it's live.",
    copyBlocks: [],
    externalLinks: [
      { label: "Cloudflare Registrar", url: "https://www.cloudflare.com/products/registrar/" },
      { label: "Namecheap", url: "https://www.namecheap.com" },
    ],
  },
  {
    id: "email",
    ecosystemId: "content",
    order: 2,
    title: "Create Brand Email",
    description: "Set up a professional email address on your domain.",
    instructions:
      "Use Cloudflare Email Routing (free) to forward brand@yourdomain.com → your existing Gmail, or set up Google Workspace ($6/mo) for a full inbox. The forwarding option is fine for Phase 0.",
    copyBlocks: [],
    externalLinks: [
      { label: "Cloudflare Email Routing", url: "https://developers.cloudflare.com/email-routing/" },
      { label: "Google Workspace", url: "https://workspace.google.com" },
    ],
  },
  {
    id: "youtube",
    ecosystemId: "content",
    order: 3,
    title: "Create YouTube Channel",
    description: "Stand up the primary video distribution channel.",
    instructions:
      "Create a Brand Account on YouTube (separate from personal Google). Use the channel description below verbatim — it's keyword-optimized for your niche's search terms. Upload a minimal channel art (1280×720 minimum) and set a consistent profile icon.",
    copyBlocks: [
      {
        label: "Channel Description",
        content:
          "[What you cover] for [your audience]. [Your format/angle] — [your credibility or unique perspective].",
      },
    ],
    externalLinks: [
      { label: "YouTube Studio", url: "https://studio.youtube.com" },
      { label: "Create Brand Account", url: "https://www.youtube.com/account_advanced" },
    ],
  },
  {
    id: "beehiiv",
    ecosystemId: "content",
    order: 4,
    title: "Set Up beehiiv Newsletter",
    description: "Launch the email list — your most valuable owned asset.",
    instructions:
      "beehiiv free tier supports up to 2,500 subscribers. Create publication, set custom domain once DNS is live. Use the signup page copy below for your landing page. Enable the referral program from day one — it compounds early subscriber counts.",
    copyBlocks: [
      {
        label: "Newsletter Signup Page Copy",
        content:
          "[Your niche] insights delivered weekly. [What subscribers get] — [your angle].\n\nFree. No spam. Unsubscribe anytime.",
      },
    ],
    externalLinks: [
      { label: "beehiiv", url: "https://www.beehiiv.com" },
    ],
  },
  {
    id: "ghost",
    ecosystemId: "content",
    order: 5,
    title: "Set Up Ghost Blog",
    description: "Long-form content home base — doubles as SEO engine.",
    instructions:
      "Ghost Starter is free for up to 500 members. Self-host on Railway or Render if you want $0/mo. Connect custom domain. Every YouTube video should have a companion Ghost post — the blog builds organic search traffic that YouTube can't.",
    copyBlocks: [],
    externalLinks: [
      { label: "Ghost.org", url: "https://ghost.org" },
      { label: "Ghost on Railway", url: "https://railway.app/template/ghost" },
    ],
  },
  {
    id: "socials",
    ecosystemId: "content",
    order: 6,
    title: "Register Social Handles",
    description: "Claim consistent handles across all major platforms.",
    instructions:
      "Register the same handle on X, LinkedIn, Instagram, and TikTok before anyone else grabs it. Use the bio templates below — they're adapted per-platform but maintain a consistent voice. Don't post yet — just claim and configure profiles.",
    copyBlocks: [
      {
        label: "Universal Bio (YouTube, Ghost, beehiiv)",
        content:
          "[Your role/identity] | [What you create] | [Your tools/topics] | [Your hook]",
      },
      {
        label: "X / Twitter Bio",
        content:
          "[Your role/identity] | [What you create] | [Your tools/topics] | [Your hook]",
      },
      {
        label: "LinkedIn Headline",
        content:
          "[Your role/identity] | [What you create] | [Your tools/topics] | [Your hook]",
      },
      {
        label: "Instagram / TikTok Bio",
        content:
          "[Your role/identity] | [What you create] | [Your tools/topics] | [Your hook]",
      },
    ],
    externalLinks: [
      { label: "X.com", url: "https://x.com" },
      { label: "LinkedIn", url: "https://linkedin.com" },
      { label: "Instagram", url: "https://instagram.com" },
      { label: "TikTok", url: "https://tiktok.com" },
    ],
  },
  {
    id: "first_episode",
    ecosystemId: "content",
    order: 7,
    title: "Record First Pillar Episode",
    description: "Get reps in. Audio quality matters more than visuals early on.",
    instructions:
      "Pick a topic you can talk about for 10–20 minutes without a script. Good options: an intro to your niche, a 'how I got started', or a breakdown of a tool/method you use. Record audio-first — use OBS or Riverside. Don't wait for perfect gear. Ship it.",
    copyBlocks: [
      {
        label: "Episode Title Formula",
        content:
          "[Result] with [Tool/Technique] — [Specific Context]\n\nExamples:\n• '[Task] in [Time] — No More [Old Pain]'\n• 'Build a [Thing] in 30 Minutes with [Tool]'\n• 'Why I Switched from [Old Way] to [New Way] (and What I Learned)'",
      },
    ],
    externalLinks: [
      { label: "OBS Studio", url: "https://obsproject.com" },
      { label: "Riverside.fm", url: "https://riverside.fm" },
    ],
  },
  {
    id: "agent_01",
    ecosystemId: "content",
    order: 8,
    title: "Build Agent 01 — Trend Scout",
    description: "Automate content ideation with an AI trend monitor.",
    instructions:
      "Agent 01 watches the subreddits, forums, news sources, and job boards relevant to your niche (configured per vertical), plus Hacker News, for emerging topics, tool announcements, and pain points. Weekly digest → content ideas. Build with n8n (self-host) or Make.com. Output to a Notion table or Google Sheet you review each Monday.",
    copyBlocks: [
      {
        label: "Agent 01 System Prompt",
        content:
          "You are a content scout for the operator's niche. Review the following sources and identify: (1) emerging tools or topics being discussed, (2) common pain points your audience is posting about, (3) job listings mentioning new tech requirements. Output a ranked list of 5 content ideas with: title, angle, why it's timely, estimated search demand (high/med/low). Be specific. No fluff.",
      },
    ],
    externalLinks: [
      { label: "n8n.io", url: "https://n8n.io" },
      { label: "Make.com", url: "https://www.make.com" },
    ],
  },
];
