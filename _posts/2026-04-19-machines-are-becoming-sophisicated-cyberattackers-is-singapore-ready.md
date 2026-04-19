---
title: "Machines Are Becoming Sophisicated Cyberattackers. Is Singapore Ready?"
subtitle: "How frontier AI has rewritten the assumptions of cybersecurity overnight, and why the next chapter of this small nation's story will be written in the next twelve months."
date: 2026-04-19
category: Opinion
tags: [Opinion, Cybersecurity]
abstract: "Within 9 days in April 2026, announcements from Anthropic, OpenAI, and Singapore's own CSA revealed that frontier AI has crossed a threshold in offensive cybersecurity capability, enabling autonomous discovery of vulnerabilities at machine speed. This op-ed explains what happened, why it matters to everyday Singaporeans and SMEs, and what the nation must do urgently to turn this moment of vulnerability into a foundation of strength."
cover: /assets/images/covers/mythos-cover.svg
comments: true
---

*This post was proofread with the assistance of AI.*

---

## I. You Are Already in the Fight

Have you dismissed a software update notification on your phone this week? Clicked a link in an SMS from "DBS" about a transaction you did not make? Streamed a Korean drama on a website you had never heard of? Reused the same password across your Singpass, banking, and e-commerce accounts? You are not alone, and you have never been a more attractive target.

Last year, Singaporeans lost S$1.1 billion to scams (Cyber Security Agency of Singapore [CSA], 2025), a 70% jump from last year, bringing cumulative losses since 2019 past S$3.4 billion. A single malware-enabled cryptocurrency scam cost one victim S$125 million in a single stroke. Behind each figure is a retiree whose CPF was drained, a small business whose accounts were emptied overnight, a family whose carefully-built nest egg simply vanished.

And that was the world *before* the machines got smart.

Within 9 days in April 2026, 3 announcements landed in rapid succession, from Anthropic, OpenAI, and our own CSA, that should have dominated front pages across Singapore. They did not. Most Singaporeans scrolled past them. That omission may prove expensive.

This article explains to the everyday Singaporean what happened, why it matters to you, and what must change (quickly!) if Singapore is to emerge from the coming decade as a global hub of secure computing rather than a cautionary tale.

---

## II. A Nation Under Siege

First, let be clear-eyed about where Singapore already stood, even before frontier AI entered the picture. We were, by any reasonable measure, one of the most heavily targeted countries.

Organisations operating here faced an average of 2,272 cyber attacks per week in 2025, 17% per cent higher than the year before (CrowdStrike, 2026). Singapore was ranked the 7th most attacked country globally in the 4th quarter of 2024. SecurityScorecard found that every single one of Singapore's top 100 publicly listed companies had at least one compromised third-party provider. Phishing cases rose 49% in 2024 alone; ransomware incidents climbed 21%, hammering small and medium enterprises [SMEs] in professional services hardest of all (CSA, 2025).

The threat actors are no amateurs. Most Singaporeans will remember the 2018 SingHealth breach that exposed 1.5 million patient records, including those of Prime Minister Lee Hsien Loong, and shook public confidence in our digital systems. What fewer people know is that the pressure has only intensified since. In July 2025, CSA publicly disclosed that UNC3886, a sophisticated China-linked Advanced Persistent Threat group, had been quietly targeting Singapore's critical information infrastructure [CII] since late 2021, using zero-day exploits and rootkits designed to burrow deep into telecommunications and defence systems. In February 2026, Operation Cyber Guardian, a multi-agency response, was mounted specifically to counter UNC3886's intrusions into our telecommunications networks.

To Singapore's credit, the national architecture built to defend against these threats is genuinely formidable. CSA, established in 2015, now oversees roughly 500 personnel and enforces standards across 11 CII sectors under the Cybersecurity Act and its 2024 amendments, which expanded regulatory reach to cloud workloads, virtual systems, and third-party-owned infrastructure (Baker McKenzie, 2026). GovTech operates a round-the-clock Government Cybersecurity Operations Centre [GCSOC]. The Defence Science and Technology Agency [DSTA] builds bespoke military cyber solutions. The Digital and Intelligence Service [DIS], stood up in 2022 as the Singapore Armed Forces' [SAF] 4th service branch, consolidates digital defence, cyber operations, and intelligence under a unified command. Singapore achieved the highest tier in the International Telecommunication Union's 2024 Global Cybersecurity Index.

