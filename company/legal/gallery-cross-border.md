# Publishing a face to overseas servers — the PIPL cross-border question

**Requested by:** `trust-safety`, via `team-lead` · **Owner:** `legal-compliance` · **Date:** 2026-08-09
**Status:** assessment complete · one decision needed from the founder (§4, option C)

> **General information, not legal advice.** I am not a Chinese-qualified lawyer and neither is anyone else on this team. §8 names the three things that genuinely need one, and what triggers the call. Everything else here is a risk judgement you can make yourself.

---

## 1. Bottom line

**Trust & Safety read the text correctly. The volume exemption does exclude sensitive personal information, and a recognisable face is very likely sensitive.** On a literal reading, one published face triggers a standard contract or certification.

**But the conclusion they drew from it is the wrong one to act on.** The standard contract is not a form you fill in — it is a filing made *by a mainland-China personal information processor with its provincial CAC*. Shenzhen Buddies has no PRC entity, so there is no filer and no province. The mechanism is not expensive for us; it is **unavailable**. Certification is available in principle to overseas processors but costs months and five figures.

So the choice is not "file, or don't file." It is: **create the sensitive-PI transfer and be technically non-compliant with no available cure, or don't create it.**

The good news is that "don't create it" costs the business almost nothing, because the commercial value of a "real people" photo does not actually live in a frontal face. §4 is the path: it keeps real humans on the site and takes the cross-border question off the table.

The second finding matters more than the first: **Trust & Safety escalated the least tractable risk and missed the two most likely ones.** Ranked by likelihood × impact × detectability, the cross-border formality is fourth. See §7.

---

## 2. Question 1 — does the sub-100,000 exemption cover sensitive PI?

**No. The carve-out is explicit, and it is a parenthetical in the operative sentence.**

The instrument is the CAC's **《促进和规范数据跨境流动规定》** (Provisions on Promoting and Regulating Cross-Border Data Flows), effective 22 March 2024.

**Article 5(4)** — the volume exemption:

> 关键信息基础设施运营者以外的数据处理者自当年1月1日起累计向境外提供不满10万人个人信息**（不含敏感个人信息）**的〔…免予申报数据出境安全评估、订立个人信息出境标准合同、通过个人信息保护认证〕

Non-CIIO processors transferring the PI of fewer than 100,000 individuals cumulatively since 1 January are exempt from all three mechanisms — **"不含敏感个人信息", not including sensitive personal information.** The exemption is category-limited, not purely volumetric. T&S is right.

**Article 8** — and there is no floor beneath it:

> 关键信息基础设施运营者以外的数据处理者自当年1月1日起累计向境外提供10万人以上、不满100万人个人信息（不含敏感个人信息）或者**不满1万人敏感个人信息**的，应当依法与境外接收方订立个人信息出境标准合同或者通过个人信息保护认证。

"Fewer than 10,000 sensitive individuals" has no lower bound written into it. One individual is fewer than 10,000. **Article 7** puts 10,000+ sensitive individuals into full security-assessment territory. So the tiers, read literally, are: non-sensitive gets a 100,000-person free pass; sensitive gets none.

### Is a photograph of a face actually sensitive PI?

This is the weaker link in the chain, and it is where I looked hardest for a way out. I did not find a clean one.

- **PIPL Art. 28** defines sensitive PI to include 生物识别 (biometric) information.
- **GB/T 45574-2025** (《数据安全技术 敏感个人信息处理安全要求》, in force since 1 November 2025) lists 人脸 — faces — in Annex A among the common categories of sensitive PI.
- The **CAC's own plain-language Q&A of January 2026** repeats it: "人脸、基因、声纹等生物识别信息" are sensitive personal information.
- Chinese practitioner analysis generally treats 人脸信息 as covering **人脸图像** — photographs and video from which facial features *could be* extracted — not merely the extracted feature vector.

There is a respectable minority argument that biometric sensitivity should attach only to face data *processed by technical means for identification*, which a marketing photo never is. **GDPR says exactly this expressly, in Recital 51**: photographs are not automatically special-category data, and become biometric data "only when processed through a specific technical means allowing the unique identification of a natural person." If PIPL had an equivalent recital we would be fine.

It doesn't. China's authorities describe the category expansively and have not published the safe harbour. **Do not bet the company's most reputationally sensitive asset on the minority reading.** Plan against the strict one.

