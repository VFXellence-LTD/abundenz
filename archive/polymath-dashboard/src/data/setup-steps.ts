import type { SetupStep } from "@/types";

export const SETUP_STEPS: SetupStep[] = [
  {
    id: "domain",
    ecosystemId: "content",
    order: 1,
    title: "Register Domain",
    description: "Secure the brand domain for your content empire.",
    instructions:
      "Pick a name that reflects pipeline engineering / VFX tooling — something you can own long-term. Register on Cloudflare Registrar (best pricing, no markup). Point DNS to your Ghost blog once it's live.",
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
      "Create a Brand Account on YouTube (separate from personal Google). Use the channel description below verbatim — it's keyword-optimized for pipeline engineering searches. Upload a minimal channel art (1280×720 minimum) and set a consistent profile icon.",
    copyBlocks: [
      {
        label: "Channel Description",
        content:
          "Practical VFX pipeline engineering for studios that ship real frames. Python tooling, Ayon/ShotGrid workflows, cross-DCC integration, and studio automation — from a working Pipeline TD.\n\nNew videos weekly. Subscribe for pipeline tips that actually work in production.",
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
          "Pipeline engineering insights delivered weekly. Tool reviews, workflow breakdowns, and the stuff they don't teach in tutorials — straight from production.\n\nFree. No spam. Unsubscribe anytime.",
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
          "Pipeline TD | VFX tools & automation | Python, Ayon, Maya, Houdini, Nuke | Building the tools artists actually use",
      },
      {
        label: "X / Twitter Bio",
        content:
          "Pipeline TD building VFX tools that ship frames. Python, Ayon, cross-DCC automation. Opinions are production-tested.",
      },
      {
        label: "LinkedIn Headline",
        content:
          "Pipeline Engineer | VFX Automation & Tooling | Building infrastructure for studios that ship",
      },
      {
        label: "Instagram / TikTok Bio",
        content:
          "Pipeline TD | VFX tools that ship frames 🎬 | Python, Ayon, Maya, Houdini | Tips for studio automation",
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
      "Pick a topic you can talk about for 10–20 minutes without a script. Good options: 'Why your studio needs a Pipeline TD', 'Ayon in 10 minutes', 'The Maya rig that broke our pipeline'. Record audio-first — use OBS or Riverside. Don't wait for perfect gear. Ship it.",
    copyBlocks: [
      {
        label: "Episode Title Formula",
        content:
          "[Result] with [Tool/Technique] — [Specific Context]\n\nExamples:\n• 'Automated Render Submission with Deadline — No More Babysitting'\n• 'Build a Maya Asset Manager in 30 Minutes with Python'\n• 'Why We Switched from ShotGrid to Ayon (and What Broke)'",
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
      "Agent 01 watches Reddit (r/vfx, r/pipeline, r/houdini, r/maya), Hacker News, and industry job boards for emerging topics, tool announcements, and pain points. Weekly digest → content ideas. Build with n8n (self-host) or Make.com. Output to a Notion table or Google Sheet you review each Monday.",
    copyBlocks: [
      {
        label: "Agent 01 System Prompt",
        content:
          "You are a VFX pipeline content scout. Review the following sources and identify: (1) emerging tools or workflows being discussed, (2) common pain points studios are posting about, (3) job listings mentioning new tech requirements. Output a ranked list of 5 content ideas with: title, angle, why it's timely, estimated search demand (high/med/low). Be specific. No fluff.",
      },
    ],
    externalLinks: [
      { label: "n8n.io", url: "https://n8n.io" },
      { label: "Make.com", url: "https://www.make.com" },
    ],
  },
];
