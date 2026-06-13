# Dinnerz

Parental communication app — speak directly through your kids' headphones.

## One-liner
"Dinner's ready" — straight into their ears, no shouting upstairs.

## Problem
Kids wear headphones constantly (gaming, music, videos). Parents shout, kids don't hear. Texting a 7-year-old doesn't work. Walking upstairs every time is friction.

## Solution
Parent device acts as intercom → plays audio directly through child's connected headphones/speakers. One tap, speak, done.

## Core Feature
- Parent opens app → taps talk button → speaks → audio plays through child's device speaker/headphones
- Works over local WiFi (same house) or internet (if needed)
- Child device can be phone, tablet, or computer

## Name Candidates (Z-rule)
- **Dinnerz** — playful, immediately understood
- **Hollaz** — "holler" with Z
- **Buzzline** — intercom feel with Z sound
- **Callz** — simple
- **Announz** — "announce" with Z

## Platforms
- iOS + Android (primary — phones/tablets)
- Windows + Mac (secondary — kid's gaming PC)

## Monetization (Freemium)
- **Free**: 1 parent + 1 child device, basic intercom
- **Premium** ($2.99/mo or $19.99/yr):
  - Multiple child devices
  - Scheduled announcements ("5 minutes until dinner")
  - Custom notification sounds
  - Do Not Disturb override
  - History/log of messages sent

## Technical Considerations
- Needs real-time audio streaming (WebRTC or similar)
- Push notification to wake child device
- Background audio playback on child device
- Permission: microphone (parent), notification + audio (child)
- Local network discovery for same-house setup (Bonjour/mDNS)
- Privacy: no audio stored on servers, direct P2P where possible

## Competition
- Apple Intercom (HomePod only — not headphones)
- Walkie-talkie apps (require both parties to have app open)
- Family messaging apps (text, not voice-through-headphones)
- Gap: nobody does parent-to-headphones specifically

## Differentiator
Not a walkie-talkie. Not a chat app. It's a one-way intercom that interrupts whatever the kid is listening to. Parent talks, kid hears. That's it.

## MVP Scope
1. Parent app: one button, hold to talk
2. Child app: receives audio, plays through current output device
3. Pairing: QR code scan on same WiFi
4. One parent, one child — that's the MVP

## Status
- **Phase**: Idea
- **Priority**: TBD — evaluate after first app concept is validated