**Conclusion on Q1:** T&S's reading is correct and should be treated as correct.

---

## 3. Question 2 — what a standard contract actually costs a solo founder

Short answer: **it is not a form, and the real blocker is not cost — it is that the founder cannot be the filer.**

The route is governed by the **《个人信息出境标准合同办法》** (Measures on the Standard Contract for Outbound Cross-Border Transfer of Personal Information, effective 1 June 2023). What it requires:

| Step | What it actually involves |
|---|---|
| PIPIA | A written personal information protection impact assessment (PIPL Art. 55) covering legality and necessity, the scale/scope/sensitivity of the data, the risks, the overseas recipient's obligations and security measures, and the legal environment of the destination country. A substantive document, in Chinese. |
| The contract | The CAC's **mandatory fixed form**. You cannot materially alter it; supplementary terms must not conflict with it. Signed by the PRC-side processor and the overseas recipient. |
| Filing | Filed with the **provincial-level CAC within 10 working days** of the contract taking effect, with the signed contract and the PIPIA report. The provincial CAC reviews and notifies within 15 working days. Nominally a record-filing, but in practice reviewed substantively and capable of being rejected. Re-filed on material change. |

There is no official fee. A translated contract and a competently drafted PIPIA is realistically a few thousand dollars of local counsel time if you were buying it.

**The blocker.** Both the contract and the filing assume a **境内个人信息处理者** — a personal information processor inside mainland China — as one party and the overseas recipient as the other. Shenzhen Buddies is one non-Chinese founder with no PRC entity. There is no domestic party to sign as exporter and no provincial CAC that owns the filing. The route does not fail on cost; it fails on structure.

**Certification** (个人信息保护认证) is the mechanism actually designed for overseas processors caught by PIPL's extraterritorial reach, and it is available in principle — but it runs through an accredited certification body, requires a domestic representative, and is a months-long engagement costing well into five figures RMB. For three photographs it is not a real option.

**So: the cure for a 12-photo gallery is more expensive than the gallery, the business, and the founder's runway.** That, not the doctrinal question, is what should drive the decision.

---

## 4. Question 3 — the lowest-risk path that still shows real people

First, dispose of the options that don't work, because two of them look better than they are.

**Guides consenting "as counterparties rather than data subjects" — does not work as framed.** How a person is labelled has no effect on whether an outbound transfer occurred. A counterparty is also a data subject; the two are not alternatives. Consent status changes the *lawfulness of processing* (PIPL Art. 13) and defeats a portrait-rights claim (Civil Code Art. 1019), but it does not create a transfer mechanism under Art. 38. **It is necessary and it is not sufficient.**

There is, however, a real version of this idea, and it is the best lever in the whole assessment — see (b) below.

**Photographing non-Chinese-resident subjects — helps in practice, not in law.** PIPL Art. 3(1) applies to processing the PI of natural persons **within the territory** of China, regardless of nationality. A foreign tourist photographed in Shenzhen and published to Vercel is still a covered outbound transfer. What genuinely changes is the practical risk: the probability that a foreign traveller complains to the CAC about their own consented photo is approximately zero, and the politically loaded framing — *foreign-run app publishes Chinese citizens' faces to overseas servers* — is entirely absent. Real risk reduction, but be honest that it is enforcement-probability reduction, not an exemption.

**Hosting those images inside mainland China — actively worse.** It solves cross-border transfer and creates a bigger problem: serving content from mainland infrastructure pulls you toward **ICP filing (ICP备案)**, which requires a PRC entity. A foreign individual cannot obtain one. It also means maintaining two hosting stacks and two compliance stories for one website. Rejected.

**Faces-not-recognisable composition — correct, and already the policy.** A frame with no identifiable person contains no personal information at all. No PIPL question, no portrait-rights question, no consent question. This is 9 of the 12 launch photos by design and it should be 12 of 12 at launch.

### The recommended path

**(a) Ship the launch gallery with `people: 'none'` only.**
Twelve photos, zero recognisable faces of PRC residents. This is a three-photo change to a plan that was already 75% there, it unblocks the launch today, and it carries no legal surface whatsoever. Nothing in the gallery build has to change: `assertGalleryValid()` already makes an unconsented person's photo unrepresentable, and no `people: 'consented'` item exists in `src/content/gallery.ts` yet.

