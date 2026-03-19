---
title: "Hunting Scam Domains Before They Strike with CertStream"
subtitle: "How Certificate Transparency logs can power proactive threat hunting at scale"
date: 2026-03-19
category: Projects
abstract: "Scam syndicates now deploy and retire web domains at machine speed. In this post, I share how my research team used CertStream — a real-time Certificate Transparency feed — to monitor millions of newly registered domains and detect potential scam sites before they claim their first victims."
comments: true
---

Here's something that genuinely surprised me: modern scam operations are run like software companies.

They have CI/CD pipelines. They spin up cloud infrastructure on demand. They automate the deployment of thousands of scam websites, run them briefly, then tear them down before anyone can respond. Research by [Group-IB](https://www.group-ib.com/media-center/press-releases/classiscam-2023/) shows that organised scam syndicates have adopted the same DevOps practices your favourite tech companies use — except they're using it to steal from people. Their investigation into *Classiscam*, a scam-as-a-service operation, found 38,000 members organised across Telegram groups with defined roles, using bots to spin up fake phishing pages on demand — a supply chain for fraud that earned an estimated $64.5 million across 251 brands in 79 countries.

That realisation changed how I think about cybersecurity. And it led my team to build something small, clever, and — I think — genuinely useful.

## The Problem with Playing Defence

The traditional playbook for tackling scam websites goes something like this: a victim reports a suspicious link → an analyst investigates → the domain gets flagged or taken down. Clean. Logical. Thoroughly outdated.

Here's why. A scam syndicate today doesn't need a domain to last more than a few hours. They register a new domain, run a scam campaign on it, and retire it the moment it's been accessed once — or even sooner. By the time a victim reports the link, the website is already gone. By the time an analyst looks at it, the domain resolves to nothing. The takedown request goes nowhere.

Throwing more web crawlers at the problem sounds appealing — just enumerate *all* the domains! — but that's prohibitively expensive and still fundamentally reactive. We needed a way to catch scam domains before they reach their first victim, not after.

## An Unexpected Clue in Plain Sight

Here's where it gets interesting. Modern browsers are ruthless about unencrypted or untrusted connections. Navigate to a site without a valid HTTPS certificate and you're greeted with a giant red warning page. For a scam site trying to look legitimate, that warning is a conversion killer.

This means scam domains *have* to obtain a valid HTTPS certificate. There's no way around it.

And here's the thing about HTTPS certificates: every single one is publicly logged. Certificate Transparency (CT) is an open standard that requires Certificate Authorities to record every certificate they issue into append-only public logs. The goal is accountability — anyone can audit who issued what, to whom, and when.

But as a side effect, CT logs are a live feed of every domain that is in the process of going online. Including scam domains.

[Cali Dog Security](https://calidog.io/) built [CertStream](https://certstream.calidog.io/) to make this feed accessible. It's a real-time WebSocket stream of certificate issuance events — open, free, and broadcasting millions of domain names every day. When I first heard about it, I immediately thought: *this is our early warning system*.

## What We Built

The concept is straightforward: listen to the CertStream feed, and flag any domain that looks like it could be impersonating a brand or entity we're protecting.

We express "looks like" as a set of regex patterns — one per line in a simple text file. To monitor for domains targeting a bank, you might write:

```
.*mybank.*
.*my-bank.*
.*mybank-secure.*
```

Our tool subscribes to the CertStream WebSocket, processes each incoming certificate event, strips the domain variants (with and without `www.`, `*.`, `https://`), and checks them against the compiled pattern list. Any match gets logged to a SQLite database and exported for further analysis.

The flow looks like this:

> **CT Server → WebSocket stream → sanitise domains → match regex → store hits → export for analysis**

That's it. No web crawlers. No enumeration. No waiting for a user to report anything. The scam domains come to us.

## Results

When we deployed this alongside our team's existing domain analysis tooling, the effect was immediate: we effectively **doubled our search space for suspicious domains** without proportionally increasing our workload. More importantly, we were now seeing domains at the moment of certificate issuance — which is often *before* the site is even reachable to the public.

For a Digital Risk Protection team, that's a significant shift. Instead of responding to threats, we were meeting them at the door.

## Who Should Care About This

If you're on a **Digital Risk Protection team**, this approach is directly applicable. Swap in the brand keywords you're protecting and you have a 24/7 monitoring feed that never sleeps.

If you're a **company trying to assess your own digital risk**, running this against your own brand names gives you a rough — and surprisingly sobering — sense of how actively threat actors target your identity online.

And if you're a **security researcher or student**, I'd encourage you to look at this as a template for creative problem solving: what other public, boring-sounding infrastructure quietly records everything you'd ever want to know?

The natural next step is a downstream analysis stage — an AI/ML classifier that quickly triages matches between genuine threats and false positives, either automatically or with a human in the loop. That's what we're working on next with **BrandSentinel**. Both projects are being open-sourced as a gift to the cybersecurity community, because good tools should be shared.

## What I Took Away

**1. The threat landscape moves faster than you think.** I knew scam campaigns were a problem. I didn't fully appreciate that they had industrialised to the point of using orchestration frameworks and automated infrastructure. That shift changes everything about how we need to respond.

**2. Cybersecurity rewards lateral thinking.** The instinct is to do more of what already works — bigger crawlers, more analysts. The better question is: *what does the attacker have to do that we can intercept?* CT logs were the answer hiding in plain sight.

**3. Open source makes this possible.** CertStream is a free, open initiative. Without it, building this capability would have required months of infrastructure work. The open source community quietly lowers the barrier to entry for exactly this kind of innovation, and that's worth celebrating.

---

*What other open data feeds or public infrastructure do you think are sitting underused as threat intelligence sources? I'd love to hear what you're thinking in the comments.*
