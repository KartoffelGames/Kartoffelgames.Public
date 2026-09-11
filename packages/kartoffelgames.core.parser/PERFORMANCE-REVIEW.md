# Performance & Design Review — `@kartoffelgames/core-parser`

Review date: 2026-09-11 · Branch `feature/potato-engine` · Reviewed at commit `3b2b8191`
Runtime used for all measurements: Deno 2.9.5 / V8 15.0.245.2, Windows 11, x86_64.

Scope: `source/lexer/**` and `source/parser/**` including all helper classes.

---

## 0. Executive summary

| # | Finding | Impact | Confidence |
|---|---|---|---|
| **L1** | Lexer tries **every** pattern in a scope for **every** position. 223 patterns → 187 regex calls per token, **99.5 % of them misses**. | **7–9× lexer speedup available** | Measured end-to-end with a full working implementation; all 21 existing lexer tests pass, token streams byte-identical |
| **P1** | Your own execution stack **is** load-bearing. A faithful recursive-descent port overflows the stack at ~1 000–2 000 list items; yours handles 100 000. | Keep it | Measured, both implementations built |
| **P2** | But the manual stack is **not** a performance win — plain recursion is **1.4–1.8× faster**. Your memory of "lifted performance by a ton" is not what the code does today. | Corrects the design rationale | Measured |
| **P3** | A **generator-driven** driver keeps the unbounded depth, is **performance-neutral**, and deletes the entire numbered-`state` machine. | Biggest readability win | Measured, working implementation |
| **G1** | `GraphNode.mergeData` uses `unshift(...spread)`: **O(n²)** (900× slower than push+reverse at 64 k) and throws `RangeError: Maximum call stack size exceeded` at ~200 k elements. | Real bug | Measured |
| **T1** | Error-message template literals are built eagerly on every failed branch (**3.3× per token** on a branching grammar) and then usually discarded. | Moderate | Measured call counts |

Three hypotheses I tested and **rejected** — don't spend time on these:

- **Sticky (`/y`) regex + `lastIndex` instead of `substring`** — *slower*, not faster. See §1.4.
- **`Stack` linked list → plain array** — 1.05×, i.e. noise. See §2.5.
- **`circularGraphs` Dictionary *copy* being O(size)** — measured **0 entries copied per push**. The *allocation* is the cost, not the copy. See §2.4.

---

## 1. The lexer

### 1.1 The dominant cost

`Lexer.findNextStartToken` ([lexer.ts:267](source/lexer/lexer.ts:267)) walks the scope's entire pattern list and calls `matchToken` on each until one matches. Instrumenting `RegExp.prototype.exec` over `sketch-shader.pgsl` (4 024 chars, 934 tokens) with the real `PgslLexer`:

```
text chars        : 4024
tokens produced   : 934
regex exec calls  : 174437   (186.8 per token)
regex exec hits   : 947      (miss rate 99.5%)
chars handed to rx: 381,420,610  (= 94,786x the text size)
```

The `PgslLexer` registers **223 patterns in every scope** (nesting depth 5, same 223 at each level) — ~150 reserved keywords plus ~60 static keywords, each its own pattern. Every one is a separate `exec` at every position.

This is the whole ballgame. Everything else in the lexer is rounding error by comparison.

### 1.2 The fix: first-character dispatch

For each pattern, derive the set of characters its regex can *start* matching, then bucket patterns by first character. At each position, look up `data.charCodeAt(0)` and only try that bucket. Patterns whose first-char set can't be proven stay in a fallback list that is always tried, so the optimisation is **sound** — never changes which pattern wins.

On the real `PgslLexer` pattern set, a conservative derivation handles **216 of 223** patterns (the 7 undecidable ones are comment/number patterns starting with a group or alternation):

```
patterns in root scope     : 223
first-char set derived     : 216
undecidable (always try)   : 7
avg patterns tried per position : 13.7  (was 223)  -> 16.3x fewer regex calls
```

Pattern priority is preserved by construction: patterns are processed in list order, and a freshly created bucket is seeded with every undecidable pattern that precedes it.