**(b) Put guide faces on guide profiles, not in the marketing gallery.**
This is the lever, and it is the one nobody has drawn. Look again at **Article 5(1)** of the 2024 Provisions:

> 为订立、履行个人作为当事人的合同所必需〔…〕免予〔三项要求〕

Transfers necessary to conclude or perform a contract **to which the individual is a party** are exempt — and, critically, **Article 5(1) carries no "不含敏感个人信息" carve-out.** That parenthetical appears only in 5(4), the volume limb. The scenario exemptions apply regardless of sensitivity.

A guide is a party to the guide agreement. Their photograph on their own listing is arguably necessary to perform it: travellers choose a specific human being to spend a day with in person, and recognising them at the meetup point is a literal function of the service. That is a materially stronger basis than anything available for a marketing photo, where "necessary to perform the contract" is not a claim you can make with a straight face — marketing is not performance.

I rate the profile-photo argument **reasonably arguable, not certain** — the CAC reads "necessity" narrowly and has not tested this. But it is a real basis, it covers the photos that already exist in production, and it points somewhere useful: **the frontal portrait that establishes "this is a specific trustworthy person" belongs on the profile and booking pages, where it converts a booking. The gallery only needs to show that real humans are involved.** Better law and better product, in the same move.

**(c) In the gallery, shoot people non-frontally and in-scene.**
Hands sorting components. A guide seen from behind leading someone down an aisle. A three-quarter turn, in motion, at 1600px in a busy frame. This reads unmistakably as a real person doing a real thing — which is the entire commercial payload — while being a poor candidate for the characterisation "biometric information," because no facial template can reliably be extracted from it. The trust signal survives; the sensitive-PI argument weakens sharply. Underused lever, free.

**(d) Photograph the founder.**
The founder's own face is legally free — they are simultaneously the data subject and the processor, so consent and Art. 39 notice are self-satisfying. For a solo-founder marketplace this is also plausibly the single highest-trust image available: a real, named, findable human standing behind the promise. "Founder plus guide, guide turned away or laughing in profile" gets a warm two-person photo at zero third-party risk.

**(e) Only if the founder still wants a frontal guide portrait in the gallery** — this is a one-way door (publishing) under `playbook.md` §7, so it is the founder's call, not mine. If yes, the minimum package is: the upgraded consent in §5, a separate written portrait licence, service from Supabase Storage rather than git (§6), a one-page file note recording the reasoning, and a hard cap of three individuals with a running count. That is a **small, documented, deliberate** risk rather than an accidental one — which is a genuinely different thing, both in regulatory posture and in how it reads if it ever surfaces. My recommendation is (a)–(d) at launch and revisiting (e) only when there is a PRC entity or real revenue to protect.

---

## 5. Question 4 — is the consent script sufficient for Art. 39?

**No. It is good — better than most startups have — but it is missing four of the five things Art. 39 actually enumerates.** All four are fixable in one message.

**PIPL Art. 39** requires that before an outbound transfer the processor inform the individual of: (1) the **name and contact details of the overseas recipient**; (2) the purposes and methods of processing; (3) the **categories** of personal information involved; (4) the **means and procedures for exercising PIPL rights against the overseas recipient** — and obtain **separate consent**. Where the data is sensitive, **Art. 30** adds the **necessity** of processing and its **impact on the individual's rights**. **Art. 17(1)** requires the **retention period**.

Against the current script:

| Requirement | Current script | Verdict |
|---|---|---|
| Purpose and method | "a site that helps travellers meet locals", website + Instagram | Present |
| That it leaves China | "the servers are outside China" | Present but **unnamed** — Art. 39 wants *who*, not *where* |
| Commercial use | stated | Present, and good practice |
| Withdrawal | WeChat or email | Present — but withdrawal is one right, not all of them |
| **Name + contact of overseas recipient** | absent | **Missing** |
| **Categories of PI** | absent | **Missing** |
| **Full rights + how to exercise them** | withdrawal only | **Missing** |
| **Retention period** | absent | **Missing** |
| **That refusal is free** | absent | **Missing — and this is the important one** |

The last row is not an Art. 39 item but it is the one I would fix first. A guide being asked by the platform that pays them, in person, holding a camera, is a textbook power asymmetry. **PIPL Art. 16 bars refusing service because someone declines consent that isn't necessary for that service**, and consent extracted under felt pressure is both legally weak and the precise scenario that produces the reputational post the company cannot afford. One sentence closes it.

