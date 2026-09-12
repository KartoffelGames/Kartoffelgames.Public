# Performance & Design Review — `@kartoffelgames/core-parser`

Original review 2026-09-11 at commit `3b2b8191` · **Revised 2026-09-12** after the lexer work landed
(`9c6f4ffd`, `5125ebff`, `d7fa4227`).
Runtime for all measurements: Deno 2.9.5 / V8 15.0.245.2, Windows 11, x86_64.

Scope: `source/lexer/**` and `source/parser/**` including all helper classes.

> This document is revised **in place**. Where a later measurement disproved an earlier claim, the earlier
> claim was rewritten rather than annotated. Anything still described as a finding has been re-verified
> against the current source.

---

## 0. Executive summary

| # | Finding | State |
|---|---|---|
| **L1** | The lexer tried **every** pattern in a scope at **every** position — 223 patterns, 187 regex calls per token, 99.5 % misses. Fixed by bucketing patterns on their possible first character. | **Done.** 4.5× on the pattern walk, 1.72 → 8.15 MB/s end to end |
| **P1** | The parser spends **87–93 % of its graph entries re-parsing a graph it already tried at that exact token position.** One `(graph, position)` cache removes it. | **Open — the big one.** 6.75× measured, prototype passes both suites |
| **P2** | The manual process stack is load-bearing for depth (recursion overflows at ~2 000 items) but costs 1.4–1.8× versus recursion. A generator driver keeps the depth at neutral cost and deletes four numbered state machines. | Open, readability |
| **G1** | `GraphNode.mergeData` uses `unshift(...spread)`: **O(n²)** and throws `RangeError` at ~200 k elements. | Open, real bug |
| **T1** | Error-message template literals built eagerly on every failed branch. Worth 9–11 % on the un-cached parser, far less once P1 lands. | Open, small |

Hypotheses tested and **rejected** — do not spend time on these:

- **Sticky (`/y`) regex + `lastIndex` instead of `substring`** — 2.2× *slower*. See §1.4.
- **`Stack` linked list → plain array** — 1.05×, noise. See §3.4.
- **A per-pattern first-character guard** — *slower than no guard at all*. See §1.2. This one cost real time.
- **Batching whitespace skipping** — the obvious implementation is slower. See §1.5.
- **`circularGraphs` lazy allocation** — cannot fire as described. See §2.4.

---

## 1. The lexer — done

### 1.1 What the problem was

`findNextStartToken` walked the scope's entire pattern list at every position. On `sketch-shader.pgsl`
(4 024 chars, 934 tokens) with the real `PgslLexer`:

```
regex exec calls  : 174437   (186.8 per token)
regex exec hits   : 947      (miss rate 99.5%)
```

`PgslLexer` registers **223 patterns in every scope** — ~150 reserved keywords plus ~60 static keywords, each
its own pattern, each a separate `exec` at every position.

### 1.2 The fix, and the trap inside it

For every pattern, derive the character it must start with; bucket patterns by that character; at each
position look up one bucket and walk only it. Patterns whose first character can't be proven go in a fallback
list that is always tried, so the result is sound — the winning pattern never changes.

The derivation does **not** need a regex parser. It answers one question — *does this regex begin with a
mandatory literal character?* — and returns "don't know" for everything else. Roughly 30 lines
(`staticFirstCharsOfRegex`) derive **218 of 223** patterns. The five it gives up on are the comment, float,
int, boolean and identifier patterns.

**The trap: where you put the check decides whether you win anything.** Measured on the real pattern set:

```
A  baseline (no first-char check)              6.68 ms
B  per-pattern Set guard inside the loop       7.76 ms   <- SLOWER than baseline
B2 same, charCodeAt hoisted out of the loop    5.20 ms   <- 1.28x
C  bucket dispatch, one lookup per position    0.53 ms   <- 12.6x
```

A per-pattern guard skips the `exec` but keeps all 223 loop iterations, and V8's `^`-anchored regex already
has a fast "not at start of input" bail costing ~12 ns — about what a property load plus `Set.has` costs. You
swap one first-character check for another and pay for the loop twice.

