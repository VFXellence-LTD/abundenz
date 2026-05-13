# Signal — Digital Product Catalog

All planned Signal digital products: what they are, who they're for, pricing rationale, production effort, and automation potential.

Products ordered by build priority (fastest to ship first).

---

## Product 01: Studio Audit Checklist

**Price:** $19
**Status:** Build first (Phase 0, Week 13)

### Description
A structured, comprehensive checklist for auditing an existing VFX studio's pipeline, infrastructure, and workflow. Not a questionnaire — a runbook. Includes: what to look at, what good looks like vs bad, and recommended next steps for each category.

Usable as: self-audit by the in-house TD, audit by a pipeline consultant, or due diligence before hiring a pipeline contractor.

### Target persona
Persona 2 (Decider) and Persona 4 (Operator) — someone who needs to evaluate the current state without necessarily having deep technical expertise.

Also useful for Persona 1 (Lone Wolf) who has never done a formal pipeline review.

### Contents

**Section 1: File System and Naming Conventions**
- Folder structure assessment (does it separate entity types correctly?)
- Naming convention evaluation (consistent? machine-readable? future-proof?)
- Version control strategy (what breaks if the convention changes mid-project?)
- Storage redundancy check (where are backups? last tested?)

**Section 2: Asset Pipeline**
- Asset entity types defined? (geo, shading, rig, etc.)
- Publish/load workflow documented?
- Versioning strategy (can you go back to v3?)
- Cross-DCC compatibility (assets that travel Maya → Houdini → Nuke?)

**Section 3: Shot Pipeline**
- Shot entity setup in tracker (ShotGrid/Ayon/ftrack)
- Task-to-file mapping: is there a standard?
- Review/delivery workflow: how do dailies move?
- Handoff points documented?

**Section 4: Production Tracker**
- Tracker in use? (ShotGrid, Ayon, ftrack, spreadsheet — note findings)
- Is the tracker the source of truth or a second record?
- Integration with DCC tools?
- Artist adoption — do artists use it or work around it?

**Section 5: Render and Delivery**
- Render farm setup (Deadline, Tractor, local, cloud)
- Job submission workflow — documented? Automated?
- Error monitoring — does someone know when jobs fail?
- Delivery specs locked? (codec, colorspace, naming)