### Recommended wording

Keep the existing design — **short spoken version to get the yes, full written version on WeChat as the record.** The spoken script can stay as it is. Replace the *written* WeChat message with the following. `team-lead` to route into `marketing/assets/CONSENT.md`; I have not edited that file.

**English:**

> I'm 〔name〕. I run Shenzhen Buddies, a website that helps foreign travellers meet locals in Shenzhen. It's operated by **Tensai Tech Inc., a company registered in Toronto, Canada** — you can reach me any time at 〔email〕 or on WeChat 〔ID〕.
>
> I'd like to use this photo 〔send the actual photo〕 on our website and on our Instagram, TikTok and YouTube accounts, to show travellers the real people behind the service. This is a commercial use.
>
> What this means for your information: the photo shows **your face**, and 〔your first name only / no name at all〕. Our website is hosted **outside mainland China — by Vercel Inc. and Supabase Inc., both in the United States** — so the photo will be stored on and shown from servers outside China. If it goes on social media, **Meta, ByteDance and Google** receive it too. We need the photo for this because a marketplace of strangers only works if travellers can see real people; the risk to you is that a photo on the public internet can be copied or saved by others, and we cannot fully undo that. We keep it until you ask us to remove it, or until we stop using it — whichever comes first.
>
> At any time you can ask me to show you what we hold about you, correct it, or delete it — including the copies held overseas. Just message me or email 〔email〕 and I'll do it and confirm back to you.
>
> **This is completely optional and separate from everything else. If you say no, or say yes now and change your mind later, nothing changes about your work as a guide with us or what you earn.**
>
> Can I use this photo? (Please reply "yes, you can use this photo" so I have a record.)

**中文:**

> 你好，我是〔名字〕，运营 Shenzhen Buddies 这个网站，帮外国游客认识深圳本地朋友。网站由 **Tensai Tech Inc.（注册地：加拿大多伦多）** 运营，你随时可以通过邮箱〔email〕或微信〔ID〕联系我。
>
> 我想把这张照片〔发送照片本身〕用在我们的网站以及 Instagram、TikTok、YouTube 账号上，让游客看到服务背后真实的人。这属于**商业用途**。
>
> 涉及你的哪些信息：这张照片包含**你的面部形象**，以及〔你的名字／不包含姓名〕。我们的网站服务器在**中国大陆境外**，由美国的 **Vercel Inc.** 和 **Supabase Inc.** 提供，所以照片会存储在境外并从境外展示。如果发布到社交平台，**Meta、字节跳动、Google** 也会接收到这张照片。之所以需要这张照片，是因为陌生人之间的平台需要让游客看到真实的人才能建立信任；对你的影响是，公开互联网上的照片可能被他人复制或保存，这一点我们无法完全撤回。我们会保留到你要求删除，或我们不再使用为止，以先发生者为准。
>
> 你随时可以要求我提供、更正或删除这些信息（**包括境外的副本**），微信或邮件〔email〕告诉我即可，我会处理并回复确认。
>
> **这件事完全自愿，并且和其他事情是分开的。你拒绝，或者现在同意以后改主意，都不会影响你在我们这里做向导的工作和收入。**
>
> 可以用这张照片吗？（麻烦回复"同意使用这张照片"，我留个记录。）

**Two structural notes on this consent:**

1. **It must be its own message.** Not a clause in the guide agreement, not a tickbox at onboarding. PIPL requires **separate consent** for sensitive PI (Art. 29) and again for cross-border transfer (Art. 39), and a photo release bundled into a contract is the specific thing that fails. `CONSENT.md` already says this and is right.
2. **Consent under PIPL and a portrait licence under the Civil Code are different instruments.** The message above handles the data-protection side. It does not by itself grant commercial image rights, which is what an Art. 1019 claim is about — see §7.1.

---

## 6. Question 5 — exposure the team has not flagged

**6.1 The `alt` text and caption are a bigger sensitive-PI risk than the face, and they are free to avoid.**
`GalleryItem` requires a non-empty `alt` and permits a `caption`, and every item carries a `location`. An alt string like *"Lin, a Shenzhen Buddies guide, at her stall in Huaqiangbei"* publishes a name, a face, a workplace and a recurring location together. **行踪轨迹 — whereabouts and tracking — is named in PIPL Art. 28 as sensitive personal information without any of the ambiguity that surrounds faces.** Where a specific named person can reliably be found is arguably more sensitive than what they look like. The rule, which costs nothing: **no real names, no identifying a person's stall/shop/employer, no pattern-of-life detail** ("every Tuesday", "her regular spot"). Describe what is in the frame, not who and where they can be found.