**The win is not skipping the regex. It is not walking the list.**

Priority is preserved by construction: patterns are bucketed in list order, and a freshly created bucket is
seeded with every undecidable pattern that precedes it. Each bucket is therefore an ordered subsequence of
the full list, so its first match is the full list's first match.

### 1.3 Measured outcome

Guard versus bucket, same process, token streams byte-identical:

```
file                          tokens      guard     bucket   speedup
sketch-shader.pgsl               934    2.254ms    0.482ms    4.68x
default-pbr-shader.pgsl          245    0.596ms    0.131ms    4.56x
forward-entry-points.pgsl        505    1.243ms    0.279ms    4.46x
sketch x20 (79 KB)             18680   44.528ms    9.415ms    4.73x

throughput:  1.72 MB/s  ->  8.15 MB/s
```

The original review claimed **7–9× for the index alone**. That was wrong: it conflated the index with the
§1.5 cleanups, and the supporting ablation (`everything EXCEPT the char index : 1.13x`) is a *removal*
ablation, which does not license the inverse claim. The index is worth ~4.5× on this machine; the cleanups
another ~1.13×.

Key-type choice does not matter. `Map<number>` + `charCodeAt(0)`, `Map<string>` + `data[0]`, and a flat
`Array(128)` indexed by code all land within ±2 % end to end, despite an isolated micro-benchmark showing
`Map<number>` ~20 % ahead. Pick whichever reads better.

### 1.4 Measurement traps worth knowing

**Monkey-patching a prototype gives garbage timings.** Patched methods get deoptimised by V8; an early
attempt showed "optimisations" getting progressively slower (0.69× → 0.44× → 0.43×). Patching to *count*
calls is fine. To measure time, modify a real copy of the source and compile it normally. Every timing in
this document comes from a compiled source copy.

**Sticky regex is not the answer.** `moveCursor` does `data = data.substring(length)`, and the 381 M
characters handed to the regex engine look like the problem. They are not — V8 represents `substring` results
as sliced strings resolved by offset, so nothing is copied:

```
A  substring + /^.../  :  8.73 ms
B  sticky + lastIndex  : 19.55 ms   (2.2x SLOWER)
```

**Cross-process comparisons drift.** Two of the wrong conclusions in this project's history came from
comparing a number measured now against a number measured in an earlier run. Always A/B in one process.

One caveat worth a code comment: the wrapper is `^(?<token>…)` *without* the `m` flag, so a non-match bails
immediately. If a user passes a regex with `m`, `^` matches at every line start and a failing pattern scans
the remaining document. Either reject `m` in `createTokenPattern` or document it.

### 1.5 Remaining lexer items

Items 1–5 of the original list (flat scope-stack loop, non-generator error token, cached meta lists, lazy
meta `Set`, `findTokenTypeOfMatch` iterating the type map) are **done** and measured at **1.11–1.13×**
combined, same-process A/B, token streams identical.

Still open, and small:

1. **Whitespace skipping** advances one character at a time. Worth **3–5 %**, and the obvious implementation
   is *slower than doing nothing*: building the run with `+=` produces a V8 ConsString that `moveCursor`'s
   `split('\n')` must flatten, and **70 % of whitespace runs in PGSL are one character**, so batching has
   nothing to batch. Measure the run as numbers — length, newline count, offset after the last newline — and
   never materialise the string, or leave the one-character version alone.
2. **`pushNextCharToErrorState`** advances one character per call through the full `moveCursor` path. Same
   treatment, only matters on inputs that fail to lex.

---

## 2. The parser — where all the time is now

### 2.1 The lexer is 1 % of the cost

```
file                          tokens    lex       parseAst   parse share
world-group-forward.pgsl          96   0.106ms     2.636ms       96%
default-pbr-shader.pgsl          245   0.154ms    11.615ms       99%
forward-entry-points.pgsl        505   0.299ms    28.793ms       99%
```

**0.6 µs/token in the lexer against 11–58 µs/token in the parser.** All of §1 optimised 1 % of end-to-end
cost. Everything below is where the remaining work is.

