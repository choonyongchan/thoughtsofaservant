---
title: "I Like You More! Who Wins When the Government Plays Matchmaker"
subtitle: "FirstDate pairs public officers using a 60-year-old algorithm. It picks a side, and the side may matter less than the 33 questions you answered."
date: 2026-10-04
category: Opinion
tags: [Algorithms, Game Theory, Matching, Singapore]
abstract: "FirstDate, GovTech's matchmaking pilot for public officers, runs on the Gale-Shapley stable matching algorithm. Through four imaginary singles, this post shows whom the algorithm favours, why a stable match is not always a good one, and why the decisions that matter most are made before the algorithm even runs."
cover: /assets/images/covers/i-like-you-more.jpg
comments: true
---

*This post was proofread with the assistance of AI.*

---

Every Chinese New Year, some auntie asks when you are getting married. This year the government has a more systematic answer: fill in 33 questions, verify yourself with Singpass, and let an algorithm pick your date.

That algorithm earned a Nobel Prize, and it has a quirk nobody mentions at reunion dinner. Every couple has had the "No, I like you more!" argument. The algorithm settles it by picking a side: one side has to "propose", and that side ends up with the best partner it could stably have, while the other side could get the worst. So on FirstDate, do the guys propose, or the girls?

Under one tidy condition, it doesn't matter at all. The decisions that shape your match are made before the algorithm runs, by how your 33 answers are turned into a score.

## The state is matchmaking again

FirstDate grew out of GovTech's {build} hackathon and a simple question: does having more potential matches make it easier to find a suitable one? The pilot is open to unmarried public officers aged 21 to 35. [Roughly once a month](https://www.marketing-interactive.com/no-more-endless-swiping-govtech-sets-public-officers-up-on-a-firstdate), each person receives one match and has 72 hours to accept. Contact details are shared only if both say yes. The app then suggests "date quests" to break the ice and sends a survey afterwards. It will also [never pair you with a colleague from your own agency](https://www.straitstimes.com/singapore/firstdate-will-not-match-public-officers-with-colleagues-from-same-agency-govtech) (your HR department thanks you). Applications for the pilot close on 5 October.

