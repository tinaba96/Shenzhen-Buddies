# Tensai Tech — AI Company Handbook (Org Chart)

A company made up of AI employees (subagents), built to run Shenzhen Buddies (guide ↔ traveler matching) and **grow revenue**. It operates a two-sided marketplace (supply = guides × demand = travelers; revenue = booking fees + subscriptions).

- **Source of truth for management**: [`company/company-brief.md`](company-brief.md) (read by every employee before starting work)
- **The Playbook — how we think**: [`company/playbook.md`](playbook.md) (thinking standards, HANDOFF protocol, definition of done, skills map, autonomy protocol, learning protocol)
- **Living memory — how we compound**: [`company/learnings.md`](learnings.md) (every employee reads it and contributes; `chief-of-staff` graduates proven lessons into permanent instincts)
- **Current 30-day mission** (set 2026-07-25): **grow Instagram + build the content library** — see `company/company-brief.md` §1. Binding constraint: first believers (founding guides + first real bookings).
- **Brand/creative**: [`marketing/brand-brief.md`](../marketing/brand-brief.md)
- **Code conventions**: [`AGENTS.md`](../AGENTS.md)

## 📞 Who to Call (cheat-sheet)

**Big or cross-department? Call a manager — they pull in the rest:**

| You want… | Call | It orchestrates |
|---|---|---|
| A whole company mission ("grow IG this month", "attack our constraint") | `@ceo` | Every department, by revenue lever |
| A full content campaign (research → posts → review) | `@studio-director` | The 8-person creative studio |
| Coordination, decision logs, or a **new employee** | `@chief-of-staff` | Admin + hiring |

**Single task? Just describe it — or name the specialist directly:**

| I need… | Call |
|---|---|
| An Instagram image / carousel | `@art-director` |
| A Reel / short-video storyboard | `@motion-designer` |
| Captions, hooks, hashtags | `@copywriter` |
| Market / competitor / trend research | `@market-researcher` |
| A positioning or campaign angle | `@brand-strategist` |
| A post plan / content calendar | `@content-planner` |
| A quality/safety check before shipping | `@brand-guardian` |
| A feature built or a bug fixed (real code) | `@engineer` |
| That code tested independently | `@qa-engineer` |
| A product spec / prioritization (PRD) | `@product-manager` |
| To recruit / onboard / retain guides | `@guide-success` |
| A B2B or partnership deal | `@sales-partnerships` |
| Traveler/guide support handling | `@customer-support` |
| Safety, vetting, fraud, or an incident | `@trust-safety` |
| Pricing, unit economics, or a forecast | `@finance-revops` |
| Terms, privacy, or a compliance question | `@legal-compliance` |
| A KPI / funnel / cohort analysis | `@data-analyst` |
| PR or influencer/KOL outreach | `@pr-influencer` |
| Community, comments, DMs, UGC | `@community-manager` |
| A growth experiment / acquisition plan | `@growth-marketer` |

**Rule of thumb:** single task → just ask (Claude auto-routes) or name the specialist · whole-company move → `@ceo` · full campaign → `@studio-director`. When unsure, `@ceo` figures out who does what.

## Org Chart (23 Employees Total)

```
                          ┌─────────────┐
 Company-level requests → │     CEO     │  Company-wide leadership, revenue accountability, cross-functional orchestration
                          └──────┬──────┘
                                 │  ┌──────────────┐
                                 ├──│ Chief of Staff│ Secretary, administration, meetings, hiring (adding new employees)
                                 │  └──────────────┘
   ┌──────────────┬──────────────┼──────────────┬──────────────┐
   ▼              ▼              ▼              ▼              ▼
┌────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│PRODUCT │  │  GROWTH  │  │ REVENUE  │  │   OPS    │  │ CREATIVE │
│ & ENG  │  │ & MKTG   │  │& MARKET- │  │ / ADMIN  │  │ (Studio) │
│        │  │          │  │  PLACE   │  │          │  │          │
├────────┤  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤
│product-│  │growth-   │  │guide-    │  │finance-  │  │studio-   │
│manager │  │marketer  │  │success   │  │revops    │  │director  │
│engineer│  │pr-       │  │sales-    │  │legal-    │  │art-      │
│qa-     │  │influencer│  │partnersh │  │complianc │  │director★ │
│engineer│  │community-│  │customer- │  │data-     │  │motion-   │
│        │  │manager   │  │support   │  │analyst   │  │designer★ │
│        │  │          │  │trust-    │  │          │  │copywriter★│
│        │  │          │  │safety    │  │          │  │brand-    │
│        │  │          │  │          │  │          │  │strategist│
│        │  │          │  │          │  │          │  │content-  │
│        │  │          │  │          │  │          │  │planner   │
│        │  │          │  │          │  │          │  │market-   │
│        │  │          │  │          │  │          │  │researcher│
│        │  │          │  │          │  │          │  │brand-    │
│        │  │          │  │          │  │          │  │guardian  │
└────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘
                                          ★ = Powered by fable5 (creative line)
```