### 2.2 The parser re-parses the same thing over and over

Instrumenting `pushGraphStack` with the graph identity plus the token position it is entered at:

```
file                          graph pushes   distinct (graph,pos)   redundant
world-group-forward.pgsl              2001                    260       87.0%
default-pbr-shader.pgsl              13728                   1578       88.5%
forward-entry-points.pgsl            38985                   2849       92.7%

avg re-entries per (graph,pos):  7.7  ->  8.7  ->  13.7
```

Only 2 849 distinct `(graph, position)` pairs exist in `forward-entry-points.pgsl`; the parser performs
38 985 entries against them.

**Why.** The parser keeps no record of what it has tried; every `pushGraphStack` starts from zero.
Backtracking then re-arrives at the same position through every enclosing alternative. Given
`Statement → Assignment | Expression` and `Assignment → Expression "=" Expression`, parsing `foo.bar;` parses
`Expression` once inside the failing `Assignment`, throws the result away, and parses it again for the
`Expression` alternative. Your expression grammar is ~15 levels deep with ~10 alternatives per level.

Every one of the hottest repeated pairs is in `defineExpressionGraphs`. Tracing the parent chains of a single
pair entered 130 times in `default-pbr-shader.pgsl` shows only ~14 distinct paths — the expression chain
re-entering itself through different intermediate rules, each re-trying the same leaves at the same token.

The comment at [pgsl-parser.ts:1228](../kartoffelgames.core.pgsl/source/parser/pgsl-parser.ts:1228) —
*"Separate expression graph without combination expressions to speed up parsing by limiting backtracking"* —
shows this was already felt and hand-worked-around once. §2.3 is the general version of that workaround.

**The re-entry factor grows with input size (7.7 → 13.7).** That, not GC pressure, is the super-linear
scaling the original review measured but could not explain.

### 2.3 The fix: one cache, two outcome kinds

Key on `(graph, entry token cursor)`, per parse, junctions excluded:

```
FAILED                       -> return PARSER_ERROR immediately, skip the whole subtree
{ nodeResult, endCursor }    -> push, set cursor to endCursor, RE-RUN Graph.convert, pop
```

The failure half is free of assumptions: a failed graph produced no data and ran no converter. The success
half stores the *parse*, not the *converted result*, and re-runs the converter on every hit — so no converted
object is ever aliased into two places.

```
=== world-group-forward.pgsl ===
  baseline                              2.12ms     1.00x   output identical=true
  failure only                          1.24ms     1.72x   output identical=true
  failure + parse cache                 0.98ms     2.16x   output identical=true
  failure + converted-result cache      1.00ms     2.11x   output identical=true

=== default-pbr-shader.pgsl ===
  baseline                             11.09ms     1.00x
  failure only                          3.37ms     3.30x
  failure + parse cache                 2.72ms     4.07x
  failure + converted-result cache      2.79ms     3.98x

=== forward-entry-points.pgsl ===
  baseline                             28.53ms     1.00x
  failure only                          5.71ms     5.00x
  failure + parse cache                 4.23ms     6.75x
  failure + converted-result cache      4.14ms     6.88x
```

**Caching the parse and re-running converters is within 2 % of caching converted results, and beats it on two
of three files.** Reusing converted results eliminates 59 % of `Graph.convert` calls and 62 % of `mergeData`
calls and buys 1.29× for it — so the converters are nearly free.

**The expensive thing is searching for the parse, not producing the data.** The three strategies are
performance-equivalent, which means the choice is a correctness choice, and the parse cache wins it.

Per-token cost, which is the number that matters:

```
file                          tokens    baseline  us/token    cached  us/token
object-group-forward.pgsl         67      2.10ms      31.3    1.05ms      15.7
shared-types.pgsl                 68      0.67ms       9.9    0.71ms      10.4
world-group-forward.pgsl          96      1.80ms      18.7    1.06ms      11.1
default-pbr-shader.pgsl          245     11.91ms      48.6    3.56ms      14.5
forward-entry-points.pgsl        505     29.33ms      58.1    5.71ms      11.3
```

