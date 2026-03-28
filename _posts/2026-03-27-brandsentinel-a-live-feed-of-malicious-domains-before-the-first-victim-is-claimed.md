---
title: "Every Scam Site Leaves One Trace Before It Goes Live. We Built a Tool to Catch It."
subtitle: "Introducing BrandSentinel: how we automated 95% of a Digital Risk Protection analyst's workload — and what we learned doing it"
date: 2026-03-27
category: Cybersecurity
abstract: "In a previous post, I showed how Certificate Transparency logs give us a real-time window into newly registered domains — including scam sites — before they go live. But surfacing suspicious domains is only half the battle. In this post, I introduce BrandSentinel: an open-source pipeline that automatically classifies those domains using an ensemble of heuristics, eliminating the majority of manual analyst work and catching threats before the first victim is claimed."
cover: /assets/images/covers/brandsentinel-cover.svg
comments: true
---

When we pointed CertStream at two Singapore banks, it surfaced over three hundred suspicious domains in a single week. No human team could triage that volume before the threats became active. So we built a machine to do it — one that classifies domains in real time, flags the dangerous ones before the first victim ever loads the page, and hands analysts a curated shortlist instead of a firehose. This is the story of how that tool came to be, what it took to build it, and what it taught us about defending brands at machine speed.

---

Before I get into the technical details, I want to take a moment to acknowledge the people who made this work possible.

During my internship, I had the privilege of learning from the Asia-Pacific Digital Risk Protection team at a leading cybersecurity company. They showed me what it really looks like to defend a brand in the wild — the volume, the pace, the judgment calls analysts make under pressure, and the genuine satisfaction of taking down a scam site before it harms someone. This project is built on everything they taught me, and I dedicate it to them.

---

## The Problem: We Found the Domains. Now What?

In [my previous post](./2026-03-19-hunting-scam-domains-before-they-strike-with-certstream.md), I described how Certificate Transparency logs — and specifically CertStream, the real-time WebSocket feed built by Cali Dog Security — give us a powerful early warning system. Every domain that obtains an HTTPS certificate is publicly logged the moment it does, and brand-targeted scam domains are no exception. That means we can see them at the point of certificate issuance, often before the site is even reachable.

The problem we were left with was a different one entirely: **volume**.

CertStream processes millions of certificate events every day. Even after filtering to domains that contain your brand keywords, you're looking at hundreds of candidates per day for a single brand. A human analyst cannot manually investigate each one fast enough for the intelligence to be actionable. By the time they've worked through the queue, the scam domains they flagged are either weaponised or gone.

We had solved the sourcing problem. We had created a new one.

## The Implication: Speed Is Not a Nice-to-Have

Let me be direct about the stakes. In threat intelligence, there are two kinds of errors. **False positives** — flagging a benign domain as malicious — waste analyst time and erode trust in the tool. Annoying, but recoverable. **False negatives** — missing a real scam domain — mean a live phishing site with your brand's logo on it is collecting victims' credentials, authorising fraudulent transactions, and destroying customer trust, with nobody at your organisation aware it exists.

False negatives are not a metric. They are harm to real people.

The implication is this: an automated classification layer that works around the clock, surfaces threats with high recall, and hands analysts only what truly requires human judgment is not a convenience — it is a prerequisite for any serious DRP operation. That is what we set out to build.

## BrandSentinel: A Live Feed of Malicious Domains

### Methodology

BrandSentinel is an open-source Digital Risk Protection pipeline. It ingests domains from multiple threat intelligence feeds continuously, classifies them using an ensemble of heuristics, and writes verdicts to per-category output files — all while the analyst monitors a live dashboard in Prefect's UI.

**Ingestion.** Ten source workers run as independent async tasks, each polling a different feed on its own schedule:

| Source | Frequency |
|---|---|
| CertStream | Live (CT log stream) |
| URLhaus | Every 5 minutes |
| PhishTank | Every 1 hour |
| OpenPhish | Every 12 hours |
| CERT Polska, Phishing.Database, Phishing Army, Botvrij.eu, DigitalSide | Configurable |
| Manual import file | Every 30 seconds |

Every domain that any source produces is placed onto a shared, deduplicated `asyncio.Queue`. If a domain has been seen before — across any source — it is silently dropped. The pipeline never processes the same domain twice.

**Filtering.** A keyword-based filter checks each domain against the brand configurations in `config.yaml`. Domains that do not contain a brand keyword are classified as `IRRELEVANT` and logged immediately. This is the first gate, and it is intentionally cheap — regex matching costs nothing compared to what comes next.

**Classification.** For every domain that passes the filter, BrandSentinel concurrently fetches the HTTP response (following redirects, capturing page content), resolves DNS records, and retrieves the TLS certificate — all in parallel. This enriched context is then passed through a pipeline of 15 heuristics.