On paper, this is a nation that takes cybersecurity seriously. And on paper, it is well-prepared.

But paper defences are no match for what arrived in April.

---

## III. The Models That Changed Everything

On 7 April 2026, Anthropic, the American AI company behind the Claude models, announced Project Glasswing, a consortium formed with Amazon Web Services [AWS], Apple, Google, Microsoft, Cisco, CrowdStrike, NVIDIA, Palo Alto Networks, and several others. The occasion was the unveiling of Claude Mythos Preview, a frontier AI model the company had determined was too dangerous for public release (Anthropic, 2026).

What had Mythos done? Operating autonomously, without human steering, it had discovered thousands of previously unknown security flaws in every major operating system and every major web browser on earth. It found a 27-year-old remotely exploitable bug in OpenBSD, a system long considered one of the most security-hardened in the world and used to run firewalls and critical infrastructure. It unearthed a 16-year-old vulnerability in FFmpeg, a media processing tool embedded in virtually every video application on the planet, in a line of code that automated testing tools had hit 5 million times without ever catching the problem. It chained together multiple vulnerabilities in the Linux kernel, the software that runs most of the world's servers, to escalate from an ordinary user account to total control of the machine.

Anthropic was blunt about the implications: "AI models have reached a level of coding capability where they can surpass all but the most skilled humans at finding and exploiting software vulnerabilities." It then added a warning that should land with weight in every boardroom (and living room) in Singapore: "Given the rate of AI progress, it will not be long before such capabilities proliferate, potentially beyond actors who are committed to deploying them safely" (Anthropic, 2026).

The benchmarks validates the leap. On CyberGym, a standardised test of offensive cybersecurity capability, Mythos scored 83.1%, compared to 66.6% for its predecessor, Opus 4.6. On Firefox JavaScript engine exploit development, Mythos succeeded 181 times where the previous model managed just 2 across hundreds of attempts. During testing, the model broke out of its sandbox and sent an unsolicited email to a researcher, a vivid demonstration of autonomous behaviour that no one had programmed it to exhibit.

Anthropic is not alone. One week later, on 14 April, OpenAI announced GPT-5.4-Cyber, a variant of its latest model deliberately fine-tuned for cybersecurity tasks, with refusal boundaries lowered to enable binary reverse engineering and other advanced defensive workflows. OpenAI classified GPT-5.4 as "high" cyber capability under its own preparedness framework, an unprecedented admission from a company that has historically been measured about model risks. "Cyber risk is already here and accelerating, but we can act... Safeguards cannot wait for a single future threshold" (OpenAI, 2026).

The next day, on 15 April, CSA issued a formal advisory titled *Risks Associated with Frontier AI Models*. The language was measured; the message was not. These frontier AI models, the advisory noted, "can reportedly reduce the time taken to identify vulnerabilities and engineer exploits, cutting short the duration from months to hours" (CSA, 2026). CSA urged organisations to patch every high-critical vulnerability on internet-facing systems, enforce multi-factor authentication across all administrative interfaces, review cloud configurations, segment networks against lateral movement, and deploy AI-powered vulnerability detection of their own.

Anthony Grieco, Cisco's Chief Security and Trust Officer and a Glasswing partner, captured what those 9 days had accomplished: "AI capabilities have crossed a threshold that fundamentally changes the urgency required to protect critical infrastructure from cyber threats, and there is no going back. The old ways of hardening systems are no longer sufficient" (Anthropic, 2026).

Within a single week, the most sophisticated offensive cybersecurity capabilities, the kind that once required nation-state resources and years of elite training, became replicable by any computer running autonomously, in hours, for the cost of cloud computing credits.

---

## IV. Singapore's Hand: Strong Cards, Structural Gaps

Given what is now arriving, how does Singapore stand?

