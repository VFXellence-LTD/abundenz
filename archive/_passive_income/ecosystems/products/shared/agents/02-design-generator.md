# Agent 02: Design Generator

**Role:** Create product designs from niche briefs. Takes a structured brief from Niche Researcher; outputs production-ready files formatted to marketplace specs. Runs on-demand (triggered by briefs from 01).

---

## Inputs

- Niche brief JSON from [[01-niche-researcher]]
- Product type (determines tool selection and output format)
- Style guide (Atelier has no fixed aesthetic — style is niche-driven, not brand-driven)

---

## Outputs

Per product concept:
- 10-20 design variations (raw generated files)
- 5 curated selections (human-readable filenames, properly structured)
- Upscaled final files at marketplace-required resolution
- Format-converted files (JPEG, PNG, PDF per marketplace)

Output directory structure:
```
/designs/YYYY-MM-DD/niche-slug/
├── raw/          ← all generated variations
├── curated/      ← top 5 selections
└── final/        ← upscaled + format-converted, ready for listing
```

---

## Tool Selection by Product Type

| Product type | Primary tool | Why |
|-------------|-------------|-----|
| Wall art (illustrative) | Midjourney | Best for illustration, painterly, detailed botanical |
| Wall art (typography) | Ideogram | Best for legible integrated text |
| Abstract / geometric | Midjourney or Flux | Flux handles controlled compositions better |
| KDP covers | Midjourney + Canva overlay | Generate illustration, add title in Canva |
| KDP coloring book pages | Midjourney (linework style) | "coloring book page, black line art, white background" style |
| POD t-shirt designs | Ideogram (text+art) or Midjourney (art only) | Depends on design type |
| POD patterns (seamless) | Midjourney Tile mode or Flux | Midjourney --tile for seamless patterns |
| Canva templates | Canva API or manual | Build in Canva, export as template link |
| Social media templates | Canva | Same as above |
| Resume templates | Canva or Figma | Layout-heavy, illustration is secondary |

---

## Prompt Templates by Product Type

### Wall Art — Botanical Line Art

```
Minimal botanical line drawing of [SUBJECT], single stem, clean fine lines, white background, botanical illustration style, no color, no shading, high contrast black lines, suitable for wall art print --ar 2:3 --style raw --v 6
```

Variations to generate:
1. Single stem, minimal
2. Small cluster, 3 elements
3. Full composition, larger arrangement
4. Same subject, different orientation
5. Silhouette variant (filled, not outline)

Output: 2:3 ratio (fits 16×24, 18×27, 24×36 print sizes), 300dpi minimum after upscale.

---

### Wall Art — Abstract Geometric

```
Minimalist abstract geometric composition, [COLOR PALETTE], clean shapes, contemporary art print, flat design, no gradients, Bauhaus inspired, suitable for framed wall art --ar 2:3 --style raw --v 6
```

Color palette options: monochrome black/white | earth tones (terracotta, cream, sage) | muted pastels | navy + gold | forest greens.

---

### KDP Coloring Book — Adult Botanical

```
Coloring book page, intricate botanical illustration, [SUBJECT], black outline only, white background, detailed zentangle-like patterns in petals/leaves, no gray fills, no shading, suitable for adult coloring book, flat 2D linework --ar 1:1 --style raw --v 6
```

Interior page output: 8.5×11in 300dpi, black lines only, white background, saved as PDF for KDP upload.

---

### KDP Coloring Book — Kids Animals

```
Coloring book page for children ages 4-8, cute [ANIMAL], bold simple black outlines, large areas to color, friendly cartoon style, white background, no shading, minimal detail, fun and clear --ar 8.5:11 --style raw --v 6
```

---

### KDP Book Cover — Journal

```
[STYLE] book cover design for a journal titled "[TITLE]", [COLOR PALETTE], [DESIGN ELEMENT], minimalist, clean typography placeholder, professional publishing quality, no text in image --ar 6:9 --v 6
```

After generation: add title, subtitle, author placeholder in Canva using exported image as background.

Cover specs: 6×9in at 300dpi = 1800×2700px (without bleed). KDP will provide exact spine + back cover size after page count is set.

---

### POD T-Shirt — Text + Illustration (Ideogram)

```
T-shirt graphic design, [ILLUSTRATION DESCRIPTION], with text "[SLOGAN TEXT]" integrated into design, [STYLE: vintage/modern/minimal], high contrast, clean edges, suitable for screen print, white background, no mock-up --ar 1:1
```

Ideogram renders text legibly — use it for any design where the phrase is central.

Output: 4500×5400px 300dpi sRGB PNG transparent background (DTG print area 15×18in at 300dpi).

---

### POD T-Shirt — Illustration Only (Midjourney)

```
[ILLUSTRATION DESCRIPTION], graphic tee design style, clean vector-like illustration, high contrast, limited color palette [COLORS], bold lines, white background, suitable for DTG printing --ar 1:1 --style raw --v 6
```

---

### Seamless Pattern (Midjourney Tile)

```
Seamless pattern, [SUBJECT/THEME], [COLOR PALETTE], repeating elements, surface design, flat illustration style --ar 1:1 --tile --v 6
```

Verify tiling after generation: open in Photoshop, apply Offset filter to check seams. Re-generate if seams visible.

Output: 5000×5000px minimum, saved as JPEG (patterns) and PNG with transparency where applicable.

---

## Upscaling Workflow

After generation and curation, upscale final selections:

**Tool:** Real-ESRGAN (local, free)

```bash
# Upscale 4x
realesrgan-ncnn-vulkan -i curated/ -o final/ -n realesrgan-x4plus -f png

# For line art / coloring pages (preserves sharp edges)
realesrgan-ncnn-vulkan -i curated/ -o final/ -n realesrgan-x4plus-anime -f png
```

**Format conversion (ImageMagick):**

```bash
# PNG → JPEG for wall art (Etsy accepts JPEG)
convert input.png -quality 95 output.jpg

# PNG → PDF for KDP interior pages
convert input.png -compress lzw output.pdf

# Resize to exact print dimensions
convert input.png -units PixelsPerInch -density 300 -resize 2400x3600 output.png
```

---

## Quality Check Before Passing to Listing Optimizer

Automated checks (run in pipeline):
- Resolution meets minimum (Etsy: 2000px shortest side; KDP: 300dpi at trim size; Printful: 150dpi print area minimum)
- File size within limits (Etsy: 20MB max per file; KDP: PDF <650MB)
- Color mode: sRGB for digital display and POD; CMYK conversion only if marketplace requires

Manual check flag (add to human review queue):
- Any design that includes text (check for Ideogram hallucinations, misspellings)
- Any design that includes faces or recognizable human likeness
- Any design that visually resembles a known brand or character

---

## Batch Production Logic

For each niche brief:
1. Generate 20 raw variations using the appropriate prompt template
2. Remove obvious failures: blurry, wrong aspect ratio, off-brief
3. Select top 10 for upscale
4. Upscale all 10
5. Final human review will cut to 5-8 per concept for listing
6. Pass curated + upscaled files to [[03-listing-optimizer]]

Target throughput when activated: 50-100 final designs per week at 2-3 hour batch session.

---

## Related Documents

- [[01-niche-researcher]] — provides niche briefs
- [[03-listing-optimizer]] — receives design files, produces listings
- [[workflows/kdp-pipeline]] — KDP-specific production steps
- [[workflows/pod-pipeline]] — POD-specific production steps
- [[workflows/digital-download-pipeline]] — template and asset production steps
