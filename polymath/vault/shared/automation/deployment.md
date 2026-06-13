# Polymath Automation Deployment

How to stand up the automation stack. Three deployment options in order of complexity and cost.

---

## Option A: Local Machine + Make.com (Simplest)

**Setup time:** 2-4 hours
**Monthly cost:** $9-29 (Make.com Core or Pro)
**Reliability:** Dependent on local machine being on and internet connected
**Maintenance:** Low
**When to use:** Starting out; single ecosystem; owner comfortable leaving machine running

### What runs locally
- Claude Code agents (when running in Claude Code)
- Real-ESRGAN upscaling (GPU required for speed; CPU works but slow)
- ImageMagick format conversion
- Whisper transcription (if using local)

### What runs in Make.com
- Scheduled triggers (cron-like; Make.com is always-on)
- API calls (Etsy API, Gumroad API, Pinterest API)
- Data routing between tools
- Notification delivery (email, Slack)

### Setup steps

1. **Create Make.com account** — make.com; start on Core ($9/month; 10k operations)

2. **Install local tools:**
   ```bash
   # Python 3.11+
   pip install anthropic requests pillow
   
   # Real-ESRGAN (Windows)
   # Download binary from: https://github.com/xinntao/Real-ESRGAN/releases
   # Add to PATH
   
   # ImageMagick
   # Windows: download installer from imagemagick.org
   ```

3. **Configure environment variables:**
   ```bash
   ANTHROPIC_API_KEY=sk-ant-...
   ETSY_API_KEY=...
   ETSY_SHOP_ID=...
   GUMROAD_ACCESS_TOKEN=...
   PRINTFUL_API_KEY=...
   MIDJOURNEY_ACCOUNT=... (or fal.ai key for Flux)
   IDEOGRAM_API_KEY=...
   ```

4. **Create Make.com scenarios** for each agent trigger:
   - Weekly niche research trigger → webhook → local Claude script
   - Daily quick scan trigger
   - Analytics sync trigger (daily)
   - Report delivery (weekly, Monday 07:00)

5. **Local agent scripts** (Python or Claude Code subagents):
   - Each agent defined as a Python script or Claude Code skill
   - Make.com triggers script via webhook on local machine (use ngrok for webhook exposure, or poll model)
   - Alternatively: Make.com does the API calls directly; local machine only for image processing

### Limitations of Option A
- Machine must be running at trigger time — if asleep, job missed
- No job queue — if machine is busy, trigger is missed
- Not suitable for >3 ecosystems or daily high-volume Atelier/Surge production
- Webhook exposure via ngrok is fragile (session expires; needs management)

---

## Option B: VPS + n8n Self-Hosted + Cron Jobs (Most Control)

**Setup time:** 4-8 hours
**Monthly cost:** $5-15 VPS + $0 (n8n is free self-hosted) + image generation APIs
**Reliability:** High (VPS is always-on; n8n has retry logic)
**Maintenance:** Medium (updates, monitoring, disk space)
**When to use:** Running 2+ ecosystems; need reliable always-on automation; comfortable with basic Linux/VPS management

### Architecture

```
[VPS: Hetzner CX22 or DigitalOcean Droplet $6-8/month]
├── n8n (self-hosted, Docker)          ← orchestration
├── Python scripts                     ← agent logic
├── Claude API calls                   ← via script or n8n HTTP nodes
└── cron jobs                          ← fallback scheduling
```

### VPS Recommendation
- Hetzner CX22: 2 vCPU, 4GB RAM, 40GB disk — €4.35/month (EU) or ~$5-6/month
- DigitalOcean Basic: 1 vCPU, 2GB RAM — $12/month (more expensive; better support)
- Hetzner recommended for cost; DigitalOcean for ease of setup

**Note:** Real-ESRGAN GPU upscaling cannot run on cheap VPS (no GPU). For upscaling on Option B:
- Use Replicate API (~$0.01-0.05/image) — add to tool costs
- Or run upscaling locally on owner's machine as a separate step (defeats some automation)
- Or use Upscayl local on owner's machine in a batch session

### Setup steps

1. **Provision VPS:**
   ```bash
   # Hetzner: create CX22 Ubuntu 22.04
   # Add SSH key, note IP address
   ssh root@<VPS_IP>
   ```

