# Shared Agent — Image Generator

## Purpose

AI image generation for all ecosystems. Thumbnails, product designs, Pinterest pins, social media graphics, blog images. Routes to cheapest appropriate model.

## Automation tier

Human-in-loop for Content (thumbnails need brand consistency). Fully autonomous for Products and Affiliate (batch generation with quality gate).

## Used by

- **Content**: YouTube thumbnails, blog header images, newsletter graphics, social media posts
- **Products**: Wall art, KDP covers/interiors, POD designs, mockup compositions
- **Affiliate**: Pinterest pin images, blog post images, comparison graphics

## Model routing (cheapest first)

| Use case | Model | Tool | Cost |
|----------|-------|------|------|
| Pin images, blog graphics | Flux 2 | Higgsfield CLI | 1 credit |
| Quick variations | Grok Image | Higgsfield CLI | 1 credit |
| Product designs (illustration) | Midjourney | Discord/API | $10/mo |
| Text-integrated designs (POD) | Ideogram | API | $7/mo |
| Pro quality (thumbnails) | Nano Banana Pro | Higgsfield CLI | 2 credits |
| Photorealistic | GPT Image 2 | Higgsfield CLI | 7 credits |

**Default: Flux 2 via Higgsfield CLI.** Upgrade model only when output quality insufficient.

## Inputs

- Prompt (text description)
- Style guide reference (per ecosystem/vertical)
- Dimensions (platform-specific)
- Quantity (how many variations)

## Dimension presets

| Platform | Dimensions | Aspect |
|----------|-----------|--------|
| YouTube thumbnail | 1280×720 | 16:9 |
| Pinterest pin | 1000×1500 | 2:3 |
| Instagram post | 1080×1080 | 1:1 |
| Instagram story/reel | 1080×1920 | 9:16 |
| Blog header | 1200×630 | ~1.9:1 |
| Etsy listing | 2000×2000 min | 1:1 |
| KDP cover | varies by trim | — |
| POD t-shirt | 4500×5400 | — |

## CLI usage

```bash
# Generate image via Higgsfield (cheapest)
hf generate create flux_2 --prompt "minimalist botanical line art, white background, single plant"

# Higher quality
hf generate create nano_banana_2 --prompt "YouTube thumbnail, dark theme, code editor, VFX pipeline"

# Check cost before generating
hf generate cost flux_2 --prompt "..."
```

## Prompt template

```
Generate {quantity} variations of the following image:

Style: {style_from_vertical_guide}
Subject: {description}
Dimensions: {width}×{height}
Background: {background_color_or_transparent}
Text overlay: {text_if_any}
Brand colors: {hex_codes_if_applicable}

Output high-resolution PNG. No watermarks. No text unless specified.
```

## Post-processing pipeline

1. Generate → 2. Upscale if needed (Real-ESRGAN local) → 3. Resize to platform spec (ImageMagick) → 4. Quality gate (human or automated check) → 5. Deliver to requesting agent

## Tools required

- Higgsfield CLI (`hf.exe` at `D:\dev\sandbox\hf.exe`)
- Real-ESRGAN (local, for upscaling)
- ImageMagick (local, for format conversion)
- Midjourney (subscription, for illustration quality)
- Ideogram API (for text+image designs)