**Section 6: Documentation and Onboarding**
- Pipeline documentation exists?
- Is it accurate (vs what's actually deployed)?
- Onboarding checklist for new artists?
- "Bus factor" — how many people have to leave before pipeline stops working?

**Section 7: Security and Access**
- Network share access controls?
- Admin credentials shared or per-person?
- Off-site backup?

**For each item:** three status options (Good / Needs Attention / Critical Gap) plus a "notes" field and "recommended action" for common findings.

### Pricing rationale
$19 — impulse-purchase price for a professional. Expenses without thought. At 10-20 sales/month = $190-380/month for 1-2 days of writing work. Sets the floor for Signal's product catalog.

### Production effort
**Writing:** 1-2 days
**Format:** Notion template + PDF export, OR Google Sheets + PDF
**Design:** Basic formatting, no graphic design needed
**Automation potential:** Low — it's a document. The "automation" is that the buyer uses it themselves.

### Content to build alongside it
- YouTube video: "The pipeline audit I wish I'd done before production started"
- Blog post: "VFX pipeline audit — 7 areas to check before you start a new show"
- These videos are the marketing for the product. No paid ads needed.

### Revenue model
- Sell via Gumroad or LemonSqueezy
- Link in relevant video descriptions and blog posts
- Mention in newsletter when relevant pipeline audit content posts

---

## Product 02: Studio Onboarding Pack

**Price:** $29
**Status:** Build second (Phase 0, Week 14-15)

### Description
A collection of templates for onboarding new artists and contractors to a VFX studio's pipeline. Designed so a pipeline TD can hand it off to production and not need to be present for every new hire.

### Contents
- New artist pipeline orientation doc (template — customizable)
- Software setup checklist (what to install, in what order, with what configs)
- File naming and folder convention quick reference card
- Network drive access and permissions request form
- Render farm submission guide (basic Deadline workflow)
- DCC-specific settings guide (Maya, Houdini, Nuke — one page each)
- "How to file a pipeline bug report" guide (so artists report problems, not just complain)
- First week sign-off checklist (TD signs off artist is pipeline-ready)

### Target persona
Persona 1 (Lone Wolf) who is constantly onboarding new people one-on-one and spending 2-4 hours per person. This pack cuts it to 30 minutes.
Persona 2 (Decider) who wants a structured onboarding process but doesn't know what it should contain.

### Pricing rationale
$29 — just above the audit checklist. Two products creates a bundle opportunity. Saves the buyer 2+ hours per hire at their billing rate. Easy ROI.

### Production effort
**Writing:** 2-3 days
**Templates:** Build in Notion, export to PDF + customizable Word/Google Docs format
**Customization notes:** Include a "how to adapt this for your studio" section

---

## Product 03: Pipeline Starter Kit

**Price:** $79
**Status:** Build third (Phase 0, Week 16-18)

### Description
A practical starting point for building a small-studio VFX pipeline from scratch. Not a finished pipeline — a foundation kit that saves 2-4 weeks of decisions and boilerplate.

### Contents
- **Folder structure generator** (Python script): takes project name, creates standard folder hierarchy with correct permissions
- **Naming convention validator** (Python script): validates filenames against configurable convention, flags violations
- **Basic Ayon project config** (YAML): pre-configured Ayon settings for a 5-20 person studio. Includes entity types, task types, statuses, and basic folder structure.
- **Docker Compose for Ayon dev server** (docker-compose.yml): deploy a local Ayon development server in one command
- **Pipeline bootstrap checklist**: what to do in what order when starting from nothing
- **DCC-agnostic publish scaffold** (Python module): minimal publish/load structure that works across Maya, Houdini, Nuke — designed to extend
- **README files**: each component has its own README explaining what it does and how to adapt it

### Target persona
Persona 3 (Climber) who wants to build a portfolio pipeline project. Persona 1 (Lone Wolf) starting at a new studio. Persona 2 (Decider) evaluating whether Ayon is viable for their studio.

### Pricing rationale
$79 — under $100, expensable as a tool. Represents 2-4 weeks of research and boilerplate work saved. Would cost $300-600 in consulting time to get the same starting point from a contractor.

### Production effort
**Code:** 3-5 days (scripts, configs, Docker Compose, scaffold)
**Documentation:** 1-2 days
**Testing:** 1 day (validate all scripts work on clean Ayon install)

### Automation potential
- The scripts inside it are the automation (the buyer uses them)
- Marketing automation: pipeline starter kit mentioned whenever any video covers Ayon setup

---

## Product 04: Ayon Advanced Configuration Pack

**Price:** $79
**Status:** Build fourth (alongside or after Pipeline Starter Kit)

### Description
Production-ready Ayon configurations for studios that have a working Ayon install and want to push it further. Assumes the buyer already has Ayon running.

### Contents
- **Custom task types pack**: 20+ task type definitions covering common VFX workflow patterns (look dev, FX sim, rigging, etc.) with status flows
- **Folder structure templates**: 5 different folder structure conventions for different studio sizes/workflows (episodic TV, feature film, commercial, VR)
- **Custom attribute sets**: 15+ useful custom attributes for shots and assets (e.g., "has_received_ref", "approved_for_comp", "on_hold_reason")
- **Deadline integration config**: Ayon + Deadline publish job config that handles common failure modes
- **Review workflow setup**: Ayon + SyncSketch or Ayon + Shotgun integration for dailies
- **Settings migration guide**: how to move settings from one Ayon server to another without losing customizations
- **Ayon bundle config examples**: production-tested bundle configurations for 3 studio sizes

### Target persona
Persona 1 (Lone Wolf) who has Ayon deployed but hasn't configured it beyond the defaults. Has hit limits of the default configuration and doesn't know where to start.

### Pricing rationale
$79 — same tier as starter kit. Someone with Ayon deployed knows its value, and knows configuration is painful. The "I've spent 20 hours on this and I just want a working starting point" impulse buy.

### Production effort
**Config development:** 3-4 days (some of this may already exist from production work — check what can be shared without IP issues)
**Documentation:** 1-2 days
**Testing:** 1 day (validate configs on clean Ayon instance)

---

## Product 05: CI/CD for Pipeline Teams

**Price:** $39
**Status:** Build fifth

### Description
A guide + template repository for setting up CI/CD pipelines specifically for VFX pipeline tools. GitHub Actions and GitLab CI configurations for: running tests on DCC stub environments, linting Python pipeline code, building and packaging Ayon addons, and deploying to dev vs production Ayon servers.

### Contents
- **GitHub Actions workflows** (5 templates):
  - Lint on PR (ruff + mypy)
  - Unit test with DCC stubs
  - Ayon package build
  - Deploy to dev Ayon server on develop branch push
  - Deploy to production Ayon server on release tag
- **GitLab CI equivalents** (same 5 templates, GitLab YAML)
- **Ayon addon testing framework**: how to write tests for Ayon publish plugins without a running DCC
- **DCC stub guide**: how to create minimal stubs for Maya/Houdini/Nuke for testing
- **Deployment automation script**: pushes Ayon addon package to server via API

### Target persona
Persona 1 (Lone Wolf) who has 5+ custom Ayon addons and is manually testing and deploying them. Persona 3 (Climber) who wants to work like a professional software team.

### Pricing rationale
$39 — lower price point because it's narrower scope. But saves 1-2 weeks of CI/CD setup research. Underpriced — could justify $59-79. Start at $39, raise after reviews.

### Production effort
**Template development:** 2-3 days
**Documentation:** 1 day

---

## Product 06: Nuke Script Library

**Price:** $49
**Status:** Build when compositing content is producing Nuke-specific views

### Description
A curated library of Python scripts for Nuke that solve common pipeline problems: automated read node creation from Ayon paths, write node configurator, version bumping, delivery script automation, review prep.

### Contents (15-20 scripts)
- `ayon_read_creator.py`: creates Read nodes from Ayon asset paths, handles version lookup
- `delivery_write_builder.py`: creates Write node configured for delivery specs (codec, path, naming)
- `version_bumper.py`: increments version on Write nodes following naming convention
- `review_prep.py`: adds slate, converts to delivery format for dailies
- `color_checker.py`: validates colorspace settings on Read nodes against project config
- `shot_validator.py`: pre-render check (frame range, output path, permissions)
- `render_submitter.py`: submit current script to Deadline from Nuke UI
- Plus 8-12 additional utilities

### Target persona
Persona 1 (Lone Wolf) who does compositing pipeline. Persona 3 (Climber) learning compositing pipeline scripting.

### Pricing rationale
$49 — specific tool library. Saves 2-4 hours of scripting per script, times 15 scripts = significant value. Nuke is a licensed, professional tool — anyone buying this has budget.

### Production effort
**Script development:** 4-6 days
**Documentation:** 1-2 days (each script with usage examples)
**Testing:** 1-2 days (Nuke evaluation license for testing)

---

## Product 07: Render Farm Automation Toolkit

**Price:** $99
**Status:** Build after first 5 products; requires more production depth

### Description
Python scripts and utilities for automating Deadline render farm operations: job submission from multiple DCCs, error recovery, automatic requeue logic, render progress monitoring, and cost estimation.

### Contents
- **Universal Deadline submitter** (Python module): consistent submission API across Maya, Houdini, Nuke, Blender
- **Error recovery scripts**: automatically requeue failed jobs with exponential backoff, notify on persistent failures
- **Progress monitor** (CLI + webhook): poll Deadline API, output progress to Slack/email
- **Cost estimator**: estimate render cost (time × machines) before submitting — prevents surprise bills on cloud renders
- **Job priority manager**: automatically prioritize jobs based on deadline (urgency) and frame count (efficiency)
- **Farm health check**: daily script that reports farm status, failed workers, stuck jobs

### Target persona
Persona 1 (Lone Wolf) managing a Deadline farm. Persona 2 (Decider) evaluating render farm setup.

### Pricing rationale
$99 — premium tier. Render farm problems are expensive (idle machines, failed renders, billing surprises). $99 for tools that prevent one $500 cloud render mistake is a good deal.

### Production effort
**Development:** 5-8 days (complex, requires Deadline API depth)
**Testing:** 2-3 days (requires Deadline instance)

---

## Product 08: Python for Pipeline TDs (Video Course)

**Price:** $299
**Status:** Build at Month 6-9 (after audience is established, after content proves the market)

### Description
A complete video course covering intermediate-to-advanced Python specifically for VFX pipeline development. Not Python basics — assumes the buyer writes Python and wants to write pipeline code professionally.

### Course structure (~8-10 hours of video)

**Module 1: Pipeline Python Foundations** (90 min)
- Writing maintainable pipeline scripts vs. quick hacks
- Logging, error handling, and graceful failures
- Configuration management (environment variables, YAML/JSON configs)
- Type hints for pipeline code (Python 3.9+)

**Module 2: File System and Path Operations** (60 min)
- Pathlib vs os.path (always Pathlib)
- File system watchers
- Atomic file operations (write-rename pattern)
- Cross-platform path handling

**Module 3: DCC Integration Patterns** (90 min)
- Connecting to Maya, Houdini, Nuke Python environments
- Writing DCC-agnostic code
- Context managers for DCC state management
- Threading considerations inside DCCs

**Module 4: Ayon Plugin Development** (90 min)
- Anatomy of an Ayon publish plugin
- Writing a complete publish plugin from scratch
- Writing a loader plugin
- Testing plugins without a running DCC

**Module 5: Production Tracker APIs** (60 min)
- ShotGrid/Flow Production Tracking API
- ftrack API
- Ayon GraphQL API
- Authenticating and rate-limiting correctly

**Module 6: Automation and Scripting** (60 min)
- Deadline Python API for job management
- Scheduled tasks and cron alternatives
- Webhook-based pipeline automation
- Testing automated scripts

**Module 7: Building a Complete Tool** (60 min)
- Case study: build a complete publish tool from scratch
- Code review of the final tool against production standards
- Shipping a pipeline tool: versioning, distribution, maintenance

### Target persona
Persona 3 (Climber) — primary audience. Persona 1 (Lone Wolf) as secondary.

### Pricing rationale
$299 — mid-range course price for professional skill development. Competitors charge $300-500 for similar scope. VFX professionals expense training. Would cost $1,500+ in consulting time to learn same material 1:1.

### Production effort
**Script and outline:** 3-5 days
**Recording:** 2-3 days (6-8 hours of content at 1.5-2x recorded length)
**Editing:** 5-8 days (significant production work)
**Platform setup:** 1-2 days (Gumroad/LemonSqueezy or Teachable)
**Total:** 11-18 days (3-4 weeks part-time)

### Automation potential
Once built: fully passive. Sales via product link in relevant videos. No ongoing work per sale.

---

## Product Catalog Summary

| # | Product | Price | Build time | First sale target |
|---|---------|-------|-----------|------------------|
| 01 | Studio Audit Checklist | $19 | 1-2 days | Week 13 |
| 02 | Studio Onboarding Pack | $29 | 2-3 days | Week 15 |
| 03 | Pipeline Starter Kit | $79 | 4-7 days | Week 18 |
| 04 | Ayon Advanced Config Pack | $79 | 4-6 days | Week 20 |
| 05 | CI/CD for Pipeline Teams | $39 | 3-4 days | Week 22 |
| 06 | Nuke Script Library | $49 | 5-8 days | Month 6 |
| 07 | Render Farm Automation Toolkit | $99 | 7-11 days | Month 7 |
| 08 | Python for Pipeline TDs (Course) | $299 | 11-18 days | Month 8-9 |

**Cumulative catalog value (all products):** $791
**Bundle opportunity:** "Complete Pipeline Pack" (01+02+03) at $89 (saves $18 vs individual)

---

## Distribution and Marketing

No paid advertising. Product discovery through content:

1. **In-video CTA**: relevant videos link to relevant products ("if you want this done for you, I packaged it up")
2. **Blog post CTA**: related blog post links to matching product
3. **Newsletter**: announce new products, occasional product mentions when relevant
4. **Gumroad/LemonSqueezy product page**: linked from YouTube channel, website header, email signature

All products hosted on Gumroad initially (zero upfront cost). If volume justifies it, move to LemonSqueezy for better EU VAT handling and branding.