Baseline `µs/token` climbs 9.9 → 58.1. Cached it is flat at 10–16. The scaling term is removed, not reduced.
`shared-types.pgsl` is the honest counter-case: 107 graph pushes total, nothing to cache, bookkeeping costs
~5 %.

Correctness evidence: transpiled WGSL byte-identical on every parseable shader; with the prototype swapped
into `source/parser/`, `core-parser` passes **43 (230 steps)** and `core-pgsl` passes **223 (1322 steps)**,
0 failed.

A stricter variant storing only the branch decisions and re-converting the whole subtree would remove the
remaining sharing — the cached `nodeResult` still holds already-converted child objects, so children are
shared even though the top-level object is rebuilt. It was not built. Since converters measured as nearly
free it should land in the same range, and it is the version to reach for if a collector turns out to mutate
its input.

**Caveats, all three real.**

- **Junctions are excluded.** A junction can fail on `MAX_JUNCTION_CIRCULAR_REFERENCES` in one call stack and
  succeed in another, so `(graph, position)` is not a complete key for them. PGSL declares 58 graphs of which
  **2 are junctions** (`lExpressionSyntaxTreeGraph`, `lSimplelExpressionSyntaxTreeGraph`, both written
  `}, true)` on a continuation line — easy to miss when grepping). They are **~8 % of all graph pushes**, and
  every number above excludes them, so all of this is a lower bound.
- **`trimTokenCache` is untested against this.** The cache assumes token cursor indices are stable for the
  whole parse. `popGraphStack` splices the token cache when trimming is on, which shifts them. PGSL leaves
  the option at its `false` default so the prototype never exercised it. Either verify index stability or
  disable the cache when `trimTokenCache` is set.
- **Graph identity is the key**, and `Graph.converter()` returns a *new* `Graph` (§4.5). Graphs must be built
  once and stored, never constructed inline in a collector — otherwise every resolution creates a fresh key
  and the cache never hits. This is already true for circular detection; the cache makes it load-bearing.

### 2.4 What is left after the cache

```
forward-entry-points.pgsl, with the failure half only
pushGraphStack()      : 4680   ( 9.3 per token;  was 77.2)
remaining redundancy  : 39.2%  (was 92.7%)
trace.push()          : 3580   ( 7.1 per token;  was 94.5)
```

Two consequences for the rest of this document:

**T1 / eager trace incidents is repriced.** Ablating both hot incident call sites on the *un-cached* parser
was worth 9–11 % (28.869 ms → 26.352 ms). But `trace.push` falls from 94.5 to 7.1 per token once failures are
cached, because the failures that generated those incidents are exactly what gets skipped. Do the cache
first, then re-measure before investing here.

**Lazy `circularGraphs` allocation cannot work as originally proposed.** `pushGraphStack` always inserts the
graph itself into `circularGraphs`, so the dictionary is never empty at push time and "keep it `null` while
empty" never fires. Avoiding the allocation needs a different shape — hold the self-reference in a plain
field and only allocate a `Map` for a second entry. The original measurement that **0 entries are copied per
push** still stands; it is the allocation, not the copy.

---

## 3. The execution stack — design findings

Not re-measured in the 2026-09-12 pass; nothing since has contradicted them.

### 3.1 The manual stack is needed. Keep it.

A faithful recursive-descent port producing identical results overflows where the process stack does not:

```
=== Right recursive list:  list = item ( "," list )? ===
items      iterative (manual stack)     recursive descent
  1000     ok                           ok
  2000     ok                           STACK OVERFLOW
100000     ok                           STACK OVERFLOW

=== Nested brackets:  nest = "(" nest? ")" ===
depth      iterative (manual stack)     recursive descent
  2000     ok                           ok
  5000     ok                           STACK OVERFLOW
```

The native limit **varies between runs in the same process** (7 003, 8 853, 10 759 on three consecutive
probes), so a recursion-based parser would fail intermittently and unreproducibly rather than at a clean
limit.

### 3.2 But it is a cost, not a win