Maths-based matchmaking is not new here. NUS students have run the [Aphrodite Project](https://en.wikipedia.org/wiki/Aphrodite_Project) on the same algorithm since 2019. State matchmaking isn't new either: the Social Development Unit was set up in 1984 to pair up graduates, and not all Singaporeans were enthusiastic. Forty-two years on, the resident total fertility rate [fell to 0.87 in 2025](https://www.bloomberg.com/news/articles/2026-02-26/singapore-s-fertility-rate-falls-to-fresh-low-as-population-ages), a record low, down from 0.97 the year before.

Kai Xiang Teo has already written [a sharp critique of FirstDate](https://www.singapore-samizdat.com/p/how-singapores-government-run-dating-service-firstdate-works) in Singapore Samizdat. He argues that stability is not happiness, that questionnaires confuse who you are with what you want, and that the money might be better spent on third spaces. This post takes the other route in and looks at the maths.

**FirstDate is SDU's idea with a Nobel-winning algorithm inside. The interesting question is what that algorithm optimises.**

## Gale-Shapley in 60 seconds

Meet our four singles: Darren, Rohan, Jia Hui and Nadia. Each of them ranks everyone on the other side. For now, the guys propose.

The algorithm, published by David Gale and Lloyd Shapley in 1962, runs in rounds:

1. Every unmatched guy proposes to the highest-ranked girl who hasn't yet rejected him.
2. Each girl holds on to the best proposal she has received so far and rejects the rest. Holding is tentative: she can drop him if someone she prefers proposes later.
3. Repeat until nobody is rejected. Every hold becomes a match.

Suppose both guys rank Jia Hui first:

|         | 1st choice | 2nd choice |
|---------|------------|------------|
| Darren  | Jia Hui    | Nadia      |
| Rohan   | Jia Hui    | Nadia      |
| Jia Hui | Rohan      | Darren     |
| Nadia   | Darren     | Rohan      |

In round 1, both guys propose to Jia Hui. She holds Rohan and rejects Darren. In round 2, Darren proposes to Nadia, who has no other offer and holds him. Nobody is rejected, so the algorithm stops: Darren–Nadia and Rohan–Jia Hui.

![Gale-Shapley round by round: in round 1 both Darren and Rohan propose to Jia Hui, who holds Rohan and rejects Darren; in round 2 Darren proposes to Nadia, who holds him](https://raw.githubusercontent.com/choonyongchan/thoughtsofaservant/refs/heads/main/assets/images/posts/i-like-you-more/gs-rounds.svg)

The result is *stable*: no two people both prefer each other over the partners they got. Such a pair is called a *blocking pair*, two people who would ditch their matches for each other. Darren would rather have Jia Hui, but Jia Hui prefers Rohan, so there is no block.

Notice what Nadia did. She would have held Darren even if he were last on her list, because a receiver can only say yes to whoever shows up. Proposers choose; receivers settle for the best offer in hand.

**"Stable" means no two people would both rather be with each other. That is all it means.**

## Whoever proposes wins

Now change one line. Rohan prefers Nadia:

|         | 1st choice | 2nd choice |
|---------|------------|------------|
| Darren  | Jia Hui    | Nadia      |
| Rohan   | **Nadia**  | Jia Hui    |
| Jia Hui | Rohan      | Darren     |
| Nadia   | Darren     | Rohan      |

If the guys propose, Darren goes to Jia Hui and Rohan goes to Nadia. Nobody clashes, so it ends in one round. Both guys get their first choice, and both girls get their second.

If the girls propose, Jia Hui goes to Rohan and Nadia goes to Darren. Also one round. Now both girls get their first choice, and both guys get their second.

![The same four people matched two ways: when the guys propose, both guys get their 1st choice and both girls their 2nd; when the girls propose, it is the reverse. Both matchings are stable](https://raw.githubusercontent.com/choonyongchan/thoughtsofaservant/refs/heads/main/assets/images/posts/i-like-you-more/who-proposes.svg)

Both outcomes are stable. Same people, same preferences, opposite winners. Gale and Shapley proved this holds in general: among all stable matchings, every proposer gets the best partner he could stably have, and every receiver gets the worst. The stable matchings line up between these two extremes, and the choice of proposer decides which end you land on.

**The algorithm hands the advantage to whichever side proposes.**

🍽️ _In your own dating life, are you usually the one proposing or the one choosing? Has that worked in your favour?_

## Why economists love it anyway

Shapley shared the 2012 Nobel Memorial Prize in Economics with Alvin Roth, who used this family of algorithms to redesign real markets such as the US medical residency match. (Gale died in 2008, and the prize is not awarded posthumously.) Three properties explain the enthusiasm.

1. A stable matching always exists, and the algorithm finds one quickly. With 1,000 singles on each side, it needs at most about a million proposals, which a laptop clears in moments.
2. Nobody's inbox floods. The most attractive oppa in the pool holds one proposal at a time, not 400 unread likes.
3. Proposers cannot gain by lying. If you are proposing, your best strategy is to rank people honestly. Receivers are different: a receiver can sometimes do better by pretending to be pickier and cutting people off her list. Roth proved in 1982 that no stable matching mechanism can be manipulation-proof for both sides at once.

**Guaranteed stability, speed, and honesty from one side is a strong package. It is just not a romantic one.**

## The real decision happens before the algorithm

Nobody can rank every eligible public officer by hand, so FirstDate does it for you. Your 33 answers cover interests, food, travel, habits, love languages, kids, religion, hard no's and age range, and they are converted into a compatibility score for every possible partner. Sorting those scores produces the ranked list that Gale-Shapley needs.

![The FirstDate pipeline: 33 answers, weighted by designer-chosen weights, become compatibility scores, then ranked lists, then Gale-Shapley, then a match. The weighting step carries the value judgements; Gale-Shapley is the smallest step](https://raw.githubusercontent.com/choonyongchan/thoughtsofaservant/refs/heads/main/assets/images/posts/i-like-you-more/pipeline.svg)

That conversion contains a twist. If compatibility scores are symmetric (Darren's score for Jia Hui equals Jia Hui's score for Darren) and have no ties, there is exactly one stable matching, so who proposes doesn't matter. You can even find it without Gale-Shapley: pair the highest-scoring couple, remove them, and repeat.

|        | Jia Hui | Nadia |
|--------|---------|-------|
| Darren | 10      | 9     |
| Rohan  | 9       | 1     |

Darren–Jia Hui has the top score of 10, so they pair up, which leaves Rohan–Nadia with 1. Guys proposing and girls proposing both give this answer.

In practice, ties and one-sided deal-breakers (a hard "no smokers", or an age range that only one of the two satisfies) break the symmetry and bring the question back. Either way, someone has to choose the weights. How much does religion count against food? Kids against travel? Whoever sets those numbers encodes their values into thousands of love lives before a single proposal is made.

**Gale-Shapley is the least interesting part of FirstDate. The weights are where the decisions get made.**

🍽️ _If you could set only one question to 100% weight in choosing a partner, which would it be? Would your partner choose the same one?_

## Stable is not the same as good

Go back to the "whoever proposes wins" example and look inside everyone's head. Here are their compatibility scores, out of 100:

|         | Scores given                 |
|---------|------------------------------|
| Darren  | Jia Hui 10, Nadia 9          |
| Rohan   | Nadia 10, Jia Hui 9          |
| Jia Hui | Rohan **100**, Darren **1**  |
| Nadia   | Darren **100**, Rohan **1**  |

These scores produce exactly the same rankings as before. The difference is intensity: the guys barely care (10 against 9), while the girls care enormously (100 against 1). Gale-Shapley reads only the order, so it cannot see this.

![With the guys proposing, Gale-Shapley picks Darren–Jia Hui and Rohan–Nadia (guys 20, girls 2, total 22). The socially optimal matching, Darren–Nadia and Rohan–Jia Hui, totals 218. The guys gain 2 points; everyone together loses 196](https://raw.githubusercontent.com/choonyongchan/thoughtsofaservant/refs/heads/main/assets/images/posts/i-like-you-more/welfare-22-vs-218.svg)

With the guys proposing, Gale-Shapley returns Darren–Jia Hui and Rohan–Nadia. Each guy gets his first choice, and the couples score 10 + 10 + 1 + 1 = 22. Swap the partners to Darren–Nadia and Rohan–Jia Hui and the total jumps to 9 + 9 + 100 + 100 = 218. The guys lose 2 points; the girls gain 198. That better matching is stable too. Gale-Shapley never looks for it, because it asks only "would anyone break up?", never "which matching makes people happiest overall?"

Symmetric scores have their own problem. In the symmetric table above, where each couple shares one score, the stable matching totals 11 (10 + 1), yet Darren–Nadia plus Rohan–Jia Hui would total 18 (9 + 9). That better pairing is unstable, because Darren and Jia Hui (10 each way) would both rather be together. Stability can lock in a worse outcome. With symmetric scores, the stable matching is only guaranteed to capture half of the best possible total, and that bound is tight.

It is also brittle. Nudge Darren–Nadia from 9 to 10.01 and Darren now prefers Nadia. The greedy order changes, and the only stable matching becomes Darren–Nadia and Rohan–Jia Hui. A rounding difference in one answer reshuffles every couple. Rankings are most fragile exactly where people are nearly indifferent.

Ties make it worse. If every score were 5, both matchings would be stable, and the tie-break rule (alphabetical order? sign-up time?) would decide. A stable matching still exists with ties, but finding the one that matches the most people is NP-hard ([Manlove et al., 2002](https://doi.org/10.1016/S0304-3975(01)00206-7)), so in a large pool there is no known efficient way to guarantee it.

Letting people report intensity directly would backfire: once stated scores matter, everyone's preferences become "100 or 1". Ranks are harder to exaggerate. FirstDate sidesteps this by computing the scores itself, which moves the gaming to the questionnaire and the power to whoever designs it.

**A stable matching is one nobody can break. That is a different thing from one that makes people happy.**

🍽️ _Think of the person you clicked with most. Would this questionnaire have ranked them first for you?_

### Try it yourself

Start from a preset or build your own pool of up to five guys and five girls. State preferences as ranks or as points, pick who proposes, and step through one proposal at a time. Each step says who asked whom and why the answer was yes or no. At the end, the demo goes through every pair that did not end up together and shows why neither would leave for the other. That check is what "stable" means. In points mode it also searches every possible matching for a higher total. The demo adds up both partners' scores, so the symmetric totals appear doubled (22 and 36 rather than 11 and 18). It runs on the blog version of this post; elsewhere, the figures above tell the same story.

<div id="gs-demo" class="gs-demo"></div>
<script src="{{ '/assets/js/gale-shapley-demo.js' | relative_url }}" defer></script>

## The short side wins

FirstDate's pool is whoever signs up, and nothing guarantees equal numbers of men and women. Gale-Shapley still works when the sides are unequal; the long side simply has people left over. Two results decide who those people are.

The *rural hospitals theorem* says the same people are unmatched in every stable matching. Switching who proposes reshuffles the couples, never the leftovers. Add Priya and Mei Ling to our pool, both ranked below Jia Hui and Nadia by the guys, and they stay single whichever side proposes.

![Two guys and four girls. Guys propose: Darren–Jia Hui, Rohan–Nadia. Girls propose: Darren–Nadia, Rohan–Jia Hui. Priya and Mei Ling are unmatched in both](https://raw.githubusercontent.com/choonyongchan/thoughtsofaservant/refs/heads/main/assets/images/posts/i-like-you-more/short-side.svg)

[Ashlagi, Kanoria and Leshno (2017)](https://doi.org/10.1086/689869) showed that in large random markets, even one extra person on one side is enough for the short side to win, whoever proposes, and the set of stable matchings shrinks to almost one. In an unbalanced pool, who signs up matters more than who proposes.

There are fixes. Each person on the short side could hold several dates per cycle (many-to-one matching, the version used for hospitals and residents). FirstDate could ration how many of the long side enter each round, or give priority to whoever missed out last time. None of these creates more partners. They decide who bears the shortage.

**In an unbalanced pool the short side wins, and the algorithm only decides how the shortage is shared.**

🍽️ _Were you ever in a social circle where the ratio worked for or against you? Did you mistake that for your own appeal?_

## Would you settle, or wait?

FirstDate runs in monthly cycles, and nobody has to accept a match. That turns a one-shot matching into a repeated one. Formally, each person can place "myself" (wait for next cycle) in their ranking, and Gale-Shapley handles this fine: nobody is forced into a match they rank below waiting. The hard part is deciding where "myself" goes. The right threshold is what you expect from the next cycle, which makes this an optimal-stopping problem, the family behind the [37% rule](https://www.psychologytoday.com/sg/blog/a-funny-bone-to-pick/202605/dating-commitment-and-the-37-rule).

Waiting has a real benefit: a thicker pool next cycle means better matches. People also leave, by turning 36 or meeting someone at a friend's wedding, and every departure is a match that will never happen. [Akbarpour, Li and Oveis Gharan (2020)](https://doi.org/10.1086/704761) show that the best policy in such markets is to let the pool build up and prioritise people who are about to leave. FirstDate's age cap of 35 is exactly such a deadline. Should a 34-year-old get priority over a 25-year-old?

Thresholds can also be self-fulfilling. If everyone expects a better match next cycle, everyone declines, nobody pairs, and the market stalls. Search models such as [Burdett and Coles (1997)](https://doi.org/10.1162/003355397555154) predict that people end up pairing within tiers of attractiveness, with the bottom tier waiting longest. Borrowing from labour economics, I would call the result a "natural rate of singlehood": people who stay single even though each of them is behaving rationally. The short side, holding more options, has the most reason to be picky.

**Every match you decline is a bet that the next cycle will be better. When everyone makes that bet, nobody wins.**

🍽️ _What is your threshold, the point where you would rather wait than say yes? Has it risen with every app you have used?_

## Six questions for FirstDate

| Lens | Question |
|------|----------|
| Political | What is the objective: compatibility or fertility? The two could rank the same people differently. |
| Economic | What does each lasting couple cost, compared with funding the third spaces where people meet on their own? |
| Social | Filters on religion, diet or race-adjacent traits could reduce mixing across communities. Should the algorithm weigh that? |
| Technological | Can FirstDate explain a match ("you both want kids, you both hate durian")? Should you see where you ranked? |
| Legal | The PDPA does not apply to public agencies, which fall under the Public Sector (Governance) Act and government data rules instead. What consent covers dating answers and post-date surveys? |
| Environmental | "I have a match. Now what?" Date quests point at the real bottleneck: the places where a first date happens. (If the government is paying, Atlas Coffeehouse is a nice place ^_^) |

## What could replace plain Gale-Shapley

| Alternative | What it fixes | How the outcome changes | What it costs |
|-------------|---------------|-------------------------|---------------|
| Egalitarian stable matching | Proposer bias | Picks the stable matching with the lowest total rank across both sides, somewhere between the two extremes. Computable efficiently. | Nobody gets their dream match. How would you feel about being each other's mutual #3? |
| Maximum-score stable matching | Rank blindness | Picks the stable matching with the highest total score: 218 rather than 22 in our example. Also efficient ([Irving, Leather and Gusfield, 1987](https://doi.org/10.1145/28869.28871)). | "Who decides the ranks?" becomes "who decides the weights?" If users choose, everyone exaggerates. |
| Many-to-one matching | Gender imbalance | Each short-side person gets several dates per cycle, so more of the long side gets a date. | Dating fatigue on the short side. |
| Learning from feedback | Questionnaires measure what people say, not whom they click with | Post-date surveys update the weights each cycle. | Early cohorts become the experiment. Your best match is always one cycle away. |

## Where the maths stops

An algorithm can sort a pool. It cannot make two people stay. Every result above ends at the same boundary: the maths decides who meets, and the people decide everything after the first coffee.

🍽️ _If FirstDate matched you tomorrow, would you trust a national spreadsheet more than a friend's introduction? Why?_

Whether maths, chemistry or a well-meaning auntie brought your partner to you, the onus is on us to cherish the person we have been entrusted with. For it is written, "What therefore God hath joined together, let not man put asunder" (Mark 10:9).

*Cover image: [Row of cherry blossom trees-lined tunnel](https://commons.wikimedia.org/wiki/File:Row_of_cherry_blossom_trees-lined_tunnel_20210401.jpg) by Project Kei, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), cropped.*