The genuinely good news is that we enter this new era better prepared than almost any comparable nation. The institutional architecture described above is real, not ornamental. Beyond it, the DIS Sentinel Programme trains approximately 800 students annually in penetration testing, network forensics, and, from this year, applied AI-for-cyber modules, developed with AI Singapore (Ministry of Defence [MINDEF], 2025). Budget 2026 committed to training 100,000 AI-savvy workers by 2029 and offered citizens on training courses 6 months of free access to premium AI tools. Singapore has invested over S$400 million in quantum technology through 2030, including Singtel's quantum key distribution network, a hedge against the day AI-accelerated cryptanalysis makes conventional encryption obsolete.

Diplomatically, Singapore chaired the United Nations Open-Ended Working Group on ICT Security from 2021 to 2025, hosts the ASEAN-Singapore Cybersecurity Centre of Excellence, and has trained more than 900 senior ASEAN officials. By any reasonable standard, we are a regional leader.

But honesty demands we name the weaknesses too. Four stand out.

*1. Talent*. Singapore's cybersecurity workforce grew from roughly 4,000 professionals in 2016 to 12,000 in 2022 — yet approximately 4,000 positions remain unfilled. Cybersecurity job postings rose 57% from 2024 to 2025. The Ministry of Manpower has placed cybersecurity roles on its 2026 Shortage Occupation List, a tacit admission that domestic supply cannot meet demand. Worse, the shortage is no longer merely about headcount. The SANS Institute's 2026 Cybersecurity Workforce Research Report, which featured CSA as a case study, found that, for the first time, skills gaps have overtaken headcount shortages as the industry's top workforce challenge, with AI-for-cyber the single largest deficit (SANS Institute, 2026). Bitdefender's 2025 assessment found that 64% of Singapore's cybersecurity professionals are experiencing burnout, and 53% plan to leave their roles within a year, both figures well above global averages (Bitdefender, 2025). A nation cannot defend itself with exhausted people heading for the exit.

*2.Vendor dependence*. Not a single Singapore-based company sits among the 12 Project Glasswing launch partners. Our cybersecurity ecosystem, while growing, remains heavily reliant on American, Israeli, and European security products. The CyberSG R&D Programme Office at Nanyang Technological University [NTU] has received S$62 million, a respectable sum, but modest next to the US$29.5 million DARPA spent on its AI Cyber Challenge alone, or the US$4.4 billion in venture funding that flowed into Israeli cybersecurity in 2025 (NTU Singapore, 2023; Ynet News, 2025). We largely buy our defence from abroad. In an era of sharpening great-power competition, that dependency is strategic vulnerability.

*3. The quiet nationalisation of frontier AI itself*. Analysts strategic think tanks have predicted and are starting to observe that major global powers are increasingly treating their most capable AI models as sovereign assets, tools reserved for national decisions on economics, defence, and intelligence, and wielded as diplomatic levers to draw smaller states into alignment. The evidence is already on the record. The United States' January 2025 AI Diffusion Framework placed 120 countries, Singapore among them, into a three-tier system capping advanced AI chip imports, and, for the first time, applied formal export controls on the model weights of the most capable AI systems themselves, through a new Export Control Classification Number for AI models (CSIS, 2025). Enforcement actions across 2025 and 2026 specifically targeted entities in Singapore and Malaysia alleged to have diverted restricted Nvidia chips onward to China, with Washington pressuring regional governments to tighten their own licensing regimes (Sun, 2026). Anthropic itself framed its Project Glasswing partnership as a reason why "the US and its allies must maintain a decisive lead in AI technology" (Anthropic, 2026), language that makes plain how cybersecurity capability is now inseparable from great-power AI strategy. For all Singapore's computing and policy prowess, it enters this contest as a middle power. Full sovereign control of the AI stack, from compute to foundation models to the cybersecurity applications that sit on top of them, lies beyond Singapore's reach (Cambrian Research, 2025). The realistic strategy is not to match superpowers on their own terms but to preserve agency within Singapore's competition: investing in targeted sovereign capabilities where scale permits, diversifying access pathways across multiple vendors and jurisdictions, and refusing the pressure toward simple alignment that an AI-bifurcated world will increasingly exert.

*4. The softest target of all: the citizen, the small business, the household*. Which is where this story stops being abstract.

---

## V. Why This Is Personal

Before we discuss national policy responses, an uncomfortable conversation is overdue, one aimed squarely at the reader.

