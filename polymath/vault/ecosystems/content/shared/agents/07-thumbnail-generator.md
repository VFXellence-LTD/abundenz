# Agent 07 — Thumbnail Generator

## Purpose
Generate 3-5 YouTube thumbnail options for the human to choose from. Each option represents a different visual angle on the topic. Human picks one, optionally requests a variation, and approves. The approved thumbnail is sent to Scheduler (Agent 09) with the YouTube upload.

## Automation Tier
**Human-in-loop** — agent generates options, human must pick one before the pipeline continues. Target: human spends < 2 minutes choosing.

## Inputs
- Topic title: `{topic_title}`
- Clean transcript: `_transcripts/{date}-{slug}-clean.txt` (for summary extraction)
- Content pillar: `{pillar}`
- Signal thumbnail brand guide: `/assets/thumbnails/brand-guide.md`
- Canva template IDs: `/assets/thumbnails/canva-templates.json`
- Optional: specific hook sentence from outline (strongest line from the hook section)

## Outputs
- 3-5 thumbnail image options: `_thumbnails/{date}-{slug}-option-{n}.jpg` (1280x720, 72dpi)
- Thumbnail selection metadata written to Airtable:
  - `thumbnail_options` (array of paths)
  - `thumbnail_status` (enum): awaiting_selection | selected | approved
- Human notification: "Thumbnail options ready: [topic]" with image previews

## Tools Required
- Claude API — summary extraction from transcript, concept generation
- Ideogram API or Midjourney API — background/visual element generation
- Canva API — template application, text overlay, composition
- Airtable API
- File system write access
- Slack or email webhook for human notification

## Trigger
Runs after edited audio is confirmed (Agent 06 complete). Can run in parallel with Atomizer (Agent 08) — both depend on the same inputs but don't depend on each other.

## Prompt (Concept Generation)

```
You are designing YouTube thumbnail concepts for Signal, a VFX pipeline engineering content channel.

## Visual identity constraints
- Dark background (#1a1a2e or similar)
- No human face in thumbnail (this channel uses text-and-code style, not face-cam style)
- One focal element: either a code snippet, a terminal/DCC screenshot, a workflow diagram, or bold text
- Text: large, readable, technical weight — NOT all-caps motivational phrases
- Accent color: cool blue-green (#00b4d8)
- Font: JetBrains Mono or Inter (bold weight)
- No stock photo clip art. No gradients. No comic book effects.

## Topic
{topic_title}

## Pillar
{pillar}

## Hook (strongest line from the recording)
{hook_line}

## Summary of content (from transcript)
{transcript_summary}

## Task
Generate 5 thumbnail concepts. For each concept, describe:
1. **Main text** (the large text on the thumbnail — 3-7 words maximum)
2. **Supporting element** (what visual element occupies the other 40% of the space):
   - Code snippet: describe what code/language/context
   - Terminal output: describe what command/result
   - DCC screenshot: describe which DCC, what's visible
   - Diagram: describe what workflow or architecture is shown
   - Nothing: bold text only, dark background
3. **Layout** (text left + visual right | text center | text top + visual below | etc.)
4. **Why this works** (1 sentence: what makes this concept click for the target audience)

Generate concepts that:
- A pipeline TD would stop scrolling for
- Communicate the pain point or solution in one glance
- Are NOT clickbait (no false surprise, no manufactured urgency)
- Look professional on a dark background

Do NOT use:
- Faces or human figures
- Red circles/arrows (YouTube clickbait aesthetic)
- "YOU WON'T BELIEVE" or similar
- Generic "coding" thumbnails (Matrix rain, random Python snippets)
- Light backgrounds
```

## Canva Composition (After Concept Selection)

After human selects a concept, Canva API renders the thumbnail:

```python
# Pseudocode for Canva composition
template_id = select_template(concept["layout"])  # from canva-templates.json
design = canva.create_design(
    template_id=template_id,
    elements=[
        {"type": "text", "value": concept["main_text"], "style": "heading"},
        {"type": "image", "source": generate_visual(concept["supporting_element"])},
        {"type": "image", "source": "assets/thumbnails/signal-logo.png", "position": "bottom-right"}
    ],
    background_color="#1a1a2e"
)
export_path = canva.export_design(design, format="jpg", width=1280, height=720)
```

## Error Handling / Escalation
- Ideogram/Midjourney API failure: fall back to text-only thumbnails (still valid per brand guide).
- Canva API failure: export concept descriptions as a brief for human to create thumbnail manually in Canva (15 min effort).
- Human does not select within 24 hours: send reminder. If 48 hours, proceed with highest-priority concept automatically and flag.
- Human rejects all 5 options: generate 3 more with different emphasis. If rejected again, flag for manual creative direction.

## Build Order Dependency
Can be built in parallel with Agent 08 (Atomizer). Both depend on Agent 06 (Editor) completion but don't depend on each other. Build thumbnail generator after Editor is operational.

## Manual Fallback
Without this agent:
1. Read the outline hook line
2. Open Canva, select Signal thumbnail template
3. Write 3-7 word text for main message
4. Add supporting element (screenshot, code snippet)
5. Export 1280x720 JPG
Manual time: 15-20 minutes per thumbnail. Fast enough to do manually while Atomizer builds.