**6.2 A deleted photo isn't deleted — git history and immutable deployments are permanent.**
The gallery commits WebPs to `public/gallery/`. If someone withdraws, `CONSENT.md`'s ten-minute procedure removes the item from the live page but **the image file remains in git history forever**, and prior Vercel deployments stay reachable at their immutable preview URLs. PIPL Art. 47 gives a deletion right and requires withdrawal to be as easy as consent was; "we removed it from the page but it's still in the repository" does not fully honour that.

Cheap fix, using a pattern the codebase already has: **serve `people: 'consented'` images from the Supabase Storage `gallery` bucket rather than committing them** — exactly what the PRD already does for video. Then withdrawal is one bucket delete and is real. **To be precise about what this does and doesn't buy: Supabase is also overseas, so this changes nothing about the cross-border analysis.** It is purely about making deletion honest. Worth doing anyway.

**6.3 The privacy policy contains a statement that appears not to be true, and it cuts against us.**
`src/app/privacy/page.tsx:84-87` tells the public that Tensai Tech Inc. is *"a company based in Toronto, Canada **with a partner team in Shenzhen, China**."* If there is no partner team — and a solo founder implies there isn't — this is an inaccurate representation in a document whose entire function is accurate representation, which is its own compliance defect under consumer-protection and PIPL transparency norms. It also **volunteers a mainland presence**, which is the fact most likely to defeat any argument that PIPL's cross-border regime doesn't reach us. It should say what is true. Route to `engineer` as a copy fix.

**6.4 The privacy policy doesn't cover photographing people at all.**
It describes what users hand over through their account ("the personal information you give us"). A guide photographed on the street is not in that flow, and neither is any bystander. If a `people: 'consented'` item ever ships, the policy needs a short **"Photography and marketing images"** section — what we photograph, the consent process, the overseas hosting, how to get a photo removed — and `/gallery` should link to it. Not blocking while the gallery is faces-free; blocking the moment it isn't.

**6.5 The much larger cross-border exposure is the product, not the gallery.**
Every guide's avatar, profile, chat messages, reviews, booking records and payment identifiers already sit in Supabase outside mainland China. That is a continuous outbound transfer of PRC residents' personal information, at a volume that will exceed three photographs by orders of magnitude the moment the marketplace works. **If three faces require a standard contract, the platform requires one far more.** Related: **PIPL Art. 3(2)** extends the law extraterritorially to overseas processing aimed at providing services to people in China — which is what a guide-recruitment marketplace does — and **Art. 53** then requires such a processor to establish an entity or designate a representative in China and report it to the CAC. That is plausibly already engaged today.

Nobody enforces this against a pre-revenue single-guide beta, and I am **not** recommending action now. I am recommending it be written down with a trigger: **revisit when the platform has either a PRC entity, paying guides at any scale, or ~50+ registered guides** — whichever comes first. It belongs on the roadmap, not in this sprint.

**6.6 Two documents are stale in a direction that will cause a mistake.**
`company/prd/gallery.md` §4 still documents `consentRef` as *"source filename per marketing/assets/README.md"*. That is now wrong and dangerous: a founder following the PRD would paste a filename — potentially containing a real person's name — into a field that renders into a public string. `scripts/img.mjs` has since been fixed to emit an opaque ID, and `gallery.ts` enforces the `SBC-YYYY-MM-NNN` shape, so the code is right and the PRD is wrong. Separately, `CONSENT.md` lines 79–80 describe two problems as open that are now closed — the script no longer prints filenames into `consentRef`, and `marketing/assets/**` **is** gitignored (`.gitignore:54-56`). Stale warnings train people to ignore warnings. Fix both.

**6.7 One thing `CONSENT.md` over-corrects on, worth knowing so nobody panics.**
"Stranger's face recognisable → don't shoot" is the right operating rule and I would keep it. But **Civil Code Art. 1020(5)** permits unavoidably making and publishing a person's likeness when depicting a specific public environment. A bystander faintly recognisable in the depth of a wide market shot is substantially covered. Keep the strict rule at the shutter; don't discard an otherwise good photo in a panic over someone blurry in the background.