Have you been delaying the software updates on your phone and your laptop, the ones that pop up at inconvenient moments and that you dismiss with a sigh? Those updates are not cosmetic nor corporate trickery. They patch precisely the kind of vulnerabilities that Mythos has now proven a machine can discover in hours, at scale, autonomously. Every unpatched device is an open door. CSA's April 15 advisory is explicit: "AI-powered attacks can weaponise newly disclosed vulnerabilities within hours of publication, making rapid patch deployment critical to preventing mass exploitation" (CSA, 2026). You are no longer racing human hackers working weekends. You are racing AI models that never sleep.

Have you clicked a link in a Telegram or Instagram advertisement promising cheap branded hauls, flash-sale sure-win Pokemon boster packs, or unbelievable investment returns? AI-generated phishing messages already achieve click-through rates of 54%, compared to 12% for human-crafted attempts. The spelling errors and awkward phrasing that used to be telltale signs are gone. Frontier models write in fluent, contextually appropriate English, Mandarin, Malay, and Tamil. They adapt to Singaporeans' profiles, browsing histories, and social graphs. The next "DBS™ bank notification" you receive may have been optimised by AI to look exactly like something you would trust.

Have you streamed a drama on a website that was not Netflix, Viu, Disney+, or mewatch, but a "free" site cluttered with pop-ups and auto-playing advertisements? Such sites are among the most reliable distribution channels for malware in Southeast Asia. The moment a frontier AI model is used to engineer a novel browser exploit, every visitor to such a site becomes a potential victim of a drive-by compromise that needs no click, no download, no consent. Your device is infected by the mere act of loading the page.

Have you reused the same password across your Singpass, your bank, your Shopee and Lazada accounts, and your work login? A single credential breach, combined with an AI-accelerated credential-stuffing attack, is now sufficient to drain accounts, impersonate you on social media, and extract sensitive data from your employer. The attacker no longer needs to target you specifically. The attacker targets everyone, simultaneously, at machine speed, and you happen to be in the snare.

This is what changes when the machines learn to hack: the cost of carelessness rises precipitously, and the margin for error collapses.

Small and medium enterprises [SMEs], which form the backbone of Singapore's economy, face this same dynamic at organisational scale, and with far higher stakes. CSA data shows that over 80% of organisations, many of them SMEs, suffer at least one cyber incident annually (CSA, 2025). The World Economic Forum [WEF] projects the global economic impact of cyberattacks will surge from US$8.44 trillion in 2022 to US$23.84 trillion by 2027. SMEs, lacking dedicated security teams, proper budgets, or specialist expertise, will absorb a disproportionate share of that damage (World Economic Forum, 2024). A single successful ransomware attack can close a neighbourhood clinic, a family-owned home catering business, or a third-party vendor whose breach cascades up into the multinational bank it services.

The new Cyber Resilience Centre, offering SME helplines, diagnostic clinics, and CISO-as-a-Service, is a step forward. Three homegrown startups, AgileMark, Scantist, and StrongKeep, backed by the S$20 million CyberSG TIG Centre at the National University of Singapore [NUS], are building affordable, accessible tools tailored for exactly this segment (CyberSG TIG Centre, 2026). These are the right instruments. The question is whether they reach the SMEs at Woodlands and Ubi as quickly as they reach the MNCs at Raffles Place, and whether SME owners recognise the urgency before an attack, rather than after one.

---

## VI. Crisis as Catalyst: Three Imperatives

There is a version of this story that ends badly: a nation well-prepared for yesterday's threats but overwhelmed by tomorrow's. There is another version, arguably more consistent with Singapore's historical instinct, in which an external shock catalyses transformation that would otherwise have taken a decade.

Singapore has done this before. The abrupt withdrawal of British forces in 1968 forced the creation of a national defence capability from scratch, giving rise to the Singapore Armed Forces. The SARS crisis of 2003 produced a public health infrastructure whose value was proven during COVID-19. Perpetual water dependency drove investment in NEWater and desalination that made Singapore a global model for water security. In each case, a perceived vulnerability became the foundation of a national strength.

Frontier AI in cybersecurity presents the same structural opportunity, if Singapore moves with the urgency the moment demands. Three imperatives stand out.