2. **Install Docker and n8n:**
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com | sh
   
   # Install n8n via Docker
   docker run -d --name n8n \
     -p 5678:5678 \
     -e N8N_HOST=<your-domain-or-ip> \
     -e N8N_PROTOCOL=https \
     -e NODE_ENV=production \
     -v n8n_data:/home/node/.n8n \
     n8nio/n8n
   ```

3. **Set up reverse proxy (nginx + SSL):**
   ```bash
   apt install nginx certbot python3-certbot-nginx
   # Configure nginx to proxy :80/:443 → :5678
   # Get SSL cert: certbot --nginx -d n8n.yourdomain.com
   ```

4. **Install Python environment:**
   ```bash
   apt install python3-pip
   pip3 install anthropic requests pillow boto3
   ```

5. **Clone agent scripts to VPS:**
   ```bash
   # Create /opt/polymath/ directory
   mkdir -p /opt/polymath/agents
   # Upload scripts via scp or git
   ```

6. **Configure n8n workflows** (same logic as Make.com but in n8n):
   - Cron trigger nodes (no operation limits)
   - HTTP Request nodes for API calls
   - Execute Command nodes for Python scripts
   - Email/Slack notification nodes

7. **Configure environment:**
   ```bash
   # /opt/polymath/.env
   ANTHROPIC_API_KEY=sk-ant-...
   ETSY_API_KEY=...
   REPLICATE_API_TOKEN=...
   # etc.
   ```

8. **Set up monitoring:**
   - n8n has built-in execution history and error notifications
   - Add UptimeRobot (free) to monitor n8n availability
   - Add disk space alert (VPS disk fills if logs aren't rotated)

### Cost breakdown for Option B
| Item | Monthly cost |
|------|-------------|
| Hetzner CX22 VPS | ~$6 |
| n8n (self-hosted) | Free |
| Domain (optional) | ~$1 |
| Replicate API (upscaling) | ~$5-15 depending on volume |
| **Infra total** | **~$12-22** |

---

## Option C: Claude Code Agents + Claude Dispatch (Most Integrated)

**Setup time:** 1-2 hours (if already using Claude Code)
**Monthly cost:** Higher API costs (~$50-150/month depending on agent complexity and frequency)
**Reliability:** High (Claude infrastructure)
**Maintenance:** Low (managed by Anthropic)
**When to use:** Heavy Claude Code user; want agents orchestrated within Claude ecosystem; okay with higher API cost

### Architecture

```
[Claude Dispatch / scheduled subagents]
├── Niche Researcher agent    ← Claude Code subagent, weekly trigger
├── Design Generator agent    ← Trigger + external API calls (Midjourney, Flux)
├── Listing Optimizer agent   ← Claude API heavy (copy generation)
├── Publisher agent           ← Marketplace API calls
└── Analytics agent           ← Data pull + Claude synthesis
```

### Claude Dispatch integration

Claude Code supports scheduled agents via the `/schedule` skill. Each Atelier agent can be defined as a scheduled routine:

```
/schedule weekly Sunday 2am UTC
  Run niche-researcher agent:
  - Pull Etsy bestseller data (HTTP)
  - Pull KDP BSR data (HTTP)
  - Run niche analysis with Claude
  - Save output to shared storage
  - Trigger design-generator if score ≥ 22
```

### MCP server setup for tool integrations

Claude Code agents access external tools via MCP servers:

```json
// .claude/settings.json (in Polymath workspace)
{
  "mcpServers": {
    "etsy": {
      "command": "npx",
      "args": ["@mcp/etsy-server"],
      "env": {"ETSY_API_KEY": "..."}
    },
    "printful": {
      "command": "npx",
      "args": ["@mcp/printful-server"],
      "env": {"PRINTFUL_API_KEY": "..."}
    }
  }
}
```

Zernio MCP for Instagram (when available):
```json
{
  "mcpServers": {
    "instagram": {
      "command": "npx",
      "args": ["@zernio/mcp-instagram"],
      "env": {"INSTAGRAM_TOKEN": "..."}
    }
  }
}
```

**Note:** MCP server availability changes rapidly. Verify each integration at activation.

### Cost considerations for Option C

Agent runs consume Claude API tokens. Cost depends on:
- Prompt length (Atelier agents use long system prompts — use prompt caching)
- Output length (analytics reports are long — budget for this)
- Frequency (weekly deep scan: ~$0.20-0.50/run; daily quick scan: ~$0.05-0.10/run)

Estimated monthly Claude API cost for full Atelier pipeline:
- Niche Researcher (4 deep + 28 quick): ~$5-15
- Listing Optimizer (50 listings/month): ~$10-25
- Analytics (4 weekly + 1 monthly): ~$5-10
- Total: ~$20-50/month Claude API alone

---

## Recommendation: Deployment Path

```
Month 1-2 (Atelier activation, single ecosystem):
  → Option A (local + Make.com)
  → Proves the system works before investing in infrastructure
  → Total infra cost: ~$9-29

Month 3-6 (Atelier running, Signal starting):
  → Migrate to Option B (VPS + n8n)
  → More reliable; add Signal automation workflows
  → Total infra cost: ~$12-22

Month 6+ (2+ ecosystems, consistent revenue):
  → Evaluate Option C for heavy Claude integration
  → Or stay on Option B with expanded n8n workflows
  → Decision based on: how much of the workflow benefits from Claude reasoning vs. simple API calls
```

---

## Shared Storage Setup

Agents pass files between each other via shared storage. Set up before running any pipeline.

**Recommended: Dropbox (free tier, 2GB)**
```
/polymath/
├── atelier/
│   ├── niche-briefs/      ← JSON files from Niche Researcher
│   ├── designs/           ← raw/ curated/ final/ directories
│   ├── listings/          ← listing packages ready for review
│   └── analytics/         ← reports and sales data
├── signal/
├── surge/
└── conduit/
```

**Alternative: AWS S3 (pay-per-use, ~$1-5/month for typical volume)**
Better for programmatic access; more appropriate for Option B/C.

---

## Monitoring and Alerting

Regardless of deployment option, set up:

1. **Failure alerts:** n8n sends email on workflow failure; Make.com has same. Configure to owner email.
2. **Weekly health check:** Monday analytics report is the primary health signal — if no report arrives, something is broken.
3. **API key rotation reminders:** Claude API, Etsy, Printful, Midjourney keys don't expire but should be rotated if compromised. Set calendar reminder every 6 months.
4. **Cost alerts:** Set billing alerts in Claude API console and Make.com — catch runaway spend early.

---

## Related Documents

- [[README]] — automation tier overview
- [[tool-stack]] — tool inventory and costs
- [[ecosystems/atelier/agents/README]] — Atelier agent definitions
