# Buddy Studio — In-House AI Creative Studio

An in-house studio made up of AI employees (subagents) that runs social media for Shenzhen Buddies (Tensai Tech Inc.).
**Current-phase responsibility:** decide what to promote and how through research, then **generate the visual assets (images/video) for social media**. Posting is not yet automated.

---

## Org Chart (8 Employees)

```
                    ┌──────────────────────────┐
Request ──────────▶ │  Studio Director (opus)   │  Overall leadership, orchestration, final accountability
                    └────────────┬─────────────┘
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
   ┌───────────────────┐ ┌────────────────┐ ┌────────────────┐
   │ market-researcher │→│ brand-strategist│→│ content-planner │   Strategy line
   │     (sonnet)      │ │    (opus)      │ │    (sonnet)     │
   └───────────────────┘ └────────────────┘ └───────┬────────┘
                                                     ▼
              ┌───────────────┬─────────────────────┴──────────┐
              ▼               ▼                                ▼
   ┌──────────────────┐ ┌──────────────────┐        ┌──────────────────┐
   │   art-director   │ │  motion-designer │        │    copywriter    │  Production line
   │    (fable5)      │ │    (fable5)      │        │    (fable5)      │
   │ Images/Carousels │ │ Reels/Storyboard │        │Copy & messaging  │
   └────────┬─────────┘ └────────┬─────────┘        └────────┬─────────┘
            └────────────────────┴───────────────────────────┘
                                  ▼
                      ┌──────────────────────┐
                      │  brand-guardian      │  Pre-launch quality and safety review
                      │     (sonnet)         │  (creation and approval are separate lanes)
                      └──────────────────────┘
```

| Employee | Role | Model |
|---|---|---|
| **studio-director** | Overall leadership, pipeline orchestration, final wrap-up | opus |
| **market-researcher** | Market/competitor/trend/hashtag research | sonnet |
| **brand-strategist** | Messaging angles, concepts, A/B design | opus |
| **content-planner** | Breaks concepts down into post briefs/structure | sonnet |
| **art-director** | Image and carousel generation | **fable5** |
| **motion-designer** | Reels storyboard + motion generation | **fable5** |
| **copywriter** | Captions/CTAs/hashtags | **fable5** |
| **brand-guardian** | Quality, safety, and brand-consistency review | sonnet |

**fable5** powers the three creative-production roles (images, video, copy), with research and strategy narrowing the angle beforehand and the guardian locking in quality afterward.

---

## How to Use

### Request as a bundle (recommended) — per campaign
Hand it to the Studio Director, and it runs research → strategy → planning → production → QA, returning the full set of deliverables.

```
@studio-director Using Shenzhen's local night markets as the angle, make 3 Instagram posts
to grow traveler followers (2 images + 1 Reel, English).
```

### Request an individual employee directly
```
@art-director One Instagram feed post (4:5) in the Hidden Gems format, featuring Shenzhen's
electronics district. English.
@market-researcher Research which travel content formats are resonating right now on
Instagram with international travelers coming to Shenzhen.
@copywriter Write captions for this post in English.
```

---

## Sources & Rules

- **`marketing/brand-brief.md`** — the single source of truth every employee reads before starting work (brand/target/voice/visuals/guardrails). Policy changes are made by updating this file.
- Deliverables are stored in **`marketing/output/<campaign-slug>/`**.
  - Images = full-size HTML (published via Artifact → screenshotted into a postable image)
  - Video = storyboard MD + a 9:16 motion-preview HTML
  - Copy = `copy.md`
- **Creation and approval are separate lanes**: production agents never self-approve — everything must go through brand-guardian.

## How Image/Video "Generation" Works in This Environment
Rather than actual raster image/video files, assets are generated as **self-contained HTML/SVG/CSS built to exact social-media specs**.
Publishing via Artifact gives a full-size preview — screenshot it to turn it into a postable image; the motion preview serves as the blueprint for filming/Remotion implementation.
In a future phase, this blueprint can be connected directly to a real-asset (live-action + automated editing) render pipeline.

## Future Headcount (Backlog)
- **growth-analyst** (performance analysis → automatic allocation across formats) — to be hired once we're in the posting-operations phase.
- **community-manager** (drafting DMs/comments) — to be hired once we're connected to the official API.