**1. Build the local cybersecurity workforce as a national project, not a market outcome.** The DIS Sentinel Programme, today training 800 students per year, should be scaled to 2000 or more, with structured post-National-Service pathways directly into private-sector cybersecurity careers. The model to study is Israel's Unit 8200, whose alumni form the nucleus of a multi-billion-dollar cybersecurity industry, representing only 7% of Israel's tech sector by number but attracting 36% to 38% of total tech investment (Startup Nation Central, 2025). Defence Cyber Chief Colonel Clarence Cai put the imperative clearly when the Sentinel Programme announced its new AI modules: "Cyber operations are already being transformed by AI. There is a need for Sentinel Programme, as a cyber youth programme, to prepare a new generation of defenders who are grounded in the fundamentals of cyber and also able to reflexively use AI for cyber operations" (MINDEF, 2025). Minister of State for Defence Desmond Choo, addressing the largest-ever cohort of Senior Military Experts in January 2026, added what should be this decade's organising principle: "People remain our decisive advantage" (MINDEF, 2026).

CSA has trained over 22,000 individuals since 2020 (SANS Institute, 2026). The next 22,000 thousand must be trained in half the time, with applied AI-for-cyber skills at the core, or Singapore will find itself defending against machine-speed threats with human-speed teams.

**2. Create non-negotiable urgency for both SMEs and citizens.** CSA's advisory recommendations are not suggestions. They are survival instructions. A national SME Cyber Voucher programme, modelled on the existing Productivity Solutions Grant, could subsidise AI-powered endpoint protection, managed security operations, and automated vulnerability scanning for SMEs with fewer than 200 employees. The cost would be a small fraction of the S$1.1 billion Singaporeans already lose to scams every year.

For citizens, CSA's existing outreach must be equally direct. Update your devices when prompted. Do not click on links in unsolicited messages, no matter how authentic they appear. Do not stream from pirate sites. Use unique, strong passwords. Enable two-factor authentication on every account that offers it. Report suspicious activity to ScamShield without delay. These are not IT department problems. In the age of frontier AI, they are civic duties, on the same plane as locking your HDB flat door at night.

**3. Position Singapore as the world's most secure computing hub.** This is not merely defensive; it is economic strategy. As Anthropic commits US$100 million in usage credits through Project Glasswing and OpenAI scales its Trusted Access for Cyber [TAC] programme, the global market for AI-secured infrastructure is forming in real time. Singapore's strengths: regulatory maturity, data-centre density, a projected cybersecurity market reaching US$6.41 billion by 2031, and geopolitical neutrality, make it the natural home for organisations that demand both connectivity and demonstrable security.

But "demonstrable" is the operative word. The provisions for Entities of Special Cybersecurity Interest and Foundational Digital Infrastructure in the amended Cybersecurity Act should be commenced as soon as practicable, not stretched across a multi-year timeline (Baker McKenzie, 2026). CSA's March 2026 announcement that the Centre for Strategic Infocomm Technologies [CSIT] will develop indigenous threat detection tools for critical infrastructure owners is a welcome signal of sovereign ambition, but the resourcing must match the ambition. And Singapore should actively seek partnership or observer status in initiatives like Project Glasswing; not because it needs access to Mythos itself, but because the intelligence-sharing, standard-setting, and advance warning such partnerships confer are worth more than any single tool.

---

## VII. The Choice Before Us

Anthropic's own Project Glasswing announcement concluded with a sentence that deserves quoting at full weight: "The work of defending the world's cyber infrastructure might take years; frontier AI capabilities are likely to advance substantially over just the next few months. For cyber defenders to come out ahead, we need to act now" (Anthropic, 2026).

Singapore has every ingredient required to lead: institutional maturity, regulatory sophistication, a highly educated workforce, a government that moves quickly when it chooses to, and a citizenry that has historically responded to existential challenges with pragmatism and resolve. What remains is the choice to treat this moment as what it actually is, not a technical problem for IT departments, but a national challenge that demands a national response.

So here is the call, plainly stated, to every reader of this article.

**To Government:** fund the Sentinel Programme's expansion, accelerate the remaining Cybersecurity Act provisions, bankroll an SME Cyber Voucher scheme, and pursue a seat at the international table where the rules of AI-enabled security are being written.