```
items    iterative      recursive     recursive is
   10      0.0304ms     0.0210ms    1.45x faster
  100      0.3014ms     0.2025ms    1.49x faster
  500      1.7946ms     1.0232ms    1.75x faster
```

The manual stack is a **correctness mechanism that costs ~1.5×**, not a performance optimisation. Whatever
produced the big speedup in the original rework, it was not this — most likely the token cache that avoids
re-lexing on backtrack.

### 3.3 Recommendation: keep the stack, delete the state machine

`processGraphParseProcess`, `processNodeParseProcess`, `processNodeValueParseProcess` and
`processChainedNodeParseProcess` each encode a continuation as an integer, push the next process and return a
sentinel. Control flow is spread across four `switch` statements linked only by `state++`.

A **generator stack** gives recursion-shaped code with heap-allocated depth: each routine is a generator that
`yield`s a request for a sub-parse and receives the result back; a flat driver owns the stack of suspended
generators.

```ts
private drive(pState: CodeParserProcessState<TTokenType>, pRoot: ParseRequest<TTokenType>): unknown {
    const lStack: Array<ParseRoutine<TTokenType>> = [this.routine(pState, pRoot)];
    let lResult: unknown = undefined;

    while (lStack.length > 0) {
        const lTop: ParseRoutine<TTokenType> = lStack[lStack.length - 1];
        const lStep: IteratorResult<ParseRequest<TTokenType>, unknown> = lTop.next(lResult);

        if (lStep.done) {
            lStack.pop();
            lResult = lStep.value;
            continue;
        }

        lStack.push(this.routine(pState, lStep.value));
        lResult = undefined;
    }

    return lResult;
}
```

`processNodeParseProcess`'s three numbered states collapse to this, whole:

```ts
private * parseNode(pState: CodeParserProcessState<TTokenType>, pNode: GraphNode<TTokenType>): ParseRoutine<TTokenType> {
    const lNodeValueResult: unknown = yield { kind: 'nodeValue', node: pNode };
    if (lNodeValueResult === CodeParserException.PARSER_ERROR) {
        return CodeParserException.PARSER_ERROR;
    }

    const lChainResult: unknown = yield { kind: 'chained', node: pNode };
    if (lChainResult === CodeParserException.PARSER_ERROR) {
        return CodeParserException.PARSER_ERROR;
    }

    return pNode.mergeData(lNodeValueResult, lChainResult as object);
}
```

Measured performance-neutral at depth, with identical results:

```
items    iterative      generator     generator is
  100       0.3029ms     0.4491ms    0.67x
  500       1.9394ms     1.7455ms    1.11x
 2000       7.2720ms     7.4858ms    0.97x
20000     120.7135ms   115.2717ms    1.05x
```

**This is also where the §2.3 cache belongs.** The cache needs the entry cursor threaded from graph-entry to
graph-exit; in the current design that is state smuggled between two `switch` cases, and in a generator
routine it is a local variable. Do the rewrite first, add the cache into it.

**The one trap: plain `yield`, never `yield*`.** Delegation is O(depth) per value:

```
yield* through N nested frames, per yielded value
depth    ns per value          flat driver + plain yield
    1      58.3                   depth   64:  68.5 ns
    8     165.2                   depth  512:  46.3 ns
   64    1216.6   (21x slower)    depth 4096:  48.9 ns
```

Generators are synchronous and cost ~26.6 ns per new+yield+resume, against 25.0 ns for the current
hand-rolled process item — ~22 % more per step, on steps that do 240–800 ns of real work. That is why the
end-to-end measurement came out neutral.

### 3.4 `Stack` is fine — do not touch it

```
process stack: 200,000 push/pop pairs
Stack (linked list) : 4.25 ms
Array               : 4.06 ms   (1.05x)
```

Noise. The allocation that matters is the process item itself, plus its `parameter` and `values` objects —
which §3.3 deletes.

---

## 4. Correctness bugs

All five re-verified against the current source on 2026-09-12.

### 4.1 `mergeData`'s `unshift(...spread)` — O(n²) and a crash