The heuristics run lazily. If any single heuristic produces a *definitive* verdict — such as matching a known brand favicon hash on a non-canonical domain, or detecting a phishing kit directory structure — the pipeline short-circuits and assigns that verdict immediately, without running the remaining checks. For contributing signals, scores are accumulated and normalised. The final verdict is one of four categories:

- **SCAM** — High confidence. Investigate and initiate takedown.
- **INCONCLUSIVE** — Suspicious. Requires analyst review.
- **BENIGN** — Passed all checks. Continue monitoring passively.
- **IRRELEVANT** — Not related to the monitored brand. Dropped.

A few heuristics are worth calling out explicitly because they do the heaviest lifting:

- **Inactive domain**: An HTTP timeout, connection refusal, or non-200 response is a strong signal — scam domains are frequently pre-registered before they're weaponised, or already retired.
- **Parking detection**: The page content or DNS fingerprint matches a known domain parking service. These are typically benign, but they are watched — parked domains can be activated at any time.
- **Brand lookalike**: Levenshtein distance between the registered domain and the brand's canonical domain detects typosquatting and combosquatting that a keyword filter alone would miss.
- **Favicon hash matching**: A SHA-1 hash of the site's favicon is compared against a curated list of brand favicon hashes. A match on a non-canonical domain is a near-definitive SCAM signal — an attacker has copied the brand's own visual identity.
- **Forms exfiltration**: Login forms or input fields that submit to a different domain than the one being analysed are a reliable indicator of a credential-harvesting phishing page.

**Output.** Verdicts are written continuously to `scam.txt`, `inconclusive.txt`, `benign.txt`, and `irrelevant.txt`. The entire pipeline is orchestrated by Prefect, which provides a live UI for observing flow runs, retrying failed tasks, and inspecting per-domain logs without touching the terminal.

### Results

The version I am describing here is the current, fully instrumented release. But the insight that validated the approach came from something far simpler.

An early prototype ran only two heuristics: the **inactive domain check** and the **parking detection check**. No lookalike scoring, no favicon hashing, no content analysis — just those two. Even with only CertStream as the data source, the results were striking.

Of every hundred domains flagged by the brand keyword filter, roughly **ninety-five were resolved by those two heuristics alone**. The inactive check cleared out domains that had been registered but not yet deployed — or already retired. The parking check cleared out benign infrastructure that had been registered speculatively by domain investors, not attackers. What remained — the five or so domains that were live, active, and neither parked nor obviously benign — was the set that actually warranted human attention.

In operational terms, my team of DRP analyst colleagues who previously faced up to a thousand manual lookups per day was reduced to reviewing fewer than a handful. The pipeline had not replaced the analyst. It had surely given them back their day for customer engagement.

### Discussion

The two-heuristic result is encouraging, but it is not the ceiling — it is the floor. The more sources you ingest from, and the more precisely your heuristics are calibrated, the tighter the classification becomes.

This brings us back to the two-error asymmetry. **False positives** are an inconvenience: the analyst reviews a benign domain and clears it. The cost is time. **False negatives** are a failure: a scam domain is classified as benign or irrelevant and goes unactioned. The cost is victims. BrandSentinel is deliberately calibrated toward recall over precision — when evidence is ambiguous, the verdict is `INCONCLUSIVE`, not `BENIGN`. The analyst sees it. The domain does not slip through.

As research matures, more can be layered in. New ingestion sources plug in by implementing a single `Source` base class. New heuristics extend `HeuristicBase` and register themselves; the orchestrator handles the rest. Commercial feeds — URLScan.io, OTX, VirusTotal — can join the source pool without touching the classification logic. An ML-based scoring layer can replace or complement the weighted heuristic sum for teams with labelled datasets. The architecture was designed to absorb these improvements without structural change.

## Who Should Use This

**Digital Risk Protection teams** are the primary audience. BrandSentinel is not a replacement for experienced analysts — it is the triage layer that lets them work on what matters. Instead of spending their shift manually checking whether `mybank-secure-login.xyz` resolves to anything, analysts can focus on the pre-scored shortlist that BrandSentinel surfaces: live domains, with suspicious content, with brand-identical favicons, submitting credentials to a foreign server. That is a very different kind of work.

**Small and medium enterprises** are the second audience, and perhaps the more important one. Most SMEs do not have a DRP team. They may not even know how actively their brand is being impersonated online. Running BrandSentinel — even in its simplest configuration, with CertStream and a handful of brand keywords — produces a sobering and actionable picture of digital threat exposure. For an SME trying to decide whether to invest in a commercial DRP solution, that picture is exactly the evidence they need.

## What Comes Next

BrandSentinel is open source. It is a gift to the cybersecurity community, in the same spirit as the team that first gave me this perspective. If you work in threat intelligence, digital risk, or brand protection, I hope you find it useful — and I hope you make it better. Open an issue, submit a heuristic, add a feed.

The threat is automated. The defence should be too.

---

*If you're running BrandSentinel against your own brand, I'd genuinely like to hear what you find. What heuristics are generating the most signal? What sources are you missing? Leave a comment below.*
