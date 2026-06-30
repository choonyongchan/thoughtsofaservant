---
title: "From Apple Trees to Search Trees: Optimising Classical AI to Overcome TicTacToe"
subtitle: "Seven algorithms, each a sharper answer to the same question: how to play a perfect game without drowning in possibilities."
date: 2026-06-30
category: Algorithms
tags: [Algorithms, AI, Classical AI, TicTacToe]
abstract: "TicTacToe on an n×n board is computationally intractable. Classical AI's answer: convert the game into a search problem, then search intelligently. This post walks through a seven-algorithm progression from naïve MiniMax to Best Node Search; And the heuristic trap that caught me by surprise along the way."
cover: https://upload.wikimedia.org/wikipedia/commons/4/48/The_Apple_Tree._%2810056%29_%28NBY_417979%29.jpg
comments: true
---

*This post was proofread with the assistance of AI.*

---

[Last time](https://choonyongchan.github.io/thoughtsofaservant/algorithms/i-ruined-tictactoe-for-my-children-and-for-math/), I handed a 4×4 TicTacToe board to children at a volunteering centre, changed the win condition to 3-in-a-row, and watched a familiar game become genuinely hard. I also showed why that hardness is not superficial: the number of reachable game states grows exponentially, early wins make closed-form analysis intractable, and even counting unique board positions requires a full recursive search.

That is where AI begins. Classical AI's answer: **treat the game as a search problem**. Define it formally, build a tree of future possibilities, search it intelligently. This post traces how that idea evolved, from the naïve depth-first search a first-year student might attempt, through seven algorithms, to what actually powers modern chess engines.

---

## Formalising the game: START

Before we can search, we need a language for the problem. Every search problem fits a five-part structure. I remember it as **START**: **S**tate, **T**ransition, **A**ction, **R**eward, **T**erminal.

**State** $s$ is a mathematical snapshot of the game at a moment in time. A 3×3 board becomes a 3×3 matrix:

```
 X | O | .         [["X",  "O",  null],
---+---+---   →     [null, "X",  null],
 . | X | .          [null, null, "O" ]]
---+---+---
 . | . | O
```

State design is an art. Include too little and the agent cannot distinguish situations that call for different moves. Include too much (weather, room temperature, a player's hydration level...) and the search space balloons needlessly. In AI, a game where both players see the entire board is *fully observable* (TicTacToe, Chess); one where players see only a portion is *partially observable* (poker, autonomous driving). TicTacToe is fully observable, which keeps the state simple. The set of all possible states is the *State Space*. For TicTacToe it is finite, and for larger boards it is exponentially large.

**Transition** $T$ describes how state $s$ becomes $s'$: place an X on the top-left cell, and $\text{matrix}[0][0]$ goes from `null` to `X`. A useful sanity check: the number of null cells must drop by exactly 1 at each transition. Simple invariants like this catch implementation bugs before they compound.

**Action** $A(s)$ is the set of legal moves from state $s$, that is the occupation of any one empty cell in TicTacToe. The full set across all states is the *Action Space*, but not every action is legal in every state.

**Reward** $R(s)$ (alternatively, $R(s, a)$/$R(s, a, s')$) assigns a numerical value to states or sequences so the agent can prefer some paths over others. For TicTacToe, the simplest choice is a terminal score: $+1$ for a win, $-1$ for a loss, $0$ for a draw. I will revisit reward design below (spoiler: it is easier to get wrong than it looks).

**Terminal** defines when search stops: $k$ consecutive marks in a line, or a full board with no winner.

---

## The search tree

With the game formalised, the search becomes a tree. The root is the empty board. Each edge is a legal action. Each child is the resulting board.

```
              [empty board]
            /       |        \
     [X:top-L]  [X:centre]  [X:top-R]  ...  (9 branches)
     /      \
[O:top-M]  [O:centre]  ...                   (8 branches each)
```

Let $b$ be the branching factor and $d$ the maximum depth. Total leaf nodes: $O(b^d)$.

For 3×3 TicTacToe: $9! = 362{,}880$ nodes. Fine.  
For 5×5 TicTacToe: $25! \approx 1.6 \times 10^{25}$ nodes. Not fine.

Every algorithm below is an attempt to search *less* of this tree while arriving at the *same* answer.

---

## The algorithm chain

These seven algorithms are not a menu of alternatives. They are a chain: each one identifies the precise weakness of its predecessor and fixes it.

### 1. MiniMax

![MiniMax game tree — squares maximise, circles minimise, values propagate from leaves to root](https://upload.wikimedia.org/wikipedia/commons/6/6f/Minimax.svg)
*Square nodes maximise; circle nodes minimise. Terminal values ($+1$, $0$, $-1$) propagate upward.*

MiniMax adapts depth-first search for two-player zero-sum games. One player (the *maximiser*, X) drives the terminal score up; the other (the *minimiser*, O) drives it down. Terminal nodes receive $+1$, $-1$, or $0$. Internal nodes take the max or min of their children:

$$
v(s) = \begin{cases}
R(s) & \text{if } s \text{ is terminal} \\
\max_{a \in A(s)}\, v(T(s, a)) & \text{if maximiser's turn} \\
\min_{a \in A(s)}\, v(T(s, a)) & \text{if minimiser's turn}
\end{cases}
$$

The result is optimal play against a perfectly rational opponent. The cost: every node, $O(b^d)$ of them (with patience — lots of patience).

### 2. Alpha-Beta Pruning

![Alpha-Beta pruning — crossed-out branches are safely skipped](https://upload.wikimedia.org/wikipedia/commons/9/91/AB_pruning.svg)
*Crossed-out subtrees cannot change the root value regardless of their contents.*

Alpha-Beta pruning keeps MiniMax's exact guarantees while ignoring subtrees that cannot affect the result. It tracks two bounds:
- $\alpha$ — the best score the maximiser has secured so far (lower bound)
- $\beta$ — the best score the minimiser has secured so far (upper bound)

When $\beta \leq \alpha$, the branch is cut. The minimiser would never allow a result this good for the maximiser, so searching further is pointless.

With perfect move ordering — best moves explored first — complexity drops from $O(b^d)$ to $O(b^{d/2})$. A search that would take 100 hours now takes 10.

### 3. NegaMax

A sharp observation: for zero-sum two-player games, the maximiser and minimiser are doing the same thing in opposite directions. If we negate the returned score whenever the active player switches, both players become maximisers of their own perspective:

$$v(s) = \max_{a \in A(s)}\bigl(-v(T(s, a))\bigr)$$

Same search tree explored. Fewer variables. One recursive case instead of two.

(As software engineers, we know how it feels when the codebase becomes excessively complicated. The KISS principle is just like a first kiss, bringing warmth and comfort to our hearts.)

### 4. Scaled Rewards: a warning

An appealing idea: reward faster wins more than slower ones. Score a 5-move win as $+1.0$ and a 7-move win as $+0.8$, incentivising the search toward quicker victories.

The problem is subtle. In plain MiniMax with reward space $\{-1, 0, +1\}$, finding a $+1$ terminal means the absolute best outcome is secured. Search at that node stops. With scaled rewards, finding $+0.8$ does not justify stopping: there might be a $+1.0$ elsewhere via a faster path. The algorithm must now confirm it has the *fastest* win, not merely *a* win.

The heuristic changed the question from "find any win" to "find the fastest win." The latter is strictly harder. A heuristic designed to shrink the search made it larger. Measure before assuming.

### 5. NegaScout

Alpha-Beta prunes when $\beta \leq \alpha$. NegaScout increases the chance of this condition holding.

If the first move explored at a node really is the best, then every sibling only needs to be confirmed *worse*, the exact alpha-beta values are unnecessary. NegaScout searches siblings with a *null window* $[\alpha,\, \alpha+1]$ rather than the full window $[\alpha, \beta]$:

```
Standard window:   [α ─────────────────── β]
Null window:       [α ─ α+1]
```

A null-window search triggers far more cutoffs. If the sibling falls inside the window, it is confirmed inferior (= move on). If it exceeds the window, the first-move assumption was wrong and a full re-search is needed.

NegaScout is fast when move ordering is good and degrades gracefully when it is not. Its efficiency is entirely dependent on exploring the best move first.

### 6. MTD(f)

MTD(f) takes the null-window idea to its conclusion: use *only* null-window searches, always, via binary search over the true minimax value.

Starting from a guess $f$, it calls NegaMax with window $[f, f+1]$. Each call returns a lower or upper bound on the true value. Successive calls narrow the interval until the bounds meet:

$$\text{repeat until } \ell = u: \quad \text{NegaMax}([f,\, f+1]) \to \text{new bound; update } \ell,\, u,\, f$$

Because every call is a null-window search, every call benefits from maximum pruning. The tradeoff: multiple passes revisit parts of the tree. A *transposition table*, a cache of already-seen positions, is not optional; without it, re-searches undo the savings entirely.

### 7. Best Node Search

Rather than finding the *value* of the best move, why not just identify *which move is best*? That is a strictly weaker question, and sometimes easier to answer.

Best Node Search iteratively guesses a threshold and counts how many moves score above and below it:

```
Guess 0.23 →  11 worse,  9 better
Guess 0.43 →  20 worse,  0 better
Guess 0.33 →  18 worse,  2 better
Guess 0.38 →  19 worse,  1 better  ← one candidate remains above threshold
```

Once only one move exceeds the threshold, that move is optimal by elimination. BNS achieves strong performance in large search spaces precisely because it stops asking "how good is this?" once the contest between top candidates is settled.

---

## Iterative Deepening: the crosscutting technique

NegaScout requires good move ordering. MTD(f) and BNS need a good initial value. Iterative Deepening supplies both.

Run a complete search to depth 1. Use the best move found. Search to depth 2 using that result. Continue.

Revisiting shallower depths looks wasteful, but the overhead factor is only $\frac{b}{b-1}$, a constant — because the final depth dominates the total node count exponentially. The payoff: the best move from depth $d$ becomes the first move explored at depth $d+1$, giving NegaScout exactly the move ordering it needs; the minimax value from depth $d$ becomes MTD(f)'s and BNS's starting guess at depth $d+1$.

Iterative Deepening doesn't make any single algorithm asymptotically faster. It makes the whole family work better together.

---

## Putting numbers to the theory

All algorithms were run as both players from the opening move, with a 1-hour wall-clock timeout. States visited counts total traversals including re-visits through the transposition table; timeout entries show progress at cutoff, not the full game-tree size.

| Algorithm | 3×3, k=3 | 4×4, k=3 | 4×4, k=4 | 5×5, k=5 |
|---|---|---|---|---|
| | *states / s* | *states / s* | *states / s* | *states / s* |
| MiniMax | 618,184 / 8.57 | TIMEOUT | TIMEOUT | TIMEOUT |
| MiniMax with Alpha-Beta Pruning | 21,652 / 0.30 | 42,340 / 19.13 | TIMEOUT | TIMEOUT |
| NegaMax | 24,698 / 0.34 | 282,469 / 132.45 | TIMEOUT | TIMEOUT |
| NegaScout | 45,801 / 0.68 | 390,989 / 350.56 | TIMEOUT | TIMEOUT |
| Best Node Search (BNS) | 58,226 / 0.81 | 2,553,446 / 2809.92 | TIMEOUT | TIMEOUT |
| Best Node Search + Iterative Deepening | 7,171 / 0.17 | 125,484 / 42.51 | 958,872 / 376.01 | TIMEOUT (11.4M) |
| MTD(f) | **1,817 / 0.04** | 113,351 / 6.29 | **196,677 / 19.43** | TIMEOUT (9.7M) |
| MTD(f) + Iterative Deepening | 5,297 / 0.15 | **40,377 / 13.39** | 265,719 / 147.50 | TIMEOUT (13.7M) |

**n is the binding constraint, not k.** The jump from 3×3 to 4×4 with k=n kills every algorithm except MTD(f). Alpha-Beta Pruning goes from 21K states to timeout; NegaScout and BNS never finish. Dropping k from 4 to 3 on the same 4×4 board rescues Alpha-Beta Pruning: 42K states in 19 seconds instead of timeout. At 5×5, k barely matters — the 25-cell branching factor overwhelms any depth reduction from an earlier win condition, and every exact solver times out regardless of k.

**MTD(f) wins by a large margin — even accounting for re-visits.** MTD(f) makes multiple passes over the tree, so its states-visited count includes states looked up more than once via the transposition table. Even so, it visits 1,817 states on 3×3 against Alpha-Beta Pruning's 21,652: a 12× reduction. On 4×4 k=4, it is the only algorithm to finish at all, in 19 seconds against BNS + Iterative Deepening's 376. The null-window bisection prunes so aggressively on each pass that the multi-pass overhead is more than recovered.

**Theory and benchmarks diverge for NegaScout and BNS.** Both are theoretically stronger than Alpha-Beta Pruning in the general case. On 4×4 k=3, Alpha-Beta Pruning visits 42K states in 19 seconds. NegaScout visits 391K in 350 seconds. BNS visits 2.5M in 2,800 seconds. The bottleneck is move ordering: both algorithms incur large overhead when moves aren't explored best-first, because the null-window re-searches trigger frequently. A simpler algorithm with decent ordering outruns a sophisticated one without it. Theory describes best-case behaviour; these benchmarks measure actual behaviour.

Note that timeout occurred even at a very shallow depth, limiting our evaluation of iterative deepening. I believe that with more resources and a deeper search, algorithms using iterative deepening (i.e. MTD(f) and Best Node Search for our experiment) would demonstrate their asymptotic behaviour and the relative effectiveness of their strategies more strongly.

---

## What I learnt

**1. Progress is cumulative.** MiniMax feels almost trivially simple: explore every state, propagate values upward. But Alpha-Beta has no foundation without it. NegaScout has no foundation without Alpha-Beta. MTD(f) builds on NegaScout. Each algorithm is a targeted fix to a precisely identified weakness, not a replacement of what came before. The pattern generalises: the great discoveries in any field are rarely isolated flashes of genius but iterations on a preceding idea that someone took seriously enough to examine closely. I have learnt not to trivialise incremental wins.

**2. Heuristics are not the enemy; bad heuristics are.** The Scaled Rewards example is easy to misread as a reason to distrust heuristics. The actual failure was simpler: the heuristic changed what was being optimised without anyone noticing. That is a calibration problem, not an indictment of the approach. 

When accuracy is the bottleneck: medical diagnostics, logistics routing, you search more thoroughly. When time is the bottleneck: autonomous driving, real-time systems, a good-enough answer in 50ms beats a perfect answer in 5 seconds. Leaders face this daily: dozens of decisions, limited time, imperfect information. A good rule of thumb makes choices fast, simple, and consistent; the risk is when the rule drifts from the actual objective. In pathfinding algorithms, admissible heuristics carry a formal guarantee that the estimate never overstates the true cost, a concrete way to ask "is this heuristic any good?" The question is not whether to use heuristics; time and real-world complexity do not give you a choice, and neither does the autonomous car. What matters is whether your heuristics reflect what you actually care about.

**3. Domain knowledge is the highest-leverage input.** Domain-agnostic improvements (Alpha-Beta, null-window search) work on any game tree. Domain-aware heuristics, ones that know the specific game, reach gains no general technique can. The world is too complex to reduce entirely to heuristics, but being domain-aware consistently outperforms being broadly clever. I am encouraged to go deep, to read widely, to talk to people who know things I do not. Even though I will be a master of none, but at least I will be a jack of many trades: a childcare volunteer teacher by day and an algorithm enthusiast by night. 🙂

---

## Food for thought

1. Is finding a closed form for TicTacToe's state-count recurrence truly intractable, or is it just convoluted? The distinction matters for how much effort is worth spending on it.
2. Beyond instant-win heuristics and terminal reward, what other low-cost heuristics provably speed up TicTacToe search? Killer-move heuristics (moves that constrain the opponent's future options) seem worth investigating.
3. Do these observations hold for $p$-player $n \times n$ TicTacToe, or $n$-dimensional boards? Intuition says pruning becomes less effective as the number of players grows, but by how much?

---

## References

Helper stubs assumed throughout:

```python
def is_terminal(state): ...
def reward(state): ...         # from current player's perspective
def actions(state): ...        # list of legal moves from this state
def apply(state, action): ...  # transition function, returns the new state after the move
INF = float('inf')
```

### MiniMax

```python
def minimax(state, is_maximising):
    if is_terminal(state):
        return reward(state)                          # base case: score the outcome
    scores = [minimax(apply(state, a), not is_maximising) for a in actions(state)]
    return max(scores) if is_maximising else min(scores)  # X maximises, O minimises
```

### Alpha-Beta Pruning

```python
def alpha_beta(state, alpha, beta, is_maximising):
    if is_terminal(state):
        return reward(state)
    if is_maximising:
        for a in actions(state):
            alpha = max(alpha, alpha_beta(apply(state, a), alpha, beta, False))
            if alpha >= beta:
                break              # β cut-off: minimiser won't allow this
        return alpha
    else:
        for a in actions(state):
            beta = min(beta, alpha_beta(apply(state, a), alpha, beta, True))
            if beta <= alpha:
                break              # α cut-off: maximiser already has better
        return beta
```

### NegaMax

```python
# Both players maximise from their own perspective; negate the child's score
# to flip from opponent's view back to the current player's view.
def negamax(state, alpha=-INF, beta=INF):
    if is_terminal(state):
        return reward(state)           # reward must be from current player's POV
    for a in actions(state):
        score = -negamax(apply(state, a), -beta, -alpha)  # swap and negate bounds
        alpha = max(alpha, score)
        if alpha >= beta:
            break                      # same cut-off logic as alpha-beta, unified
    return alpha
```

### Scaled Rewards

```python
# Standard: α-β can stop immediately on finding +1 — it's the ceiling
def reward(state):
    if winner(state) == MAX: return +1
    if winner(state) == MIN: return -1
    return 0

# Scaled: faster wins score higher — intended to incentivise quick victories
def reward_scaled(state, depth):
    if winner(state) == MAX: return +1 - 0.1 * depth
    if winner(state) == MIN: return -1 + 0.1 * depth
    return 0
# Problem: +0.8 is no longer proof of optimality.
# The search must keep looking for a faster +1.0 — making it strictly larger.
```

### NegaScout

```python
def negascout(state, alpha=-INF, beta=INF):
    if is_terminal(state):
        return reward(state)
    window = beta
    for i, a in enumerate(actions(state)):
        score = -negascout(apply(state, a), -window, -alpha)
        if i > 0 and alpha < score < beta:               # null-window was too narrow
            score = -negascout(apply(state, a), -beta, -score)  # full re-search
        alpha = max(alpha, score)
        if alpha >= beta:
            break
        window = alpha + 1   # narrow to null window: siblings only need to beat alpha
    return alpha
```

### MTD(f)

```python
# Converges on the true minimax value via repeated null-window passes.
# Each pass returns a bound; bounds tighten until they meet.
def mtdf(state, f=0):                          # f is the initial value guess
    lower, upper = -INF, INF
    while lower < upper:
        beta = max(f, lower + 1)
        f = negamax(state, beta - 1, beta)     # null-window [β-1, β]
        if f < beta:
            upper = f                          # returned below window: upper bound
        else:
            lower = f                          # returned at/above window: lower bound
    return f
# Transposition table is mandatory: without caching, re-searches undo all savings.
```

### Best Node Search

```python
# Binary search over move quality: eliminate candidates below the threshold each round.
def bns(state):
    candidates = list(actions(state))
    lower, upper = -INF, INF
    while len(candidates) > 1:
        guess = (lower + upper) / 2 # binary search, better alternate methods to narrow down guess can be implemented.
        # null-window test: does this move beat the current guess?
        better = [a for a in candidates
                  if -negamax(apply(state, a), -guess - 1, -guess) > guess]
        if better:
            lower = guess
            candidates = better           # keep only moves above the threshold
        else:
            upper = guess                 # all moves below; lower the bar
    return candidates[0]                  # last survivor is the best move
```

### Iterative Deepening

```python
def iterative_deepening(state, max_depth):
    best_move = None
    for depth in range(1, max_depth + 1):
        best_move = best_move_at_depth(state, depth)
        # best_move from depth d → first move explored at depth d+1 (move ordering)
        # minimax value from depth d → starting guess f for MTD(f)/BNS at depth d+1
    return best_move
# Overhead factor: b/(b-1) — constant, because the final depth dominates node count.
```