**To businesses, especially SMEs:** assume breach, patch everything, enforce multi-factor authentication (or stronger Identity and Access Management [IAM]), segment your networks, adopt the affordable locally-built tools that the CyberSG TIG Centre has already brought to market, and do not wait for an incident to force the investment.

**To every Singaporean reading this:** update your devices tonight, stop clicking unknown links, stop streaming from shady sites, use different passwords for different accounts, turn on two-factor authentication, and understand, as clearly as you understand that your HDB door needs to be locked when you leave home, that digital hygiene is now a matter of national security as much as personal security.

AI models are already at the gates. The question is no longer whether Singapore will be targeted, it already is, 2,272 times a week, but whether each of us, in our role, will act before the window closes.

The clock is running. It does not run slowly.

---

### References

Anthropic. (2026, April 7). *Project Glasswing: Securing critical software for the AI era.* https://www.anthropic.com/glasswing

Baker McKenzie. (2026, March 31). *Singapore: Cybersecurity licensing framework updates, new threat detection tools.* https://www.bakermckenzie.com/en/insight/publications/2026/03/singapore-cybersecurity-licensing-framework-updates-threat-detection-tools

Bitdefender. (2025). *2025 Cybersecurity Assessment Report: Singapore findings.* Bitdefender.

Cambrian Research. (2025, August 11). *Singapore's AI Strategy and the Limits of Digital Sovereignty.* https://cambrianr.substack.com/p/singapores-ai-strategy-and-the-limits

Centre for Strategic and International Studies. (2025, April 2). *Understanding U.S. allies' current legal authority to implement AI and semiconductor export controls.* https://www.csis.org/analysis/understanding-us-allies-current-legal-authority-implement-ai-and-semiconductor-export

CrowdStrike. (2026). *2026 Global Threat Report: AI accelerated adversaries.* https://www.crowdstrike.com/en-us/press-releases/2026-crowdstrike-global-threat-report/

Cyber Security Agency of Singapore. (2025). *Singapore Cyber Landscape 2024/2025.* https://www.csa.gov.sg/resources/publications/singapore-cyber-landscape-2024-2025/

Cyber Security Agency of Singapore. (2026, April 15). *Advisory on risks associated with frontier AI models.* https://www.csa.gov.sg

CyberSG TIG Centre. (2026, March 23). *Singapore cybersecurity firms showcase SME-focused innovations to counter rising cyber threats at RSAC 2026 Conference.* Media OutReach Newswire.

Ministry of Defence, Singapore. (2025, November 28). *SAF expands Cybersecurity Student Talent Development Programme to include AI skills in 2026.* https://www.mindef.gov.sg/news-and-events/latest-releases/28nov25-nr2/

Ministry of Defence, Singapore. (2026, January 21). *Speech by Minister of State for Defence, Mr Desmond Choo, for the 30/26 SAF Senior Military Expert Appointment Ceremony.* https://www.mindef.gov.sg/news-and-events/latest-releases/21jan26-speech/

NTU Singapore. (2023). *S$62 million CyberSG R&D Programme Office.* https://www.ntu.edu.sg/news/detail/sgd62-million-cybersg-r-d-programme-office

OpenAI. (2026, April 14). *Trusted access for the next era of cyber defense.* https://openai.com

SANS Institute. (2026). *2026 SANS GIAC Cybersecurity Workforce Research Report.* SANS Institute.

Startup Nation Central. (2025). *Israeli cybersecurity is defining the future in 2025.* https://startupnationcentral.org/hub/blog/israeli-cybersecurity-is-defining-the-future-in-2025/

Sun, M. (2026, April). *Manacled Manus: The limits of "Singapore washing" for China AI. Asia Times.* https://asiatimes.com/2026/04/manacled-manus-the-limits-of-singapore-washing-for-china-ai/

World Economic Forum. (2024). *Global Cybersecurity Outlook 2024.* WEF.

Ynet News. (2025). *Record $4.4B flows into Israeli cybersecurity as global VCs outpace locals in 2025 boom.* https://www.ynetnews.com/business/article/rjggjusz11g

---

*The views expressed are the author's own.*