### 1.3 Measured result

I built this for real — a full copy of `source/lexer/` with the dispatch index plus the smaller items from §1.5, driven by the actual `PgslLexer` grammar. Not a monkey-patch (see the warning in §1.4).

```
file                          tokens   baseline    optimized   speedup   identical
sketch-shader.pgsl              934     4.815ms     0.681ms    7.07x     true
forward-entry-points.pgsl       505     2.587ms     0.310ms    8.36x     true
default-pbr-shader.pgsl         245     0.935ms     0.105ms    8.88x     true
sketch x20 (79 KB)            18680    68.535ms    7.826ms     8.76x     true

throughput: 1.12 MB/s  ->  9.81 MB/s
```

- **Token streams are byte-identical** (type, value, line, column, metas) on every file.
- The package's **existing lexer test suite passes unchanged**: `21 passed (53 steps) | 0 failed`, same as baseline.
- `forward-import.pgsl` fails to lex in both versions with the identical message (it uses `#IMPORT`, which the current grammar doesn't cover) — so that's a faithful match too.

**Ablation** — which change actually earned the win:

```
all optimisations                      : 9.75x
everything EXCEPT the char index       : 1.13x
```

So the dispatch index is worth **~8.6×** and every other lexer change combined is worth **1.13×**. Do the index first; treat the rest as cleanliness work with a small bonus.

### 1.4 Two measurement traps I hit — worth knowing

**Monkey-patching `Lexer.prototype` gives garbage numbers.** My first attempt at measuring the smaller optimisations by patching prototype methods showed them getting *progressively slower* (0.69× → 0.44× → 0.43×) as I added "optimisations". That's V8 deoptimising the patched methods, not real cost. Every number in §1.3 comes from a real modified copy of the source compiled normally. If you benchmark this yourself, modify the source.

**Sticky regex is not the answer.** `moveCursor` does `data = data.substring(length)` ([lexer.ts:453](source/lexer/lexer.ts:453)), and the 381 M characters above look like it must be the problem. It isn't — V8 represents `substring` results as sliced strings and resolves them by offset for regex, so no copying happens. I benchmarked the obvious "fix" (sticky `/y` flag + `lastIndex = position` against the immutable full text, 180 failing patterns × 4 024 positions):

```
A  substring + /^.../  :  8.73 ms
B  sticky + lastIndex  : 19.55 ms   (2.2x SLOWER)
```

`^`-anchored patterns get a very fast "not at start of input" bailout that the sticky path doesn't match. **Keep the `substring` approach.**

One caveat worth a comment in the code: because the wrapper is `^(?<token>…)` *without* the `m` flag, a non-match bails immediately. If a user ever passes a regex with the `m` flag, `^` starts matching at every line start and a failing pattern will scan the whole remaining document. The `lTokenStartMatch.index !== 0` guard at [lexer.ts:408](source/lexer/lexer.ts:408) catches the wrong result but not the wasted scan. Worth either rejecting `m` in `createTokenPattern` or documenting it.

### 1.5 Smaller lexer items (the 1.13×)

Worth doing for clarity; measure before attributing speed to them.

1. **`tokenizeRecursionLayer` is a recursive generator** ([lexer.ts:528](source/lexer/lexer.ts:528)). Every token bubbles up through one `yield*` frame per nesting level — O(depth) per token. Replacing it with a flat loop over an explicit scope-stack array made the code *shorter* and removed the cost. Note the irony: the parser has a hand-rolled stack where recursion would be fine, and the lexer has recursion where a stack is better.

2. **`generateErrorToken` is a generator that yields 0 or 1 token** ([lexer.ts:344](source/lexer/lexer.ts:344)), consumed via `yield*` at three call sites. A plain function returning `LexerToken | null` is cheaper and clearer.

3. **Two allocations per token for metas.** `matchToken` builds `[...pCurrentMetas, ...pPattern.meta]` on every *attempt* ([lexer.ts:412](source/lexer/lexer.ts:412)) — including the 99.5 % that fail validation — and `LexerToken` allocates a `Set` per token ([lexer-token.ts:49](source/lexer/lexer-token.ts:49)) even when there are no metas. Caching the resolved meta list per (pattern, parent-list) and making the `Set` lazy removes both.

   **Careful here — this is where I introduced the one bug my rewrite hit.** The end-token match passes the *current* scope's metas, which already include the pattern's own metas, so appending them again duplicates. The original code has the same double-append but the per-token `Set` silently collapsed it. If you switch to arrays you must dedupe explicitly, or the `Valid token metas` test fails with `[Braket, List, Braket, List]`.

4. **`metas` getter allocates on every read** ([lexer-token.ts:26](source/lexer/lexer-token.ts:26)): `[...this.mMetas]`. Fine if rarely read; it's called per token in some consumers.

5. **`findTokenTypeOfMatch` uses `for…in` over `pTokenMatch.groups`** ([lexer.ts:298](source/lexer/lexer.ts:298)) — that iterates *every* named group in the user's regex. Iterating the (usually single-entry) `pTypes` object instead and indexing `groups[name]` is strictly less work.

6. **Whitespace is skipped one character at a time** ([lexer.ts:500](source/lexer/lexer.ts:500)). 20 % of `sketch-shader.pgsl` is whitespace, and each character costs a `charAt` (one-char string allocation), a `Set` lookup, and a full `moveCursor` — which itself does `value.split('\n')` (array allocation) plus a progress-tracker call. Skipping the whole run in one `moveCursor` and counting newlines with `charCodeAt` instead of `split` removes all of it.

7. **`pushNextCharToErrorState`** ([lexer.ts:471](source/lexer/lexer.ts:471)) also advances one character per call through the full `moveCursor` path. Same treatment applies.

---

## 2. The parser — your central question

> *"maybe I was limited by my own experience back then and the own execution stack implementation is hindering and not needed whether by the stack limit nor by the performance."*

Two separate questions, two different answers.

### 2.1 Is it needed for the stack limit? **Yes. Unambiguously.**

I wrote a faithful recursive-descent port (`RecursiveCodeParser`) — same `CodeParserProcessState`, same graph-stack handling, same error handling, same results; the only difference is JS recursion instead of the process stack. Verified to produce identical output where both work.

```
=== Right recursive list:  list = item ( "," list )? ===
items      iterative (manual stack)     recursive descent
   500     ok                           ok
  1000     ok                           ok
  2000     ok                           STACK OVERFLOW
  5000     ok                           STACK OVERFLOW
100000     ok                           STACK OVERFLOW

=== Nested brackets:  nest = "(" nest? ")" ===
depth      iterative (manual stack)     recursive descent
  2000     ok                           ok
  5000     ok                           STACK OVERFLOW
 20000     ok                           STACK OVERFLOW
```

Your process stack reaches **~10 entries per input item** and handles 100 000 items (999 998 entries) without trouble. The native limit in this runtime is only ~7 000–10 800 nested frames — and note it **varies between runs in the same process** (I measured 7 003, 8 853, 10 759 on three consecutive probes). That variability is exactly why a recursion-based parser would be an intermittent, input-dependent, unreproducible crash rather than a clean limit.

**Your instinct was right and still is. Do not go back to plain recursion.**

### 2.2 Is it a performance win? **No — it costs you 1.4–1.8×.**

On inputs small enough that both implementations work:

```
items    iterative      recursive     recursive is
   10      0.0304ms     0.0210ms    1.45x faster
  100      0.3014ms     0.2025ms    1.49x faster
  500      1.7946ms     1.0232ms    1.75x faster
```

The gap widens with size. So the manual stack is a **correctness mechanism that costs performance**, not a performance optimisation. Whatever gave you the big speedup back then, it wasn't this — most likely the token caching in `CodeParserProcessState` (which avoids re-lexing on backtrack) or removal of some other overhead that happened in the same rework.

This matters because it changes how you should think about the code: you're paying ~1.5× for unbounded depth. That's a fine trade. But it also means there's no reason to keep the *ugliest* version of that trade.

### 2.3 Recommendation: keep the stack, delete the state machine

The readability problem isn't the stack — it's the `state: number` switch machine. `processGraphParseProcess`, `processNodeParseProcess`, `processNodeValueParseProcess` and `processChainedNodeParseProcess` each manually encode a continuation as an integer, push the next process, and return a sentinel. Control flow is scattered across four `switch` statements with `state++` as the only linkage, and every function ends in an unreachable `throw` guarded by `deno-coverage-ignore`.

You can get recursion-shaped code *and* heap-allocated depth with a **generator stack**: each parse routine is a generator that `yield`s a request for a sub-parse and receives the result back; a flat driver loop owns the stack of suspended generators.

The critical detail: **plain `yield`, never `yield*`**. `yield*` delegation is O(depth) per step and would reintroduce the lexer's problem, quadratically. With plain `yield` the driver's cost is depth-independent:

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

`processNodeParseProcess`'s three numbered states collapse to this — the whole function, no sentinels, no `state++`:

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

Measured against the current implementation:

```
=== depth limit ===
items      iterative       recursive         generator
  2000     ok              STACK OVERFLOW    ok
 20000     ok              STACK OVERFLOW    ok
100000     ok              STACK OVERFLOW    ok

=== throughput (identical results at every size) ===
items    iterative      generator     generator is
   10       0.0327ms     0.0330ms    0.99x
  100       0.3029ms     0.4491ms    0.67x
  500       1.9394ms     1.7455ms    1.11x
 2000       7.2720ms     7.4858ms    0.97x
20000     120.7135ms   115.2717ms    1.05x
```

**Performance-neutral, same depth capability, results identical, and the four state machines become four linear functions.** The 0.67× at 100 items is the one outlier and is worth re-measuring on your real grammar before committing — but the trend at 500–20 000 is flat-to-slightly-better.

This is my headline recommendation for "can something be written cleaner?". A working implementation is in the scratchpad (see §5).

### 2.3.1 Aren't generators slow, like promises?

No — they're a different mechanism, and about 2.7× cheaper than the thing people usually mean by "slow". But they aren't free either, and there is exactly one trap. Measured over 2 000 000 operations, best of 5:

```
1. plain function call (fully inlined)               0.8 ns/op
2. generator: new + 1 yield + resume                26.6 ns/op
3. generator: new + 3 yields                        57.5 ns/op
4. one generator, N yields (for..of)                26.3 ns/op

5. new Promise + await                              71.5 ns/op
6. await async function                             26.0 ns/op
7. await a plain number                             37.5 ns/op
```

Generators are **synchronous**. There's no microtask queue, no scheduler turn, no lost stack traces — and critically, no forced API change: promises would make `parse()` async, which for a parser is a breaking change you'd never want. A generator step is just "allocate a frame object, call a function, save/restore the resume point".

(Note lines 2 and 6 are near-identical. V8 implements async functions on the *same* resumable-frame machinery as generators — so "async is slow" is really "the `Promise` object plus its executor callback is slow", which is line 5.)

The 0.8 ns baseline is an inlining artefact, so it's not the number that matters. The decision-relevant comparison is **one parser step under each strategy**:

```
A. process item + parameter + values + Stack + 2 switches (current)   25.0 ns/step
B. generator + request object + next()                                30.5 ns/step
C. plain polymorphic call + result object                              9.7 ns/step

generator vs current design : 1.22x more expensive
plain call vs current design: 0.39x  (2.6x cheaper)
```

So a generator step **is** ~22 % more expensive than your hand-rolled process item. That sounds bad until you scale it: the parser does ~10 steps per input item at 2.4–8 µs per item, i.e. **240–800 ns of real parsing work per step**. Five extra nanoseconds on a 240 ns step is under 2 % — which is exactly why the end-to-end measurement in §2.3 came out neutral. The dispatch mechanism is not where the time goes.

Line C also quantifies §2.2 from the other direction: plain calls are 2.6× cheaper per step, which is where the recursive version's 1.4–1.8× end-to-end win comes from. You're paying that for unbounded depth.

**The one real trap: `yield*` delegation is O(depth).** This is not a micro-effect:

```
yield* through N nested frames, per yielded value
depth    ns per value
    1      58.3
    2      79.2   (x1.36 for 2x depth)
    8     165.2   (x1.59 for 2x depth)
   32     661.6   (x2.26 for 2x depth)
   64    1216.6   (x1.84 for 2x depth)      -> 21x slower than depth 1
```

Every value has to be re-yielded through every enclosing `yield*` frame. A flat driver with **plain `yield`** is depth-independent, as the design requires:

```
flat driver + plain yield, same nesting
depth    ns per generator step
   64     68.5
  512     46.3
 4096     48.9      -> flat
```

46 ns at depth 512 versus 49 ns at depth 4 096. This is the whole reason the driver in §2.3 pushes generators onto an array instead of delegating — and it's also finding §1.5.1, where the lexer's recursive `tokenizeRecursionLayer` pays the `yield*` tax on every token (modest at PGSL's nesting depth of 5, fatal if depth ever tracked input size).

### 2.4 `circularGraphs`: the allocation, not the copy

`pushGraphStack` does `new Dictionary(lLastGraphStack.circularGraphs)` on every graph entry ([code-parser-process-state.ts:401](source/parser/code-parser-process-state.ts:401)), and `moveNextToken`/`popGraphStack` each allocate a fresh empty one ([:314](source/parser/code-parser-process-state.ts:314), [:362](source/parser/code-parser-process-state.ts:362)).

I assumed the *copy* was the problem. It isn't — I measured it:

```
items    graph pushes   dict entries copied   entries per push
  1000            2000                     0               0.00
 10000           20000                     0               0.00
```

Zero. Because `moveNextToken` clears the dictionary whenever a token is consumed, on any grammar that makes progress it's essentially always empty. Good design, and my hypothesis was wrong.

The real cost is that a `Dictionary` (a `Map` subclass) is **allocated anyway**, twice per input item. Keeping it `null` while empty:

```
new Dictionary(prev) always : 18.36 ms
null while empty            :  0.08 ms   (236x faster, 200k allocations)
```

In context that's ~0.09 µs × 2 per item against 2.4–8 µs/item total — call it **2–7 % of parse time**. Real, cheap to fix (`circularGraphs: Map | null`, allocate on first `set`), not transformative. I'm flagging the honest size rather than the exciting isolated number.

### 2.5 `Stack` is fine — don't touch it

`Stack` from `@kartoffelgames/core` is a linked list, so every `push` allocates a `{previous, value}` node on top of the process item. That looked like an obvious win to convert to an array. It isn't:

```
process stack: 200,000 push/pop pairs
Stack (linked list) : 4.25 ms
Array               : 4.06 ms   (1.05x)
```

Noise. The allocation that matters is the **process item itself** — each push creates the item object plus a `parameter` object plus a `values` object ([code-parser.ts:215](source/parser/code-parser.ts:215) and similar). If you adopt §2.3 the generator replaces all of it.

### 2.6 Super-linear scaling

Parse time per item is not flat:

```
items      total        us/item    scaling
   500       1.19ms      2.38
  1000       2.24ms      2.24      O(n^0.91)
  4000      16.86ms      4.22      O(n^1.76)
 16000     105.99ms      6.62      O(n^1.26)
 32000     239.41ms      7.48      O(n^1.18)
```

Per-item cost triples from 2.24 µs to 7.48 µs over a 32× input range. With `trimTokenCache: false` (the default) the token cache and the ~10-entries-per-item process stack both grow with input, so this is most likely GC pressure rather than an algorithmic term — the exponent drifting *down* at the tail argues against a clean O(n²). Reducing per-step allocations (§2.3, §2.4) is the lever. I did not isolate this further; if it matters for your real workloads it deserves a heap profile.

---

## 3. Correctness bugs and latent issues

### 3.1 `mergeData`'s `unshift(...spread)` — O(n²) **and** a crash

[graph-node.ts:186](source/parser/graph/graph-node.ts:186) and [graph-node.ts:256](source/parser/graph/graph-node.ts:256):

```ts
lChainData.unshift(...lNodeData);
(<Array<unknown>>lChainMergeValue).unshift(...lMergePickedNodeData);
```

Two independent problems.

**The spread is an argument list**, so it hits the call-argument limit:

```
unshift(...array of   1000) -> ok
unshift(...array of 100000) -> ok
unshift(...array of 200000) -> RangeError: Maximum call stack size exceeded
unshift(...array of 500000) -> RangeError: Maximum call stack size exceeded
```

A stack overflow — in the library whose entire architecture exists to avoid stack overflow. Any grammar producing a list of >~200 k elements (a big data file, a generated shader, a minified input) crashes here regardless of how well the process stack behaves.

**`unshift` into a growing array is O(n²).** Bottom-up list construction is exactly the pattern `key[]` + `key<-key` produces:

```
items     unshift(...)      push + reverse    unshift is
  1000       0.230ms          0.014ms          15.9x slower
  4000       0.827ms          0.020ms          41.6x slower
 16000      18.600ms          0.094ms         197.9x slower
 64000     367.597ms          0.408ms         900.5x slower
```

900× at 64 k items. And the flat-list grammar shape does scale worse than the nested one in the real parser (`O(n^1.49)` at the tail vs `O(n^1.18)`), consistent with this being a live cost.

**Fixes, in increasing order of payoff:**

- *Immediate, minimal:* replace `a.unshift(...b)` with `lOpenChainData[key] = b.concat(a)`. Removes the crash. Still O(n²).
- *Proper:* accumulate with `push` and reverse once when the list is complete. Lists are built bottom-up, so the natural place to flip is `Graph.convert` — this is a design change, but it's the difference between O(n) and O(n²) on every list your grammars produce.

### 3.2 Trace priority collides across lines

[code-parser-trace.ts:74](source/parser/code-parser-trace.ts:74):

```ts
lPriority = (pLineEnd * 10000) + pColumnEnd;
```

Any column past 10 000 bleeds into the next line's range:

```
line 1, col 12000 -> 22000
line 2, col     5 -> 20005
=> the earlier error on the long line outranks the later one on line 2: true
```

So on minified or generated input the reported error can be the *wrong*, earlier one. Comparing `(lineEnd, columnEnd)` as a tuple, or ranking by token-cache index, removes the magic number entirely.

### 3.3 Eager error messages on the hot backtracking path

[code-parser.ts:492](source/parser/code-parser.ts:492) and [code-parser.ts:506](source/parser/code-parser.ts:506) build a template literal and call `getTokenPosition()` (which allocates a 6-field object and does `value.includes('\n')`) on **every failed required match** — then `CodeParserTrace.push` usually discards it via the priority check.

On a non-backtracking grammar this is free — I measured exactly **1** `trace.push()` call for a whole 10 000-item parse. But on a grammar with real alternatives, which is what PGSL is:

```
=== Branching expression grammar ===
stmts   tokens   trace.push()   per token   pushGraphStack()   parse ms
   50      600           2012         3.4              3965      2.72
  200     2400           8012         3.3             15815     10.72
  800     9600          32012         3.3             63215     51.14
```

**3.3 discarded incidents per token.** Storing the parts (`actual`, `expected`, graph, position) and formatting only if the incident is actually reported measured 1.9× cheaper in isolation. The message string is the cheap part; the `getTokenPosition()` object is the expensive one. Worth restructuring `CodeParserTrace` so the non-debug path mutates flat fields on the trace instead of allocating an incident plus a nested `range` object per push.

### 3.4 `mRootPattern`'s declared type is a lie

[lexer.ts:15](source/lexer/lexer.ts:15) declares `LexerPattern<TTokenType, 'split'>`, but [lexer.ts:72](source/lexer/lexer.ts:72) constructs it with `type: 'single'`, laundered through `new LexerPattern<TTokenType, any>`. It works only because `tokenizeRecursionLayer` guards every `.pattern.end` access behind `isSplit()`. Any future code that trusts the declared type reads `undefined`. Declare it as `LexerPattern<TTokenType, LexerPatternType>` and drop the `any`.

### 3.5 Fragile "is there already an incident?" check

[code-parser.ts:117](source/parser/code-parser.ts:117):

```ts
if (lParseProcessState.incidentTrace.top.range.lineEnd === 1 && lParseProcessState.incidentTrace.top.range.columnEnd === 1) {
```

This tests for the *default* incident by comparing against its coordinates. A genuine error at line 1, column 1 is indistinguishable, so the "tokens could not be parsed" message gets appended on top of a real diagnostic. An explicit `hasIncident` boolean on `CodeParserTrace` says what's meant.

### 3.6 `Graph.converter()` returns a new identity

[graph.ts:104](source/parser/graph/graph.ts:104) builds a *new* `Graph` with a copied converter list. Since `circularGraphs` keys on graph identity and `mResolvedGraphNode` is per-instance, calling `.converter()` inside a node collector would create a fresh identity per resolution — breaking circular detection and re-resolving the node tree every time. This is presumably intentional immutability, but it's an easy trap and isn't documented. Worth a `@remarks` noting that graphs must be stored in a variable, not constructed inline in a collector.

---

## 4. Cleanliness (no behaviour change)

1. **Two symbols, one description** — [code-parser.ts:20-21](source/parser/code-parser.ts:20):
   ```ts
   public static readonly NODE_NULL_RESULT: symbol = Symbol('FAILED_NODE_VALUE_PARSE');
   public static readonly NODE_VALUE_LIST_END_MEET: symbol = Symbol('FAILED_NODE_VALUE_PARSE');
   ```
   They mean different things ("no result yet" vs "ran out of alternatives") and print identically in any debug output. Give them their own descriptions.

2. **Duplicate type** — `LexerPatternDefinitionMatcher` ([lexer-pattern.ts:206](source/lexer/lexer-pattern.ts:206)) is structurally identical to `LexerPatternTokenMatcher` ([lexer-pattern.ts:185](source/lexer/lexer-pattern.ts:185)). Delete one.

3. **`convertTokenPattern` casts through `as any` twice** ([lexer-pattern.ts:143](source/lexer/lexer-pattern.ts:143), [:164](source/lexer/lexer-pattern.ts:164)) to satisfy the conditional `LexerPatternDefinition<TTokenType, TPatternType>`. A discriminated union (`{ kind: 'single', start } | { kind: 'split', start, end, innerType }`) would let `isSplit()` narrow properly and remove both casts and the conditional type.

4. **Stale comments in the lexer:**
   - [lexer.ts:88](source/lexer/lexer.ts:88): *"the first added pattern **or a longer matched token** gets priorized"* — there is no longest-match logic. `findNextStartToken` returns the first match, full stop. The doc promises behaviour the code doesn't implement.
   - [lexer.ts:137](source/lexer/lexer.ts:137): *"Convert regex into a line start regex with global and single flag"* — no flags are added.
   - [lexer.ts:139](source/lexer/lexer.ts:139): *"Create flag set and add sticky"* — sticky is never added. (And per §1.4, it shouldn't be.)

5. **`validator` receives a fully materialised `pFollowingText`** ([lexer-pattern.ts:202](source/lexer/lexer-pattern.ts:202)) built by `substring` on every validated match. It's cheap today (sliced string) but it's a public signature that locks you out of position-based matching later. If you ever revisit the API, passing `(token, fullText, offset)` is strictly more capable.

6. **`beginParseProcess`'s result threading is implicit** ([code-parser.ts:163](source/parser/code-parser.ts:163)). `lStackResult` is initialised to `NODE_NULL_RESULT` and passed through `processStack` on each turn; whether a given process reads it depends on its state number. This is the part of the design that most needs the §2.3 rewrite — with generators the result is just the value of the `yield` expression.

7. **`getGraphPosition` and `getTokenPosition` are near-duplicates** ([code-parser-process-state.ts:165](source/parser/code-parser-process-state.ts:165) and [:228](source/parser/code-parser-process-state.ts:228)) — the same newline-splitting end-position block appears twice (and [:261](source/parser/code-parser-process-state.ts:261) has a stray double semicolon). Extract one `tokenEndPosition(token)` helper.

---

## 5. Prototypes

All measurements above are reproducible. Working code is at:

```
<scratchpad>/prototypes/
  lexer/                          full optimized lexer (7-9x, tests pass)
    first-char-index.ts             the dispatch index + regex first-char derivation
    lexer.ts  lexer-token.ts  lexer-pattern.ts
  parser/
    generator-code-parser.ts      the §2.3 generator driver
    recursive-code-parser.ts      the recursive-descent control (for the stack-limit test)
  zz-compare-tmp.ts               lexer baseline-vs-optimized harness
  zz-compare-parser-tmp.ts        iterative vs recursive vs generator
  zz-scaling-tmp.ts               scaling + unshift argument limit
  zz-micro-tmp.ts                 Stack / Dictionary / trace micro-benchmarks
  zz-branch-tmp.ts                branching-grammar incident counts
  gen-vs-promise.ts               §2.3.1 generator vs promise costs
  parse-step.ts                   §2.3.1 per-step costs + yield* depth scaling
```

`<scratchpad>` = `C:\Users\HENRIK~1\AppData\Local\Temp\claude\C--Users-henrikschauer-Desktop-a-better-future-Kartoffelgames-Public\5d275ae2-5b57-486d-8458-af5e0c5156c8\scratchpad`

The repo working tree was left clean — nothing was committed or modified outside this file.

---

## 6. Suggested order of work

| Priority | Item | Why |
|---|---|---|
| 1 | **§1.2 first-char dispatch index** | 7–9× lexer, proven, additive, existing tests cover it |
| 2 | **§3.1 `unshift(...spread)`** | Fixes a crash and an O(n²); the `concat` version is a two-line change |
| 3 | **§2.3 generator driver** | The real answer to "cleaner" — deletes four state machines at neutral cost |
| 4 | **§3.2 priority, §3.5 incident check, §3.4 root type** | Small, self-contained correctness fixes |
| 5 | **§3.3 lazy trace incidents, §2.4 lazy `circularGraphs`** | ~5–10 % combined on branching grammars |
| 6 | **§1.5 lexer allocation cleanups, §4 all** | Clarity; ~1.13× as a bonus |

Two things **not** to do: don't replace `substring` with sticky regex (§1.4), and don't convert `Stack` to an array (§2.5). Both measured as neutral-to-worse.

---

## 7. Questions for you

1. **Is the `m`-flag case reachable?** (§1.4) If user regexes with `m` are legitimate, the anchored fast path breaks down and a failing pattern scans the rest of the document. Should `createTokenPattern` reject `m`?

2. **Was the "longer matched token" priority in [lexer.ts:88](source/lexer/lexer.ts:88) ever implemented, or aspirational?** It changes whether §1.2 is purely additive. My index preserves first-match-wins, which is what the code does — if you actually want longest-match, the index still helps but the inner loop must collect all candidates instead of returning early.

3. **What's the realistic upper bound on list sizes in your grammars?** (§3.1) If lists stay under a few thousand, the `concat` fix is enough and the push+reverse redesign isn't worth it. If PGSL can produce 100 k-element lists, it is.

4. **Do you remember what specifically made the big difference during the original rework?** (§2.2) The manual stack measures as a 1.5× *cost*, so the win came from something else — I'd guess the token cache. Knowing which would tell us what not to disturb.

5. **Are junction graphs performance-relevant, or a correctness escape hatch?** `MAX_JUNCTION_CIRCULAR_REFERENCES = 1000` ([code-parser-process-state.ts:8](source/parser/code-parser-process-state.ts:8)) throws a raw `Exception`, which `parse()` converts into a generic `CodeParserException` losing the specific cause. If junctions are on hot paths I'd look at them more closely.

6. **Is `trimTokenCache` used anywhere in production?** (§2.6) It changes `getGraphBoundingToken` accuracy, and it interacts with the growth I measured. If nobody enables it, the branch in `popGraphStack` is dead weight worth removing.