[graph-node.ts:186](source/parser/graph/graph-node.ts:186) and
[graph-node.ts:256](source/parser/graph/graph-node.ts:256).

The spread is an argument list, so it hits the call-argument limit:

```
unshift(...array of 100000) -> ok
unshift(...array of 200000) -> RangeError: Maximum call stack size exceeded
```

A stack overflow, in the library whose architecture exists to avoid stack overflow. And `unshift` into a
growing array is O(n²) — exactly the shape `key[]` + `key<-key` produces:

```
items     unshift(...)      push + reverse    unshift is
  1000       0.230ms          0.014ms          15.9x slower
 16000      18.600ms          0.094ms         197.9x slower
 64000     367.597ms          0.408ms         900.5x slower
```

*Minimal fix:* `lOpenChainData[key] = b.concat(a)`. Removes the crash, still O(n²).
*Proper fix:* accumulate with `push` and reverse once in `Graph.convert`, where lists are completed.

### 4.2 Trace priority collides across lines

[code-parser-trace.ts:74](source/parser/code-parser-trace.ts:74): `lPriority = (pLineEnd * 10000) + pColumnEnd`.

Any column past 10 000 bleeds into the next line, so on minified or generated input the reported error is the
wrong, earlier one. Compare `(lineEnd, columnEnd)` as a tuple, or rank by token-cache index.

### 4.3 `mRootPattern`'s declared type is a lie

[lexer.ts:15](source/lexer/lexer.ts:15) declares `LexerPattern<TTokenType, 'split'>` but it is constructed
with `type: 'single'`, laundered through `new LexerPattern<TTokenType, any>`. It works only because every
`.pattern.end` access is guarded by `isSplit()`. Declare it `LexerPattern<TTokenType, LexerPatternType>`.

### 4.4 Fragile "is there already an incident?" check

[code-parser.ts:118](source/parser/code-parser.ts:118) tests for the *default* incident by comparing against
its coordinates, so a genuine error at line 1 column 1 is indistinguishable and gets a useless
"tokens could not be parsed" message appended on top. Use an explicit `hasIncident` flag.

### 4.5 `Graph.converter()` returns a new identity

[graph.ts:105](source/parser/graph/graph.ts:105) builds a *new* `Graph` with a copied converter list.
Constructing a graph inline inside a collector therefore creates a fresh identity per resolution, which
breaks circular detection and re-resolves the node tree every time.

**§2.3 raises the stakes:** the parse cache keys on graph identity, so an inline-constructed graph would also
never produce a cache hit. Presumably intentional immutability, but it needs a `@remarks` saying graphs must
be stored in a variable.

---

## 5. Cleanliness (no behaviour change)

All re-verified present on 2026-09-12.

1. **Two symbols, one description** — [code-parser.ts:20-21](source/parser/code-parser.ts:20).
   `NODE_NULL_RESULT` and `NODE_VALUE_LIST_END_MEET` both print as `FAILED_NODE_VALUE_PARSE` and mean
   different things.
2. **Duplicate type** — `LexerPatternDefinitionMatcher`
   ([lexer-pattern.ts:270](source/lexer/lexer-pattern.ts:270)) is structurally identical to
   `LexerPatternTokenMatcher` ([lexer-pattern.ts:249](source/lexer/lexer-pattern.ts:249)). Delete one.
3. **`convertTokenPattern` casts through `as any` twice** to satisfy a conditional type. A discriminated
   union (`{ kind: 'single', start } | { kind: 'split', start, end, innerType }`) removes both casts and lets
   `isSplit()` narrow properly.
4. **Stale comments:**
   - [lexer.ts:88](source/lexer/lexer.ts:88): *"the first added pattern **or a longer matched token** gets
     priorized"* — there is no longest-match logic; `findNextStartToken` returns the first match.
   - [lexer-pattern.ts:120](source/lexer/lexer-pattern.ts:120): *"with global and single flag"* — no flags
     are added.
   - [lexer-pattern.ts:122](source/lexer/lexer-pattern.ts:122): *"add sticky"* — sticky is never added, and
     per §1.4 it should not be.