---

## 7. Risk, ranked honestly

Likelihood × impact × detectability, which is not the order this was escalated in.

| # | Risk | Likelihood | If it happens | Mitigation | Cost |
|---|---|---|---|---|---|
| 1 | **Civil Code Art. 1019 portrait rights** — the guide themselves sues or complains | Low but real: an actual plaintiff with an actual forum | Damages settle small; the reputational hit to a trust marketplace is the real cost | Written portrait licence + the §5 consent | One message |
| 2 | **Consent invalid because the guide felt they couldn't say no** | Moderate — the asymmetry is structural | Voids both the PIPL basis and the licence, and is the version most likely to become a public post | The bolded "nothing changes about your work" sentence | One sentence |
| 3 | **Name/location in `alt` or caption** creating whereabouts data | Moderate, purely through carelessness | Unambiguously sensitive PI, unlike the face question | Never name a person or their stall | Free |
| 4 | **PIPL cross-border formality (Art. 8)** — what was escalated | Enforcement probability very low: 3 faces, no China traffic, complaint-driven regime | Technically non-compliant with no available cure | Don't create the transfer (§4) | 3 photos re-shot |
| 5 | **Art. 53 domestic representative for the whole platform** | Not now; real at scale | Structural, needs an entity | Roadmap item with a trigger (§6.5) | Nothing today |

**The point of this table:** items 1, 2 and 3 are more likely than item 4, cheaper to fix than item 4, and were not what got escalated. Item 4 is the one that cannot be fixed by effort — only by not creating it.

---

## 8. What genuinely needs a Chinese-qualified lawyer

Not the gallery. Three things, each with a trigger:

1. **Before the platform has a PRC entity, paying guides, or ~50+ registered guides** — the Art. 3(2) / Art. 53 question and the cross-border basis for the *product's* data flows (§6.5). This is the one that will actually matter, and it is worth real money to get right *before* it is expensive to unwind.
2. **If anyone ever contacts the founder about a photo** — a guide, a bystander, a stallholder, or anyone official. Stop, take the photo down immediately, do not negotiate, and get local advice before responding in writing. Taking it down is not an admission and costs ten minutes.
3. **If the founder decides to publish frontal guide portraits at any scale beyond a handful** (§4 option (e) recurring, rather than as a one-off). Three photographs is a risk judgement. Thirty is a programme, and a programme needs a basis.

Everything else in this document is a business risk decision the founder is competent to make, and I have given my recommendation on each.

---

## 9. Decision requested

One decision, from the founder, because publishing is a one-way door:

**Launch the gallery with zero recognisable faces (§4 a–d), or take the documented §4(e) risk on up to three frontal guide portraits?**

My recommendation is the former. It costs three re-composed photographs, it can ship today, and (b) and (d) mean the site still shows real, specific human beings — on the pages where a face actually closes a booking.

---

```
HANDOFF
├─ TL;DR: T&S read the law right — the <100k exemption excludes sensitive PI (Art. 5(4)),
│  and a face is very likely sensitive. But the cure they identified is unavailable: a
│  standard contract needs a PRC-side filer we don't have. Answer is to not create the
│  transfer — ship faces-free, put guide portraits on profiles (Art. 5(1) contract
│  necessity, no sensitive carve-out) where they convert anyway.
├─ Confidence: high on the provisions and on the mechanism being unavailable. Medium on
│  whether an ordinary photo is legally "biometric" — genuinely unsettled in China, and I
│  recommend planning against the strict reading rather than resolving it.
├─ Open questions:
│    · Founder — §9: faces-free launch, or the documented 3-portrait risk? (one-way door)
│    · Founder — is there actually a "partner team in Shenzhen"? (§6.3 depends on it)
│    · trust-safety — §6.1 (no names/locations in alt+caption) into the review checklist
│    · engineer — §6.2 (consented images from Supabase Storage, not git), §6.3 (privacy
│      copy), §6.6 (PRD §4 + CONSENT.md stale lines)
└─ Next owner: team-lead — route the §5 consent wording into marketing/assets/CONSENT.md
   (I did not edit it), and take §9 to the founder. Nothing blocks a faces-free launch:
   src/content/gallery.ts has no people:'consented' item today.
```
