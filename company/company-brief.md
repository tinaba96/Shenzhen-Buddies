# Tensai Tech — Company Brief (Single Source of Truth for Management)

> **Every employee (subagent) must read this before starting any work.** Decisions on the business, revenue model, KPIs, and priorities follow this document.
> Then read `company/playbook.md` — the thinking standards, HANDOFF protocol, and definition of done that make this company sharp.
> Then read `company/learnings.md` — the company's living memory. Apply what's relevant, and contribute back what you learn. **This is how we get smarter every session.**
> Also read: for creative/brand guidance, see `marketing/brand-brief.md`; for code conventions, see `AGENTS.md`.

---

## 1. Company & Business

- **Operating company**: Tensai Tech Inc. / **Product**: Shenzhen Buddies
- **Business**: A peer-to-peer "travel buddy" matching service. It connects international travelers with **local guides (buddies)** who share their interests and language, for an experience of being shown around by a local. Launching in Shenzhen.
- **At its core, this is a two-sided marketplace**: supply = guides / demand = travelers. Growing only one side doesn't make it work — both sides must be grown together.
- **Current stage**: **Pre-launch — no real bookings yet.** The single-guide booking infrastructure is built (one booking per day, migration 0008), but the marketplace has not started. Pre-PMF: speed of learning is everything.
- **Binding constraint (attack this first)**: **first believers** — recruit the founding guides and land the first real bookings. Until the first paid booking exists, polish is procrastination.

### Current 30-Day Mission (set 2026-07-25)

**Grow the Instagram audience and build the content library.** The studio is the company's main engine this cycle; every other department supports it (research feeds angles, product keeps the landing flow ready for profile visitors, trust-safety and legal keep it clean). Success = follower growth + a reusable library of on-brand assets. Bookings remain the North Star — this month we build the audience that will produce them.

## 2. Revenue Model (Where Revenue Comes From)

| Stream | Mechanism | Status | Levers |
|---|---|---|---|
| **Booking fee** | Guide bookings at CA$10/hr (5–15h). Stripe/PayPal payments (migration 0009–0015) | Implemented; awaiting first real booking | Number of bookings × price × take rate |
| **Subscription** | Stripe Checkout, 14-day free trial (`/pricing`) | Implemented | Paid conversion rate × retention rate |

**Revenue ≈ (number of guides × utilization × quality) × (number of travelers × booking conversion × repeat visits × price × take rate) + subscription MRR**
Every employee should be aware of which term in this equation their work moves.

## 3. North Star & KPIs

- **North Star**: "**Number of completed in-person buddy experiences (completed meetups)**" — this reflects supply, demand, trust, and quality all at once.
- **Key KPIs**:
  - Supply: number of active guides, guide vetting pass rate, guide retention rate
  - Demand: new travelers, booking conversion rate (views → bookings), repeat booking rate
  - Revenue: GMV, take rate, subscription MRR, CAC/LTV
  - Trust: average review score, incident rate, report response time
- In the beta stage, **learning matters more than absolute numbers**. Every initiative runs on a hypothesis → measurement → insight cycle.

## 4. Growth Priorities (Apply in This Order)

1. **Trust & safety** (strangers meeting in person — if this breaks down, everything breaks down → the top-priority foundation)
2. **Supply (quality and number of guides)** (in marketplaces, supply usually needs to lead)
3. **Demand acquisition** (organic/PR/KOL first, then paid, in order of CAC efficiency)
4. **Conversion & repeat visits (product improvement)**
5. **Monetization optimization (pricing, take rate, subscriptions)**

## 5. Target Market

- **Travelers (demand)**: English-speaking travelers worldwide visiting Shenzhen. Experience-focused.
- **Guides (supply)**: English-speaking Shenzhen locals who want to meet foreigners and/or earn extra income. Wide-ranging interests.
- **Local channels**: Instagram, TikTok, and YouTube Shorts (for traveler and guide acquisition/awareness) / local English-speaking, expat, university, and community channels (for guide recruitment in Shenzhen).

## 6. Company-Wide Guardrails

- **Trust & safety come first**: This is an in-person service by design. Never treat vetting, reporting, and emergency-response design as secondary.
- **Legal compliance**: Be mindful of personal data protection (GDPR / China's PIPL), payment compliance, marketplace liability, and China market regulations and content restrictions.
- **Honest numbers**: Never inflate revenue, metrics, or progress. Clearly label anything unverified as a "hypothesis."
- **Creation and approval are separate lanes**: All implementation and production work must go through review by a separate owner (`qa-engineer` / `brand-guardian` / `trust-safety`, etc.).
- **Brand consistency**: All external-facing messaging follows `marketing/brand-brief.md`.

## 7. Decision Escalation

- Cross-departmental issues, prioritization, budget, trade-offs → **CEO**.
- Coordination, meeting notes, task management, adding new employees (hiring) → **Chief of Staff**.
- Domain-specific decisions within each department are owned by that department's lead (Engineering/Growth/Revenue/Ops).