5. **`validator` receives a fully materialised `pFollowingText`**
   ([lexer-pattern.ts:242](source/lexer/lexer-pattern.ts:242)), built by `substring` on every validated
   match. Cheap today (sliced string), but it is a public signature that locks out position-based matching
   later. `(token, fullText, offset)` is strictly more capable.
6. **Stray double semicolon** —
   [code-parser-process-state.ts:260](source/parser/code-parser-process-state.ts:260). `getGraphPosition` and
   `getTokenPosition` are also near-duplicates; extract one `tokenEndPosition(token)`.

---

## 6. Order of work

| Priority | Item | Why |
|---|---|---|
| 1 | **§3.3 generator driver** | Deletes four state machines at neutral cost, *and* is where the §2.3 cache belongs — the entry cursor becomes a local instead of smuggled state |
| 2 | **§2.3 parse cache** | Up to 6.75×, removes the scaling term, no converter-purity assumption, both suites pass |
| 3 | **§4.1 `unshift(...spread)`** | Fixes a crash and an O(n²); the `concat` version is two lines |
| 4 | **§4.2 priority, §4.3 root type, §4.4 incident check, §4.5 `@remarks`** | Small, self-contained; §4.5 becomes load-bearing once the cache exists |
| 5 | **Junction caching** | ~8 % of pushes, excluded from every number in §2.3; needs the circular call count folded into the key |
| 6 | **§2.4 T1 lazy trace incidents** | Re-measure *after* the cache; 9–11 % before it, much less after |
| 7 | **§1.5 whitespace, §5 all** | Clarity; ~3–5 % as a bonus, and see the warning in §1.5 |

---

## 7. Open questions

1. **Is `trimTokenCache` used anywhere in production?** It changes `getGraphBoundingToken` accuracy, and
   §2.3's cache assumes stable token indices which trimming may break. If nobody enables it, the branch in
   `popGraphStack` is dead weight worth deleting — which also removes the caveat.
2. **Do any graph collectors mutate the values they receive?** The parse cache does not depend on the answer,
   but it decides whether the stricter decision-only variant (§2.3) is ever needed.
3. **Are junction graphs performance-relevant, or a correctness escape hatch?**
   `MAX_JUNCTION_CIRCULAR_REFERENCES = 1000` throws a raw `Exception` that `parse()` converts into a generic
   `CodeParserException`, losing the cause. The two PGSL junctions are the expression entry points, so they
   are on the hottest path there is.
4. **Is the `m`-flag case reachable?** (§1.4) If user regexes with `m` are legitimate, the anchored fast path
   breaks down. Should `createTokenPattern` reject it?
5. **Was the "longer matched token" priority in [lexer.ts:88](source/lexer/lexer.ts:88) ever implemented, or
   aspirational?** The bucket index preserves first-match-wins, which is what the code does. If you actually
   want longest-match, the index still helps but the inner loop must collect all candidates.
6. **What is the realistic upper bound on list sizes in your grammars?** (§4.1) Under a few thousand, the
   `concat` fix is enough; at 100 k the push+reverse redesign is required.

---

## 8. Prototypes

```
<scratchpad>/
  parser-memo-prototype/        failure-only cache
  parser-route-prototype/       failure + parse cache  (the §2.3 recommendation)
  parser-packrat-prototype/     failure + converted-result cache
  zz-4way-tmp.ts                §2.3 comparison table
  zz-conv-tmp.ts                Graph.convert / mergeData call counts
  zz-memo-ab-tmp.ts             A/B plus transpiled-output comparison
  zz-scale-tmp.ts               per-token scaling and push counts
  zz-after-tmp.ts               residual profile
  first-char.ts / minimal.ts    §1.2 regex first-character derivations
```

`<scratchpad>` = `C:\Users\TETROD~1\AppData\Local\Temp\claude\X--Kartoffelgames-Public\15767e2b-b1bf-4940-8ed6-090cccc8a867\scratchpad`

Prototypes were swapped into `source/parser/` only to run the test suites, then restored and verified
identical against a backup. The repo working tree was left clean apart from this document.