## Employee Directory

### Management & Coordination
| Employee | Role | Model |
|---|---|---|
| `ceo` | Company-wide leadership, revenue accountability, cross-functional orchestration | opus |
| `chief-of-staff` | Secretary, administration, HR (meeting notes/tasks/**adding new employees**) | sonnet |

### Product & Engineering
| Employee | Role | Model |
|---|---|---|
| `product-manager` | Revenue-driven prioritization, PRDs, A/B test design | opus |
| `engineer` | Full-stack implementation (Next.js/Supabase/Stripe/PayPal) | opus |
| `qa-engineer` | Independent-lane quality verification, regression, lint/build | sonnet |

### Growth & Marketing
| Employee | Role | Model |
|---|---|---|
| `growth-marketer` | Funnel/acquisition/referrals/A-B testing, CAC efficiency | sonnet |
| `pr-influencer` | PR, KOL/influencer outreach, low-CAC awareness | sonnet |
| `community-manager` | Community/comments, DMs, UGC promotion | sonnet |

### Revenue & Marketplace
| Employee | Role | Model |
|---|---|---|
| `guide-success` | Supply side: guide acquisition/onboarding/quality/retention | sonnet |
| `sales-partnerships` | B2B/partnerships (hotels/tourism boards/universities…) to bundle supply and demand | opus |
| `customer-support` | Traveler/guide support, satisfaction and repeat-visit retention | sonnet |
| `trust-safety` | Identity verification/reporting/fraud/emergency response (the top-priority foundation) | opus |

### Operations / Administration
| Employee | Role | Model |
|---|---|---|
| `finance-revops` | Pricing/take rate/unit economics/payment operations | opus |
| `legal-compliance` | Terms/privacy (GDPR/PIPL)/payments/China regulations | opus |
| `data-analyst` | KPI tree/funnel/cohort analysis/BI | sonnet |

### Creative (Buddy Studio)
| Employee | Role | Model |
|---|---|---|
| `studio-director` | Creative leadership (research → strategy → production → QA) | opus |
| `market-researcher` | Market/competitor/trend research | sonnet |
| `brand-strategist` | Messaging angles, concepts | opus |
| `content-planner` | Breaks concepts down into post briefs | sonnet |
| `art-director` | **Image and carousel generation** | **fable5** |
| `motion-designer` | **Reels storyboards + motion** | **fable5** |
| `copywriter` | **Copywriting & messaging** | **fable5** |
| `brand-guardian` | Pre-launch quality and safety review | sonnet |

## How to Use

**Management level (recommended)** — hand it to the CEO and every department gets organized:
```
@ceo Grow Shenzhen traveler followers and bookings this quarter. Design the priorities and what each department should do.
@ceo Guide supply is insufficient. Build a plan to increase supply and put it into execution.
```

**Direct to a department/individual**:
```
@product-manager Prioritize initiatives to raise the booking conversion rate and write one PRD
@guide-success Design an onboarding flow to recruit 50 guides in Shenzhen
@finance-revops Model the unit economics of the current CA$10/hr rate
@studio-director Three IG posts for the night-market campaign
```

## Principles
- **Every employee reads `company/company-brief.md` then `company/playbook.md` before starting work** (policy changes are made by updating those two files).
- **Every employee carries role-specific "Sharp heuristics"** — the mental models of a world-class operator in that seat — and ends every deliverable with the Playbook's HANDOFF block (TL;DR / confidence / open questions / next owner).
- **Creation and approval are separate lanes**: implementation → `qa-engineer` / external messaging → `brand-guardian` / safety → `trust-safety` / legal → `legal-compliance`.
- **If more headcount is needed**, request it via `@chief-of-staff` (avoiding duplication, create a new `.claude/agents/*.md` file and reflect it in this org chart).
