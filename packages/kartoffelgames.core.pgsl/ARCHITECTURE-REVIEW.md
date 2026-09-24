# PGSL architecture review

Review of `@kartoffelgames/core-pgsl` covering the five questions raised: preprocessor debug
information, CST→AST/validation separation, the type system, AST→text conversion, and performance.

> ## 🚩 Ship blocker — D1
>
> **The expression grammar has no operator precedence and no associativity.** `1 * 2 + 3` parses as
> `1 * (2 + 3)`, `1 - 2 - 3` as `1 - (2 - 3)`, and `if (a + 1 < 10)` is rejected outright with
> `Arithmetic operation not supported for used types.`
>
> This is a language-level defect, not a polish item. The emitted WGSL happens to be correct
> (the transpiler flattens to a string and WGSL re-parses it properly), which is exactly what makes
> it dangerous: it is invisible in the output and only shows up as spurious type errors and as
> constant folding on the wrong tree. Every shader written against the current parser either
> carries redundant parentheses or is being type-checked against a tree its author did not write.
>
> Fix: **§5.2**, precedence tiers — on top of the left-factoring in the same section, which is
> behaviour-preserving, measured at **1.75× on CST / −38 % end-to-end**, and makes the tier ladder a
> small edit rather than a rewrite. Both should land before anything else in §7.

All numbers below are measured on this machine (Deno 2.9.6, Windows) against the
`benchmark/` inputs. Suite: **223 tests passing, 1 331 steps, 0 failing**.

| input | lines | chars | tokens |
|---|---|---|---|
| `small` | 7 | 104 | 23 |
| `medium` (`BenchmarkSource.full(1)`) | 302 | 8 536 | 1 585 |
| `full` (`BenchmarkSource.full(8)`) | 1 387 | 42 710 | 8 025 |

---

## 0. Where the time and the complexity actually are

### The parser

|  | before §5.2 | now |
|---|---|---|
| graph pushes per token | 8.7 | **4.9** |
| overall redundancy (attempts / distinct graph+token) | 1.6× | **1.03×** |
| fail share of all attempts | 46.7 % | 44 % |
| CST cost | 7.6–8.8 µs/token | **4.3–4.4 µs/token** |

Failed-attempt redundancy was already 1.0× *before* §5.2 — no failing graph was ever retried at a
position it had already failed at. That number is easy to over-read, and an earlier revision of this
document did over-read it: **the failure cache only makes *failing* alternatives cheap. It does
nothing for alternatives that succeed and are then thrown away**, because successes are not cached.
The expression grammar was throwing away successful sub-parses constantly; fixing that (§5.2) was
worth 1.75× on CST.

With redundancy now at 1.03× the grammar side is finished — see §5.2d. The cache that made those
failures cheap has outlived its purpose and now costs ~13 % on large files (§5.1b).

### Stage split

Per `transpile()`, current tree:

| Stage | `small` (23 tok) | `medium` (1 585 tok) | `full` (8 025 tok) | Share of `full` |
|---|---|---|---|---|
| `new PgslParser()` (once per process) | 0.32 ms | 0.32 ms | 0.32 ms | — |
| Lexing | 0.01 ms | 0.86 ms | 4.60 ms | 10 % |
| **CST construction (graph resolution)** | **0.08 ms** | **5.08 ms** | **32.18 ms** | **73 %** |
| Built-in declaration CST rebuild (per `parseAst`) | 0.36 ms | 0.36 ms | 0.36 ms | 1 % |
| CST → AST + type resolution + validation + WGSL | 0.01 ms | 3.01 ms | 6.79 ms | 15 % |
| **Total `transpile()`** | **0.47 ms** | **9.32 ms** | **43.9 ms** | |

This inverts the intuition the package is built around. **CST construction — the part you called the
cleanest — is still the largest stage on anything but a tiny file.** The AST and type layer you
called the jankiest is ~15 %. The transpiler proper is under 1 %.

But read the `small` column separately: there, **78 % of the call is rebuilding built-in
declarations** and the grammar is 82 µs. That is §5.3, and it is the only thing that can move small
inputs — no graph change ever will.

Which is also the good news:

- **The large graph items are done, and the first was also a correctness fix.** §5.2 left-factored
  the expression grammar (1.75× on CST, fixed D11) and §5.2c collapsed seven single-token
  alternations into two (−8 %). Together: `full` went from ~85 ms to ~44 ms, byte-identical WGSL,
  parser 90 lines shorter. Redundancy is 1.03× — **the grammar is finished** (§5.2d). What is left
  is `core-parser` work: §5.1b at −13 %, §5.1 at −9 %.
- **The real work is correctness and structure**, and it is all in the layers that are cheap to
  change. D1 blocks shipping. D2/D3/D4/D10 silently emit invalid WGSL or bury the user in noise.
  §1 (debug info), §2 (validation split) and §3 (the type system) have no performance component at
  all — they are entirely about being able to read and extend the thing.

---

## 1. Debug information lost in the precompile

### What is lost

There are five separate losses stacking on top of each other.

**1a. `#META` shifts every following line by one.** `preprocessText`
([pgsl-parser.ts:1938](source/parser/pgsl-parser.ts:1938)):

```ts
const lMetaDeclarationRegex: RegExp = /^\s*#META\s+"(.*?)"\s*(?:"(.*?)")?;\s*$/gm;
// ...
return '\n';
```

The match ends at `$`, i.e. *before* the trailing newline, but the replacement *is* a newline —
so each `#META` directive inserts one extra line. Verified:

```
source:  line 1 = '#META "name" "value";'
         line 2 = 'private a: float;'
CST reports 'private a' at line 3
```

The leading `^\s*` makes it worse: when a blank line precedes the directive, `\s*` swallows it and
the net offset is zero instead of +1. So the drift is not even constant.

**1b. `#IMPORT` resets line numbers to 1.** `preprocessText` splits the source on import lines
([pgsl-parser.ts:1935](source/parser/pgsl-parser.ts:1935)) and `internalParse` calls
`super.parse()` on each fragment separately
([pgsl-parser.ts:1780](source/parser/pgsl-parser.ts:1780)). Each fragment starts counting at
line 1 again. Verified:

```
private beforeImport: float;   source line 1  -> reported 1
#IMPORT "shared";              source line 2
private afterImport: float;    source line 3  -> reported 2
private alsoAfter: float;      source line 4  -> reported 3
```

**1c. There is no source identity anywhere.** `CstRange` is
`[lineStart, columnStart, lineEnd, columnEnd]`
([general.type.ts:12](source/concrete_syntax_tree/general.type.ts:12)) and
`AbstractSyntaxTreeMeta` is the same four numbers. An imported declaration at line 1 of
`shared.pgsl` and a main-document declaration at line 1 are indistinguishable:

```
dup   line 1   <- which file?
dup   line 2   <- which file?
```

**1d. Types carry no range at all.** The unmigrated type classes are still AST nodes and construct
themselves with `super({ type: 'Type', range: [0, 0, 0, 0] })` (e.g.
[pgsl-numeric-type.ts:56](source/abstract_syntax_tree/type/pgsl-numeric-type.ts:56)), so the
`pushIncident` calls they make — `Texture sampled type must be a numeric type` and the rest — are
reported at line 0, column 0.

Types on `BasePgslType` no longer have this problem, because they no longer report anything: each
rule moved to the AST node that holds a real position. Finishing the migration (§3) closes 1d
rather than fixing it.

**1e. The result type has nowhere to put a file name.** `PgslParserResultIncident` exposes only
`message`, `line`, `column`, and `convertIncidents`
([pgsl-parser-result.ts:205](source/parser_result/pgsl-parser-result.ts:205)) defaults to `0, 0`
when no node is attached.

### Suggested fix

**Invariant to adopt: every preprocessor transformation must be line-count preserving.** You
already do this correctly in `preprocessIfDefReplacements` (pushes `''` for removed lines) and in
comment stripping (replaces non-newlines with spaces). `#META` and `#IMPORT` are the two that
break it. A one-line unit test pins it down:

```ts
// for every fixture:
assertEquals(preprocessed.split('\n').length, original.split('\n').length);
```

Concretely:

- `#META`: replace with `''`, not `'\n'`, and anchor the regex as `^[ \t]*#META...` so `\s`
  cannot eat newlines. (Same fix for the `#IMPORT` regex.)
- `#IMPORT`: stop using `split()`. Blank the import line in place and record
  `Map<lineNumber, importName>`. Then the main document is parsed **once**, with correct line
  numbers, and imports are parsed as separate source units.

**Add a source unit id.** The smallest change that fixes 1c/1e:

```ts
// concrete_syntax_tree/general.type.ts
export type CstRange = [
    source: number,            // index into PgslParser's source unit table
    lineStart: number, columnStart: number,
    lineEnd: number, columnEnd: number
];
```

`PgslParser` keeps `Array<{ name: string; text: string }>`; index 0 is the main document, each
`addImport` name gets its own index. `createTokenBoundParameter`
([pgsl-parser.ts:270](source/parser/pgsl-parser.ts:270)) takes the id of the unit currently being
parsed. `PgslParserResultIncident` gains a `source: string` getter. This also gives you the input
side of a real source map (§4a).

**Give types a range.** The type constructors already accept a `TypeCst` — it is just always a
dummy. `TypeDeclarationAst.resolveXxx` knows `this.cst.range`; thread it through. That alone moves
23 incident sites from `0:0` to a real location. For synthesised types (built-ins, inferred
results) point at the expression that produced them rather than nowhere.

---

## 2. Separating CST→AST conversion from validation

### The CST first — agreed, leave it alone

Your read is right, and it is worth writing down so nobody "improves" it later.
`concrete_syntax_tree/*.type.ts` is nothing but `type` aliases: every node is
`{ type, range } & fields`, there is no behaviour, no base class, no inheritance, and the only code
that touches it is the graph converters that build it and the AST classes that consume it. That is
what a CST should be, and it is the reason this is the one boundary in the package you can hold in
your head. Nothing in this section proposes changing its shape.

It carries exactly one real problem, and it is a data problem rather than a design one:

```ts
export type CstRange = [lineStart: number, columnStart: number, lineEnd: number, columnEnd: number];
```

The CST is the **only** layer that knows where anything came from, and `CstRange` cannot say *which
source* a line number belongs to. That single missing field is D6, D7, and half of §1. Adding a
fifth element — or a `source: number` — is a mechanical change to a data type; no behaviour moves,
no file gains a method. Do that, and leave the rest of the layer exactly as it is.

### Why it is hard right now

`onProcess(context)` is doing five jobs at once. Taking `VariableDeclarationAst.onProcess`
([variable-declaration-ast.ts:53](source/abstract_syntax_tree/declaration/variable-declaration-ast.ts:53))
as representative, in one method it:

1. constructs child AST nodes (`new AttributeListAst(...)`, `new TypeDeclarationAst(...)`),
2. resolves names against the context (`pContext.getAlias`, `getStruct`),
3. **mutates** the context (`registerValue`, `registerBindingName`),
4. validates (`validateDeclaration`, cast checks, `pushIncident` × 15),
5. computes derived data (`getAccessMode`, `getAddressSpace`, `getConstantValue`).

Four structural consequences:

- **You cannot build an AST without a context, and you cannot validate without rebuilding.**
  Every test has to go through the full parser.
- **Order is implicit and load-bearing.** Declarations must be registered before their bodies
  process; `AttributeListAst` must exist before `getAccessMode` runs. Nothing in the types enforces
  this — the sequence of statements in `onProcess` is the specification.
- **The dependency order is faked with lazy processing.** `AbstractSyntaxTreeContext.getAlias` /
  `getEnum` / `getFunction` / `getStruct` all contain the same 15-line block: if not processed,
  guard against re-entry with `mProcessingStack`, push a synthetic `build-in` scope, process.
  That is an ad-hoc topological sort. When it hits a cycle it returns `undefined`, which surfaces
  as `Typename "X" not defined` — the wrong message for a circular alias.
- **`data` has a "not valid yet" state.** `AbstractSyntaxTree.mData: TData | null` with a throwing
  getter means every node is temporarily invalid, and only runtime checks catch misuse.

### Suggested shape

> You asked: *"the transpiler only has an `onProcess` method and doesn't handle validation and
> context at all — so what do you mean?"* That is the right objection, and answering it properly
> changes the recommendation.

**What makes the transpiler clean is not the `Map<Constructor, Processor>`. It is the
precondition.** By the time `Transpiler.transpile` runs:

- every node's `data` is already complete, so a processor never has to ask a context for anything;
- nothing it does can fail, so there is no error channel to thread through the recursion;
- the only shared state is one explicit accumulator (`TranspilationMeta`), which is *written* and
  never read back to make a decision;
- traversal order belongs to the driver, not to the nodes — `pTranspile` is injected.

Those four properties are what allow the behaviour to live in a one-method class. The dispatch map
is a *consequence* of them, not the cause. So "mirror the transpiler" was the wrong phrasing on my
part. The accurate version is:

> **Validation can be given exactly the preconditions the transpiler already enjoys. Conversion
> cannot — conversion is what creates them.** So externalise validation, and leave conversion on
> the node.

That distinction is the whole answer:

| | Conversion / resolution | Validation | Transpilation |
|---|---|---|---|
| Needs the context? | **yes — it builds it** | reads it only | not at all |
| Can it fail? | only "name not found" | **that is its entire job** | no |
| Coupled to the node's own fields? | **yes** — it produces `TData` | no — it reads `data` | no — it reads `data` |
| Belongs | on the AST class (`onProcess`) | in an external processor | in an external processor |

Which is why the five-job list above is the diagnosis, not the complaint. `onProcess` is not janky
because logic lives on the node — it is janky because it has to *establish its own preconditions
while consuming them*. Jobs 2 and 3 create the context that jobs 4 and 5 read, in a single pass, in
an order nothing states. And job 4 does not belong there at all: of `VariableDeclarationAst`'s 260
lines, roughly 200 are `validateDeclaration` plus the surrounding `pushIncident` checks, and **none
of them need to run during construction**. They only need `data` to exist.

So the concrete proposal is two passes, not three:

| Pass | Input | Output | Context | Incidents |
|---|---|---|---|---|
| **A. Process** — what `onProcess` does today, minus the rules | `Cst` | `Ast` with complete `data` | read + write | resolution only ("unknown name", "cyclic alias") |
| **B. Validate** | processed `Ast` | incidents | **read-only** | all semantic rules |

Pass B now has the transpiler's preconditions, so it can be written the same way it is:

```ts
export interface IValidationProcessor<TAst extends AbstractSyntaxTree> {
    readonly target: Constructor<TAst> | Array<Constructor<TAst>>;
    validate(node: TAst, ctx: ReadonlyValidationContext, descend: Descend): void;
}
```

`Validator` is then the same ~40 lines as `Transpiler`, with `descend` replacing `pTranspile` and
an incident list replacing the returned string. Worth noticing: `Transpiler.transpile` and
`Validator.validate` are the *same walk*. If you want, one generic `AstWalker<TResult>` serves both
and the two drivers collapse into thin wrappers.

What that buys you, in order of how much it matters day to day:

- `validation/declaration/variable-declaration-validator.ts` becomes the answer to "what are the
  rules for `uniform`?" — today that answer is 200 lines into a builder.
- Rules can be unit-tested against a hand-built AST, with no parser involved.
- The 221 `pushIncident` calls end up in one layer, so severities and error codes become possible.
- Rule sets become swappable per target; WGSL and GLSL do not have the same restrictions.
- `onProcess` shrinks to the ~40 lines that genuinely produce `TData` — the part that does belong
  on the node.

**The one thing that does need a separate pass is ordering.** The lazy `getAlias` / `getEnum` /
`getFunction` / `getStruct` blocks above are an ad-hoc topological sort; no amount of moving
validation around fixes them. Replace them with an explicit step before pass A: walk the
module-scope declarations, build the dependency graph (alias → its type, struct → member types,
function → called functions), topologically sort, process in that order. Cycles become
`Circular declaration: A -> B -> A` instead of `Typename "X" not defined`. This deletes
`mProcessingStack`, the four duplicated `getX()` bodies, and `callInBuildInScope`.

### What must stay in the conversion pass

The two-pass table above is too clean if read as "conversion never fails". It does fail, but it may
only fail in **one** way:

> **Conversion may only report "I cannot determine what this is."
> Everything of the form "I know what this is, and it is not allowed" is validation.**

Three things stay on the conversion side:

1. **Resolution failures.** `Typename "X" not defined.`
   ([type-declaration-ast.ts:470](source/abstract_syntax_tree/general/type-declaration-ast.ts:470)),
   `Variable "x" not defined.`, `Function 'f' is not defined.` Conversion cannot proceed past these —
   it needs the answer to produce `data.type` / `data.resolveType`. There are ~14 such sites today
   and they all belong exactly where they are.
2. **Result-type and overload selection.** `a + b`'s result type only exists if the operands are
   compatible, and a function call's `resolveType` only exists once an overload has been picked. The
   *selection* is conversion, so the failure of that selection ("no overload of `f` matches
   `(int, float)`") has to be reported by conversion too. What does **not** belong there is
   everything downstream of the selection — "must be constructible", "must not have an initializer",
   "storage requires `[GroupBinding]`".
3. **Cycle detection**, in the ordering pass: `Circular declaration: A -> B -> A`.

#### The part that makes the split work: fixing the poison type (D10)

This is the piece that is missing today, and without it splitting validation out does not help — it
just moves the cascade into a different file.

You already have the mechanism. `PgslInvalidType` exists, is documented as "a fallback when type
resolution fails", and is used at 18 sites. But it *propagates* instead of being *absorbed*: one
undefined variable used three times produces nine incidents, and one unknown typename inside a
function body produces seven. The first line of each group is the only one a user can act on.

There are **three** independent ways a type gets consulted, so there are three absorption points.
I measured each one separately by patching them in:

| | `private a: NotAType` | unknown type, then used twice | unknown fn | unknown var ×3 | `Vector4<NotAType>` |
|---|---|---|---|---|---|
| baseline | 3 | 7 | 2 | 9 | 2 |
| + ① comparisons absorb | 2 | 4 | 1 | 6 | 2 |
| + ② property reads skip | 1 | 3 | 1 | 6 | 1 |
| + ③ structural dispatch bails | **1** | **1** | **1** | **3** | **1** |
| *ideal* | 1 | 1 | 1 | 3 | 1 |

Row 4 is the ideal: one incident per actual mistake. (Three for `nope` is correct — it is three
separate uses of an undefined name.) All three are needed; any two leave noise behind.

**⓪ Poison already has a name generic code can test.** `BasePgslTypeKind.Invalid` is a bit, so the
guard is `isKind(Invalid)` and works anywhere a `BasePgslType` is in hand — including the future
`Validator` driver. Make `PgslInvalidType` a singleton while you are here; it takes no arguments and
carries no state, so every `new PgslInvalidType()` produces an identical object.

**① Comparisons must absorb.** Today `PgslInvalidType.equals` returns `false` and its
`conversionRankTo` returns infinity, so poison is rejected everywhere it appears and each rejection
raises its own incident. Both should absorb instead — equal to anything, convertible into anything —
so that one bad type produces exactly one report.

The asymmetric half matters too: an *operand* that is poison must also be absorbed when the poison is
on the other side of the comparison. `accepts` on the base already short-circuits on reference
identity; the invalid check belongs in the same place, so no call site changes.

**② Capability reads must be skipped, not satisfied.** Do **not** give poison its capability bits —
that would make it constructible and host-shareable and let it slip past rules it should never reach.
It carries only `Invalid`. Guard where the rules *run*, not where the bits are read: a single early
return at the top of `VariableDeclarationAst.validateDeclaration` covers that file's checks at once,
and the reads cluster the same way in the other AST files that perform them.

Once the `Validator` from §2 exists this collapses to **one** guard in the driver — skip any node
whose `data` contains a poison type. That is the concrete payoff for doing D10 before the
extraction rather than after.

**③ Structural dispatch needs a poison arm.** This is the one that is easy to miss, and it is the
last source of noise. `ArithmeticExpressionAst.onProcess` classifies each operand as
`'scalar' | 'vector' | 'matrix' | 'unknown'`; poison lands in `'unknown'`, falls past every branch,
and hits the catch-all at
[arithmetic-expression-ast.ts:90](source/abstract_syntax_tree/expression/operation/arithmetic-expression-ast.ts:90):
`Arithmetic operation not supported for used types.` The guard is four lines, right after the
operand types are read:

```ts
// Poison in, poison out - the real error was already reported.
if (lLeftType.data.invalid || lRightType.data.invalid) {
    return PgslInvalidType.INSTANCE;
}
```

I inserted exactly this one guard and re-measured: it is what takes the table above from row 3 to
row 4. The same shape needs the same guard in `comparison-expression-ast.ts` ("Comparison can only
be between values of the same type"), `logical-expression-ast.ts` ("Left side … needs to be a
boolean"), `binary-expression-ast.ts` ("Binary operations can only be applied to integer types"),
`unary-expression-ast.ts`, `indexed-value-expression-ast.ts` and
`value-decomposition-expression-ast.ts` — six or seven nodes, four lines each.

**The invariant to write down and test:**

> **Poison in → poison out, with no incident.** Every operation that consumes a type is either
> total over poison or bails to poison.

and the regression test that pins it:

```ts
// For each fixture containing exactly one resolution error,
// assert incidents.length === 1 (or === the number of distinct bad references).
```

One thing that is already right and should stay: `transpileInvalidType` throws
`Invalid type encountered during transpilation`. That is unreachable, because `PgslParser.transpile`
only transpiles when `incidents.length === 0` — so it is correctly an assertion, not a fallback.

#### Validation is not purely local, and that is fine

The other thing the clean table hides: a few rules are global accumulations rather than node-local
checks.

- `registerBindingName` — "binding `X` in group `Y` is already used" (cross-declaration).
- `registerValue` — "variable `x` already defined" (scope-relative).
- Statement rules that need the enclosing function — return type agreement, `discard` only in a
  fragment entry point.

These do not fit "one validator per node type, reading only its own `data`" — but they do not break
the parallel either, because **the transpiler has exactly the same thing**: `TranspilationMeta` is a
driver-owned accumulator that processors write into (`createBindingFor`). So `ValidationContext` is
*read-only with respect to the AST* and carries its own scratch state: declared names, used bindings,
current function, current loop depth. Scope and enclosing-node context are traversal state, which the
driver owns and passes through `descend` — the same way `pTranspile` owns traversal order today.

Worth naming this up front. It is the thing that stalls step 3 in the order below: the first
non-local rule you hit will look like proof that the split does not work, when it is really just a
missing parameter.

### Order within the change

Do this as one change. The steps below are a dependency order, not a release plan — each one makes
the next one possible, and stopping halfway leaves you with two half-shapes rather than one good
one. What matters is the order, not that each point stands alone.

1. **Fix the poison type (D10)** — steps ⓪–③ above. Everything downstream is judged by incident
   quality, so if this is not first you will not be able to tell whether the rest worked. It also
   leaves you with `BaseType`, which is where §3's `commonType` lands.
2. **Move the rules out of `onProcess`.** Every check that only *reads* and calls `pushIncident`
   becomes `onValidate(ctx)`. Anything that refuses to move is, by definition, one of the three
   conversion-side cases above; if that list grows past those three, the split is telling you
   something.
3. **Add the `Validator` walker** and give `ValidationContext` its accumulators (declared names, used
   bindings, current function) from the start — they are what the non-local rules need, and
   retrofitting them later is what makes this look like it does not work.
4. **Move `onValidate` bodies into processor classes**, mirroring `transpilation/wgsl/`.
5. **Replace the lazy `getX()` blocks with the explicit ordering pass.** Last, because it is the only
   step that touches `AbstractSyntaxTreeContext`, and because by then you know exactly what the
   conversion pass still needs from it.

`IDeclarationAst.register()` is already a precursor: a separate binding phase that exists for
declarations and for nothing else. Formalising it is the natural starting point for step 5.

---

## 3. The type system

### Current shape

`BasePgslType` ([base-pgsl-type.ts](source/abstract_syntax_tree/type/base-pgsl-type.ts)) is a plain
class, not an AST node. A type has no context, no `process()` and reports no incidents — it is a
specification and nothing else. Three pieces of state, all fixed at construction:

- **`kind`** — one 32-bit mask (`BasePgslTypeKind`) carrying both what the type *is* (`Numeric`,
  `Vector`, `Array`, `Struct`, … — the region masked by `AllType`) and what it *can do* (`Scalar`,
  `Composite`, `Indexable`, `Plain`, `Concrete`, `FixedFootprint`, `Constructible`, `HostShareable`,
  `Storable`). Every bit is set explicitly by each type; nothing is implied by anything else.
- **`meta`** — `{ typeName, generics? }`. `typeName` is the full identification string of the type;
  `generics` holds the sub-types.
- **`shadowedType`** — the type a built-in stands in for, or itself.

Concrete on the base: `isKind` (a bit test), `isSameTypeClass` (compares the `AllType` region only)
and `accepts`. Abstract, implemented by every type: `equals` and `conversionRankTo`. Keeping those
two abstract is deliberate — opening `pgsl-void-type.ts` shows what a void does without following a
chain into a generic base implementation.

### Types are specifications; validation lives in the AST

Nothing in a type validates. Interning forces this as much as taste does: if the same type object is
handed out twice, a rule that reports during construction stays silent the second time a bad type is
written.

The rules that used to sit inside the type classes split into two groups, and both left:

- **Declaration shape** — arity, literal parsing, name resolution. These belong in
  `TypeDeclarationAst`, where a source position exists. Vector's "component must be a scalar" and
  matrix's "component must be a floating point type" now live in `resolveVector` and `resolveMatrix`
  as bit tests.
- **Well-formedness of the type itself** — deleted rather than moved. An `Array<Texture>` is a
  perfectly good specification; whether anything may be *done* with it is a question for the use
  site, and the capability bits already answer it.

### Capability bits carry legality of use

An array copies `Plain`, `Concrete`, `Storable` and `HostShareable` from its element type, and claims
`FixedFootprint` and `Constructible` only when the length is fixed. Vector and matrix inherit the
same set. A composite over an illegal element therefore comes out without the bits, and every
declaration that demands them rejects it — no formation rule needed anywhere.

That makes the bits load-bearing, so their values have to be right. `Array<Texture>` turns on a
distinction that is easy to get wrong: a texture **is** storable (WGSL handle types are storable) but
is **not** plain, and it is `Plain` that WGSL requires of an array element. Testing the wrong one
silently admits it.

The reading side is where the gap still is. Module scope
([variable-declaration-ast.ts:288](source/abstract_syntax_tree/declaration/variable-declaration-ast.ts:288))
checks constructible, scalar, host-shareable, fixed-footprint and plain, and special-cases textures
and samplers out of the plain-type rules — that side is complete. Function scope
([variable-declaration-statement-ast.ts:88](source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts:88))
demands only `storable` for everything and `constructible` for `Const`, but WGSL requires a
constructible store type for function-scope `var` and for `private`. Until that widens, a texture or
an array of textures passes a local declaration.

The texture and sampler special-cases are written as `instanceof` and become `isKind(Texture)` /
`isKind(Sampler)` once those two types migrate.

### `conversionRankTo` and `accepts` — the two directions

`conversionRankTo` replaced `isCastableInto`. Zero means the types are the same, infinity means no
conversion exists, and everything between is WGSL's automatic-conversion rank. One method instead of
two, and the boolean answer is `!== Number.POSITIVE_INFINITY`.

Only two types in the language are conversion *sources* — `AbstractInt` and `AbstractFloat`. Every
other pair is identity or impossible. So the rank table lives entirely on `PgslNumericType`, ordered
as the spec orders it:

- **AbstractFloat** → `Float & Concrete & !Float16` is 1, `Float16` is 2.
- **AbstractInt** → `SignedInteger` is 3, `UnsignedInteger` is 4, `Float & Abstract` is 5,
  `Float & Concrete & !Float16` is 6, `Float16` is 7.

The ordering is load-bearing: `AbstractInt` reaches the integers before any float, which is what
keeps `1 / 2` integer division. **This table is not written yet** — `PgslNumericType` is unmigrated,
so nothing currently returns a nonzero rank.

Composites lift it. Vector and matrix check their own dimensions and then return the component type's
rank; the array checks its length and does the same. Nothing invents a number of its own.

Two knock-on rules:

- **Materialization comes out of the same table.** An abstract reaching a position that needs a
  concrete type becomes its lowest-ranked concrete target — `i32` for `AbstractInt`, `f32` for
  `AbstractFloat`. There is no reason for a second default-type mapping.
- **For binary operators the pairwise rule is complete.** Try `a → b`, try `b → a`, take whichever is
  finite. No general lattice join is needed, because the only sources are the two abstracts and they
  form a chain. `i32` with `u32`, `f32` with `f16`, and `AbstractFloat` with `i32` all correctly
  fail. Built-in overload sets still need the full ranking across a candidate list.

`accepts` is the other direction: `pTarget.accepts(pSource)` asks whether the target can hold a value
of the source type. The base answers it with the rank plus a reference-identity shortcut.
`PgslGenericType` overrides it, because for a generic the two directions are genuinely different
questions.

### Generics

`PgslGenericType` holds a list of permitted types. Alternatives may themselves contain generics, so
`Vector2<T> | Vector3<T> | Vector4<T>` is three entries sharing one `T` object rather than a cross
product. The open type's `kind` is the AND of its alternatives, which is the sound answer: the body
type-checks against what every admissible binding guarantees.

The quantifier differs by direction, and this is the thing to keep straight:

- **`conversionRankTo` is universal.** A generic converts into a target only if *every* alternative
  does — the worst rank wins. Taking the best would let a `T extends float | integer` value through a
  float-only slot when `T` binds to `i32`.
- **`accepts` is existential.** A concrete argument fits a generic slot when it matches *one*
  alternative.

`equals` is reference identity. Two generics with identical restrictions are different type
parameters: `<T extends float | integer, U extends float | integer>` must not make `T` and `U`
interchangeable, and object identity is what links the `T` inside `Vector3<T>` to the `T` in the
return position. A generic must therefore never be interned.

What is still missing is **binding**. Checking an argument against a constraint is the easy half;
`<T>(value: T): T` also has to bind `T` to the argument's type and substitute into the return type,
with both occurrences resolving to the same slot. That wants a `match(pattern, concrete, bindings)`
routine and its partner `substitute(type, bindings)`, living centrally rather than on each type
class. The binding is a per-call-site map the resolver builds and discards — it never becomes state
on a type.

Two rules to settle before user generics ship: slots are declared in dependency order (`TVector`'s
restriction mentions `TNumber`, so `TNumber` comes first, which also rules out mutual recursion), and
alternatives resolve first-match-wins. And because WGSL has no generic functions, every call must
monomorphise — which is what makes binding mandatory rather than a nicety (§4c).

### Interning

Every type is still constructed fresh. Each converted type now exposes a static `identifierOf` that
produces the cache key from the same arguments its constructor takes, and the constructor uses that
same static for its own `meta.typeName` — so key and type cannot drift, and a lookup never has to
build a type to discover whether it already exists. A backtick descends into a sub-identity, a comma
separates sequence items: ``Vector3`float``, ``Matrix44`float``, ``Array`float,5,fixed``.
Sub-identities are already finished strings on the cached inner type, so composing a key is a concat
rather than a walk.

The cache belongs **on the AST context, not on a static**. Struct and enum resolve their names
against the document, and a struct's capabilities come from its members, so two documents each
declaring a `Light` would collide in a process-wide map. Per-document costs a handful of extra scalar
objects and is self-cleaning.

Two things to settle when wiring it up:

- **The prize is `equals` becoming `===`**, but only if nothing constructs a type outside the cache.
  That means constructors stop being called directly and a single `create` becomes the entry point —
  far easier to commit to now than to retrofit.
- **The array has a live collision.** Its kind depends on the length expression's `fixedState`, which
  `mStaticLength` does not capture: a pipeline-fixed length and a runtime length both leave the
  length unresolved while producing different `FixedFootprint`. `identifierOf` already encodes the
  fixed state as its own field for exactly this reason — keep it there.

`PgslGenericType` deliberately has no `identifierOf`.

### Migration state

On `BasePgslType`: base, array, generic, boolean, invalid, void, string, sampler, struct, vector,
matrix.

Still on the deleted `base-type.ts` interface: **numeric, texture, build-in, pointer, enum** — plus
every AST node that consumes them. The package does not type-check until they land. Numeric is the
one to do next: it carries the rank table, and until it exists the new `Scalar` test in
`resolveVector` reports against numeric components.

## 4. AST → text

**This layer is fine.** `Map<Constructor, ITranspilerProcessor>` with an injected `pTranspile`
callback is a clean visitor; the WGSL backend is a pure leaf with no back-references; adding a GLSL
backend really would just be a second `Transpiler` subclass. It costs 0.20 ms on the medium input
and 0.66 ms on the full one — well under 1 % either way. I would not restructure it. Four specific
things to change:

**4a. The source map is not merely unimplemented — it is unimplementable in the current shape.**

```ts
// transpilation/transpiler.ts:70 and :86
sourceMap: null,
// ...
export type PgslTranspilationResult = { code: string; sourceMap: null; meta: TranspilationMeta; };
```

The *type* is `null`, so there is not even a slot to fill. The reason is that
`ITranspilerProcessor.process` returns a bare `string`: by the time fragments are concatenated,
every node's identity is gone. Fix by returning a fragment tree instead:

```ts
export type CodeFragment = string | { origin: AbstractSyntaxTree; parts: Array<CodeFragment> };
process(node: TTarget, emit: Emit, meta: TranspilationMeta): CodeFragment;
```

Processors barely change — `` `{${parts.join('')}}` `` becomes `frag(node, '{', ...parts, '}')`. A
final flatten walks the tree, tracks output line/column, reads `origin.meta` for the input
position, and emits VLQ mappings. Cost is one small object per node (~1900 on the medium input)
against a 0.20 ms budget — still far below the noise of the stages before it. This is the change
that makes a WGSL compile error in the browser point back at PGSL source, and it depends on §1's
source-unit ids for the "which file" column.

**4b. Backend-agnostic policy leaked into the WGSL backend.** `DocumentAstTranspilerProcessor`
hardcodes which declarations are emitted:

```ts
const lTranspileableChildren = [FunctionDeclarationAst, VariableDeclarationAst, StructDeclarationAst];
// ... anything else is silently skipped
```

A GLSL backend has to duplicate that list, and "alias and enum are inlined, so skip them" is a
property of the *language*, not of WGSL. Move it to `IDeclarationAst.isEmitted`, or make a missing
processor mean "skip" instead of `throw`.

**4c. Backends throw on input the front end accepts.** `FunctionDeclarationAstTranspilerProcessor`
throws `Exception` for functions with multiple headers or generic parameters;
`transpileNumericType` throws for abstract numerics. But `PgslParser.transpile` only skips
transpilation when `incidents.length === 0`
([pgsl-parser.ts:243](source/parser/pgsl-parser.ts:243)) — so any gap between "validator accepts"
and "backend can emit" becomes an **uncaught exception**, not an incident. I hit this directly:

```pgsl
param p: Vector4<float> = new Vector4<float>(1.0, 1.0, 1.0, 1.0);
```
```
Uncaught Error: Unsupported parameter type
    at PgslParserResultParameter.convertType (pgsl-parser-result-parameter.ts:85)
```

(Two defects compounding: D3 lets the vector past `lMustBeScalar()`, then the result converter
throws.) The rule worth adopting: **the transpiler must be total over validated ASTs.** Either the
validator rejects it with a location, or the backend can emit it. For generic user functions that
means a monomorphisation pass that instantiates one concrete function per call-site signature
before transpilation — which is also the only way generics can ever reach WGSL, since WGSL has no
user generics.

**4d. Output is fully minified.** Every processor `join('')`s with no whitespace, so generated
WGSL is one long line. Combined with 4a this makes debugging output painful. Once fragments are a
tree (4a), indentation is a flatten-time concern — you get a pretty-printer without touching a
single processor.

Minor: `TypeAstTranspilerProcessor` keeps its **own** `Map<Constructor, fn>` and recurses via
`this.processType` rather than `pTranspile`
([type-ast-transpiler-processor.ts:96](source/transpilation/wgsl/type/type-ast-transpiler-processor.ts:96)),
so nested types bypass the main dispatch. Harmless today, but it is a second dispatch table to keep
in sync. The type classes are already registered in the main map via the `target` array — routing
inner types through `pTranspile` would remove the duplicate.

---

## 5. Performance
Ordered by measured value ÷ effort. Nothing here trades away readability; three of them *improve* it.

**The rule that decides whether a graph change is worth making:** a dead alternative that fails on
its *first token* costs about **0.13 µs** — merging or reordering those buys almost nothing. What
costs real time is an alternative that **parses a whole sub-expression successfully and is then
discarded**, because successes are never cached and the next alternative parses it again from
scratch. §5.2 was entirely that pattern.

**The grammar side is now finished.** After §5.2 and §5.2c every alternative in the expression
grammar is decided by one token of lookahead, redundancy is 1.03×, and the remaining candidates are
worth fractions of a percent (§5.2d). Everything still on this list is in `core-parser` or in the
AST layer — §5.1, §5.1b and §5.1c together are worth **~30 %** and none of them touch the grammar.

### 5.1 Incident trace on the failure path — **~9 %**

`CodeParserTrace.push` is called once per failed alternative, and each call computes a priority and,
when it wins, allocates an incident object with a nested `range` object.

```
baseline parse() [medium]               6.64 ms
trace.push() no-op                      6.04 ms     (-9 %)
```

Almost all of those incidents are immediately superseded. The cheap fix is to keep only the *fields*
of the current top incident (six primitives on the trace object) instead of allocating an object per
candidate, and to compare priority before doing any other work. `getGraphPosition` — which does
`String.includes('\n')` and possibly `split('\n')` on a token value — should be called only after
the priority comparison has already passed.

### 5.1b The graph failure cache is now overhead — **~13 % on `full`**

The cache and §5.2 **fix the same problem and therefore do not stack**: the parser asking the same
question repeatedly. The cache made the repeat answers free; §5.2 stopped asking twice. Whichever
lands first takes the whole win.

The 2×2, measured with the pre-reroute parser restored side by side:

| grammar | cache | parse `full` | graph pushes |
|---|---|---|---|
| before §5.2 | **on** | 69.8 ms | 80 165 |
| before §5.2 | off | **504.6 ms** | **1 136 868** |
| after §5.2 | on | 36.0 ms | 44 318 |
| after §5.2 | **off** | **29.8 ms** | 45 299 |

So the cache was worth **7.2×** and is now worth 0.83×. Nothing about it changed — the grammar did.
The decisive number is the last column: turning it off now costs **981 extra pushes** (+2 %). That is
the entire amount of work it still saves, and it is less than the `Map.get` on all 44 318 entries.

Isolated runs, one variant per process, best of seven rounds:

| variant | `medium` | `full` |
|---|---|---|
| cache as written (`has` + `set` + `get` per failure) | 5.6 ms | 33.8 ms |
| cache, single `Map` lookup per failure | 5.7 ms | 34.4 ms |
| failure set stored on the `Graph` object, generation-stamped | 5.5–6.1 ms | 32.3 ms |
| no cache | 5.4 ms | **29.4 ms** |

Two things fall out. The three-lookups-per-failure in `popGraphStack` is **not** the cost — fixing it
changes nothing; the cost is the `Map.get` on every *entry*. And no cheaper design rescues the
feature: storing the set on the graph recovers only about a third of the gap. Measure on `full`;
`medium` is inside run-to-run noise (±5 %).

Not PGSL-specific — across every `core-parser` consumer in the repo:

| grammar | attempts | cache hits | work saved |
|---|---|---|---|
| pgsl, medium shader | 8 078 | 244 | 3.0 % |
| `core.xml`, 2 000 char document | 1 265 | **0** | 0.0 % |
| pwb template, 2 000 char | 1 511 | 30 | 2.0 % |

Dropping it is safe by construction: it is pure memoisation of *failures*, so removing it can only
re-attempt things that would fail anyway. Verified on the error path (broken statement mid shader,
unclosed parentheses 8/12/16 deep, garbage tail): no blowup, pushes +6 %, wall time still down.

#### Make it a flag rather than a deletion

`CodeParserConfiguration` already exists ([code-parser.ts:424](../kartoffelgames.core.parser/source/parser/code-parser.ts:424))
and is the right home. Default **`true`** — existing consumers keep today's behaviour and nobody has
to think about it. Two conditions, though:

- **Test both branches.** This package already shipped exactly this pattern: `trimTokenCache` was a
  `CodeParserConfiguration` flag, and when the first revision of this document tested it, it threw
  `Circular graph detected.` The untested path had rotted silently. Run a slice of the parser suite
  with the flag both ways, or the `false` branch is dead code that merely still compiles.
- **Ship the number with the flag.** Nobody can eyeball whether their grammar is redundant, so
  without a way to measure it the flag is a coin flip with a 13 % stake. Expose redundancy —
  attempts ÷ distinct `(graph, token)` pairs — so a user can check their own grammar. PGSL is at
  **1.03×**; anything near 1.0 does not want the cache, anything above ~2 does.

That metric is worth more than the flag: it turns "is my grammar redundant" from a guess into a
number, and a redundancy assertion in the benchmark suite would catch a grammar regression that the
cache would otherwise hide.

The soundness note in §5.6 stays relevant as long as the cache can be switched on.

### 5.1c `graphIsCircular` — ~7 %

```
baseline parse() [medium]               6.64 ms
graphIsCircular() -> false              6.20 ms     (-7 %)
```

Called on every graph entry; walks up the parent chain while `token.cursor === token.start`. With
both expression junctions retired (§5.2) the cycles it guards against are much rarer than the check
is. Not a delete — it is what keeps a malformed self-referencing grammar from hanging — but it
could be skipped for graphs that are known to consume a token before recursing. Lower confidence
than §5.1 and §5.1b; measure before building anything.

### 5.2 Left-factor the expression grammar — ✅ **done, 1.75× on CST**

**Landed.** The D11 coverage was written first, as new steps on the node that ends up on top of the
chain — `Indexing a chained value` in `indexed-value-expression-ast.test.ts` and
`Decomposing a chained value` in `value-decomposition-expression-ast.test.ts`. Both were confirmed
red against the old parser (every step failing on a parse error except `vectorArray[0].x`, which
passes either way and is kept as the control), then the change was applied. Suite is now
**223 passed, 1 331 steps, 0 failed**. The remaining half of this section — precedence tiers for
D1 — is still open.

*This section replaces an earlier version that called the speedup "a rounding error". That was
wrong, and the reason it was wrong is the rule at the top of §5: failure redundancy was already at
1.0×, but the expensive alternatives here are the ones that **succeed** and get discarded.*

`lExpressionSyntaxTreeGraph` ([pgsl-parser.ts:1197](source/parser/pgsl-parser.ts:1197)) is a single
ordered 14-way alternation whose first four entries are the binary operator graphs, each written as
`simple OP expression`. So for every expression in the file the parser does this:

```
try lComparisonExpressionGraph  -> parses the whole left operand, sees no '<', throws it away
try lArithmeticExpressionGraph  -> parses the whole left operand again, sees no '+', throws it away
try lLogicalExpressionGraph     -> parses the whole left operand again, sees no '&&', ...
try lBitOperationExpressionGraph-> parses the whole left operand again, sees no '|', ...
then fall through to the 10 non-binary alternatives and parse it a fifth time
```

None of that is cacheable: the left operand *succeeds* each time. On the medium input,
`lLogicalExpressionGraph` and `lBitOperationExpressionGraph` are entered 247 times each and succeed
**zero** times — 494 complete sub-expression parses built and discarded.

`lSimplelExpressionSyntaxTreeGraph` has the same shape one level down:
`lValueDecompositionExpressionGraph` and `lIndexedValueExpressionGraph` are both
`simple ...`, so the value gets parsed once per suffix kind.

#### The reroute

Two changes, neither of which touches the accepted language:

```
expression := simple ( binaryOperator expression )?      -- was: 4 graphs each re-parsing `simple`
simple     := primary ( '.' name | '[' expression ']' )* -- was: two left-recursive graphs
```

The right-hand side stays right-recursive and un-tiered, so precedence and associativity are
**bit-for-bit unchanged** — `1 * 2 + 3` still parses as `1 * (2 + 3)`. The four operator token
lists survive as named constants and the converter picks the CST type from which one matched, so
`ComparisonExpression` / `ArithmeticExpression` / `LogicalExpression` / `BinaryExpression` all still
come out of the parser exactly as before.

I implemented both, measured, and reverted. Numbers from this machine:

| | CST `medium` | CST `full` | `transpile()` `full` | cache hits `full` |
|---|---|---|---|---|
| today | 12.15 ms | 69.23 ms | 75.43 ms | 116 120 |
| `expression` left-factored | 7.84 ms | 44.44 ms | 54.16 ms | 20 896 |
| **+ postfix chain** | **6.96 ms** | **38.10 ms** | **46.98 ms** | **596** |

**CST 1.75×, whole pipeline −38 %.** The WGSL is byte-identical (same length, same hash, zero
incidents), all **223 tests pass**, and `pgsl-parser.ts` goes from 1 996 to 1 907 lines — four
binary graphs, two left-recursive graphs and two recursive list graphs are replaced by one optional
tail and one suffix list. 596 cache hits on an 8 000-token file means the grammar has essentially
stopped backtracking.

The applied change also left-factors the three expression-headed statements into one
`lExpressionStatementGraph`. That part is readability only — see below.

#### It also fixes code that is currently rejected

Differential test of 47 sources, old parser vs rerouted. 43 produce an identical CST. The other
four are cases **today's grammar rejects and the rerouted one accepts**:

| source | today | rerouted |
|---|---|---|
| `value.member[0]` | **REJECT** | accept |
| `value.member[0].other` | **REJECT** | accept |
| `call().member` | **REJECT** | accept |
| `call()[0]` | **REJECT** | accept |
| `list[0].member` | accept | accept |
| `value.a.b`, `list[0][1]` | accept | accept |

Indexing after a property access, and anything at all after a call, do not parse. This is **D11**,
and nothing in the test suite or the benchmark shaders happens to use those forms. The postfix
chain removes the asymmetry by construction: one suffix list, walked left to right.

#### What does *not* pay — measured, so you do not have to try it

| change | CST `medium` | verdict |
|---|---|---|
| merge literal + string into one graph | 7.84 → 7.70 ms | noise; graph *pushes* went **up** |
| left-factor the three expression-headed statements into one | 6.86 → 6.89 ms | noise (kept anyway: 3 graphs → 1 is a readability win) |

Both reduce the number of alternatives probed, and both are worthless, because the alternatives they
remove fail on their first token, which costs ~0.13 µs. Reordering alternations is in the same
category. **Only go after discarded successes.**

### 5.2c Collapse alternations that one token already decides — ✅ **done, −8 % on CST**

Two groups of graphs differed only in which token introduced them, so each cost one graph entry to
reject. Both collapse into a single graph plus a `Map<PgslToken, ExpressionCstType>`, reading the
discriminating token back through the converter's `pStartToken.type`:

| merge | graphs | pushes `full` | CST `full` |
|---|---|---|---|
| the four binary-operator branches of `combination` | 4 → 1 | 51 864 → 47 850 | 38.65 → 36.10 ms |
| `AddressOf` / `Pointer` / `Unary` → `lPrefixedExpressionGraph` | 3 → 1 | 47 850 → 44 318 | 36.10 → 35.64 ms |

**−7.8 % on CST, −14.5 % on pushes**, output byte-identical, 223 tests green — and seven
near-duplicate graph definitions with seven near-duplicate converter bodies become two graphs and
two maps. Note the second merge bought only −1.3 % for −7.4 % pushes: those probes really were
almost free, and it is in the tree for the readability, not the time.

The trick that makes this readable is worth remembering: **a `Graph` converter receives the graph's
own first token**, so a merged graph can recover which alternative matched from `pStartToken.type`
without hard-coding operator spellings. An inline `GraphNode` cannot — `Graph.define` wraps it, but
the bounding token then belongs to the enclosing graph.

#### 5.2d What is left on the graph — nothing worth taking

`lExpressionSuffixGraph` and `lExpressionSuffixListGraph` are two graph entries per suffix probe
where one would do (~330 pushes, an estimated ~0.1 %), and collapsing them costs the clean
`PgslExpressionSuffix` type. Not worth it. Every other alternation in the grammar is now decided by
a single token. Overall redundancy is **1.03×**. The grammar is done; §5.1/§5.1b/§5.1c are where the
remaining time is.

#### Then add the tiers on top (D1)

The left-factored `expression := simple (op expression)?` is exactly the shape a precedence ladder
grows out of: one flat operator list becomes one level per precedence class. Until that happens
there is still **no precedence and no associativity**:

| source | parsed as |
|---|---|
| `1 + 2 * 3` | `(1 + (2 * 3))` — right by luck |
| `1 * 2 + 3` | `(1 * (2 + 3))` — **wrong precedence** |
| `1 - 2 - 3` | `(1 - (2 - 3))` — **wrong associativity** |
| `1 + 2 < 3 + 4` | `(1 + (2 < (3 + 4)))` — **comparison nested inside arithmetic** |

Because the transpiler emits a flat string, WGSL re-parses it correctly, so *output* is
accidentally right. **Type checking is not**, because it runs on the wrong tree:

```
if (a + 1 < 10) { }      REJECTED: Arithmetic operation not supported for used types.
if ((a + 1) < 10) { }    OK
```

An ordinary shader condition is rejected, and the user is forced to parenthesise everything. The
reroute above does not change any of this — it is behaviour-preserving by design, and I verified
all four rows still parse the same way afterwards. The tiers are the separate, second step:

```
expression      := logicalOr
logicalOr       := logicalAnd  ('||' logicalAnd)*
logicalAnd      := bitOr       ('&&' bitOr)*
bitOr/bitXor/bitAnd/shift ...
comparison      := additive    (('<'|'>'|'<='|'>='|'=='|'!=') additive)?
additive        := multiplicative (('+'|'-') multiplicative)*
multiplicative  := unary       (('*'|'/'|'%') unary)*
unary           := ('-'|'!'|'~'|'&'|'*')? postfix
postfix         := primary     ('.' name | '[' expression ']')*
primary         := literal | string | new | call | '(' expression ')' | name
```

Each level commits on one lookahead token after parsing its operand. Associativity is explicit in
the loop. This is more code in `defineExpressionGraphs`, but it is *more readable*, not less — the
grammar becomes a precedence table you can read top to bottom, instead of an ordering-sensitive
list where `lComparisonExpressionGraph` must come before `lArithmeticExpressionGraph` for reasons
nothing states.

#### On cleaning up the junction graphs

There are exactly two `Graph.define(..., true)` junctions in the whole grammar, and
`lSimplelExpressionSyntaxTreeGraph` ([pgsl-parser.ts:1229](source/parser/pgsl-parser.ts:1229)) is
one of them — the one whose comment says it exists "to speed up parsing by limiting backtracking".
I measured removing it: a copy of the parser with all nine `leftExpression` / `variable` / `value`
references repointed at the full expression graph and the junction deleted.

```
decls (current)                 : 35
decls (simple junction removed) : 35            identical output
current  (simple junction)        13.45 ms
probe    (simple junction removed) 14.19 ms     +5 %
expression shapes                 identical (still wrong)
```

So it no longer prevents anything — termination is handled by the circular-graph check now — but it
is still paying for itself, slightly. **Do not remove it as a standalone cleanup: it would cost 5 %
and change nothing.** Its real problem is that `binary := simple OP expression` is exactly what
makes the grammar right-recursive with no precedence.

The reroute retires both junction flags for free: once `expression` consumes the operator token and
`simple` consumes its suffix tokens, neither is a junction any more, and `graphIsCircular` handles
termination on its own. Nothing to decide, no separate cleanup task.

### 5.3 Stop rebuilding built-in declarations on every parse — 🚩 **the entire small-file story**

`parseAst` ([pgsl-parser.ts:206-224](source/parser/pgsl-parser.ts:206)) calls
`PgslTextureBuildInFunction.texture()`, `PgslNumericBuildInFunction.numeric()` and nine siblings on
**every invocation**, rebuilding ~2 000 lines' worth of CST objects each time. Measured at
**364 µs per `parseAst`**, identical for every input.

This is why the grammar work in §5.2/§5.2c barely moved small shaders — it cannot. Where the time
goes per `transpile()`:

| input | lexing | grammar | **rebuilding built-ins** | ast + wgsl | total | built-in share |
|---|---|---|---|---|---|---|
| `small` | 12 µs | 82 µs | **364 µs** | 11 µs | 469 µs | **78 %** |
| `medium` | 864 µs | 5 082 µs | 364 µs | 3 008 µs | 9 318 µs | 4 % |
| `full` | 4 603 µs | 32 183 µs | 364 µs | 6 787 µs | 43 938 µs | 1 % |

**On a small shader the grammar is 82 µs of a 469 µs call.** Even an infinitely fast parser leaves
~390 µs. For an editor or a tool that transpiles many small shaders this is *the* number, and no
graph change will ever touch it. These are compile-time constants: build them once into a
`static readonly` array.

### 5.4 Replace the linear resolver chain in `TypeDeclarationAst` — readability + a little time

`resolveType` ([type-declaration-ast.ts:396](source/abstract_syntax_tree/general/type-declaration-ast.ts:396))
tries 14 resolvers in sequence, and several of them do
`Object.values(PgslTextureType.typeName).includes(pRawName as any)` — a fresh array allocated per
call, 249 times per shader.

Build one `Map<string, (ctx, name, template) => BasePgslType>` at module load. Struct/alias/enum stay as
context lookups checked first. Besides the allocations, this removes the *implicit* rule that the
order of those 14 `if` statements is the name-shadowing policy — right now that policy is
undocumented and only expressible by moving lines around.

(`TypeDeclarationAst` is processed **379 times** on the medium input.)

### 5.5 Intern types

See §3. The key mechanism is in place — every converted type carries a static `identifierOf` — but
no cache consumes it yet, so the same scalar type is still rebuilt for every declaration that names
it.

The time win is small; the AST stage sits at 11–15 % of the pipeline and this is not where to start.
Do it for the correctness win: once nothing constructs a type outside the cache, `equals` collapses
to `===` and a class of "two `Vector4<float>` objects that are not the same object" bugs stops
existing.

### 5.6 Write down the failure-cache soundness rule — no runtime cost

The graph failure cache (`mGraphFailureCache: Map<Graph, Set<number>>` with `isKnownGraphFailure()`,
[code-parser-process-state.ts:290](../kartoffelgames.core.parser/source/parser/code-parser-process-state.ts:290))
is what keeps failed-attempt redundancy at 1.0×. It is correct only because `.converter()` callbacks
run on success, so a failing graph leaves no side effects behind.

**PGSL's converters break that assumption in spirit already**: they mutate parser state via
`mUserDefinedTypeNames.add` ([pgsl-parser.ts:526](source/parser/pgsl-parser.ts:526), 590, 651, 714).
It happens to be safe today, which is exactly what makes it dangerous — one refactor that moves a
side effect earlier and you get wrong parses that depend on which alternatives were tried first.

Two comments, five minutes, no runtime effect:

- On `mGraphFailureCache`: **a graph that fails must be side-effect-free; converters must not mutate
  observable state.** Repeat it in the `core-parser` docs.
- On the cache's placement: it lives on `CodeParserProcessState`, so it is per-`parse()`. That is
  deliberate — D9 means parser instance state leaks between calls, so a cross-call cache would be
  unsound. Without the comment it reads like a missed optimisation.

### Not worth optimising

- The transpiler proper: 0.20 ms (medium) / 0.66 ms (full).
- The lexer: 1.00 ms (medium) / 4.09 ms (full), a steady 4–5 %. The pattern bucketing and
  first-character pre-check do their job. The WGSL template-list disambiguation is genuinely tricky and
  it is in the right place.
- The AST/type layer. Change it for clarity and correctness (§2, §3), not speed.

---

## 6. Confirmed defects

Every one of these was reproduced by execution against the current tree, not found by reading.
223 tests pass alongside them. Ordered by severity.

| # | Defect | Repro | Effect |
|---|---|---|---|
| **D1** 🚩 | No operator precedence or associativity | `if (a + 1 < 10) { }` | **Ship blocker.** Rejected with `Arithmetic operation not supported for used types.` `1 * 2 + 3` parses as `1 * (2 + 3)`; `1 - 2 - 3` as `1 - (2 - 3)`. §5.2 |
| **D2** | `metaTypes` switch falls through (no `break`) — [pgsl-numeric-type.ts:150](source/abstract_syntax_tree/type/pgsl-numeric-type.ts:150) | `normalize(v)` where `v: Vector4<int>` | Accepted with no incident; emits `normalize(vec4<i32>)`, invalid WGSL. Disappears with the numeric migration — `metaTypes` does not exist on `BasePgslType` |
| **D3** ✅ | Vectors and matrices reported `scalar: true` by copying the component type's `scalar` | `param p: Vector4<float> = ...;` | Passed `lMustBeScalar()`, then **uncaught** `Exception: Unsupported parameter type`. **Fixed** — neither sets `Scalar` any more |
| **D4** | Binary ops return the left operand's type — [arithmetic-expression-ast.ts:143/207/305](source/abstract_syntax_tree/expression/operation/arithmetic-expression-ast.ts:207) | `let x: int = 1 + 2.0;` | Accepted, emits `var x:i32 = 1 + 2.0;` (invalid). `2.0 + 1` is rejected — asymmetric |
| **D11** ✅ | Postfix chains do not compose — `lValueDecompositionExpressionGraph` / `lIndexedValueExpressionGraph` are separate left-recursive alternatives ([pgsl-parser.ts:944](source/parser/pgsl-parser.ts:944), [990](source/parser/pgsl-parser.ts:990)) | `let a: float = value.member[0];` | **Rejected**: `Unexpected token "[". "Semicolon" expected`. Same for `call().x` and `call()[0]`. `list[0].member` works, so the failure is asymmetric and looks arbitrary. §5.2. **Fixed** — covered by `indexed-value-expression-ast.test.ts` and `value-decomposition-expression-ast.test.ts`. |
| **D5** | `#META` replacement inserts a newline — [pgsl-parser.ts:1938](source/parser/pgsl-parser.ts:1938) | decl on source line 2 | Reported at line 3; drift accumulates per directive |
| **D6** | `#IMPORT` split restarts line numbering — [pgsl-parser.ts:1935](source/parser/pgsl-parser.ts:1935) | decl on source line 3 after one import | Reported at line 2 |
| **D7** | No source identity in `CstRange` | two decls named `dup`, one imported | Both report a bare line number; the file is unknowable |
| **D8** | Types were constructed with `range: [0,0,0,0]`, so every type-level incident reported `0:0` | any type-level incident | Types are no longer AST nodes and raise no incidents; each rule moved to the AST node that has a position. Still open for the unmigrated types — texture and build-in report from inside the type |
| **D9** | Parser instance state leaks across `parse()` calls — `mUserDefinedTypeNames` is never cleared at entry ([pgsl-parser.ts:1823](source/parser/pgsl-parser.ts:1823) only overwrites at exit) | `p.parse('alias MyAlias = float;')` then `p.parse('private v: Vector4<MyAlias>;')` | `template[0].type` is `VariableNameExpression` on a fresh parser but `TypeDeclaration` on a reused one — **same input, different CST** |
| **D10** | `PgslInvalidType` propagates instead of absorbing — `equals` returns `false` and `conversionRankTo` returns infinity unconditionally ([pgsl-invalid-type.ts](source/abstract_syntax_tree/type/pgsl-invalid-type.ts)) | one undefined variable used three times | **9 incidents**, 6 of them noise. One unknown typename in a function body gives 7. Behaviour carried over unchanged through the migration. §2 |

D9 is worth calling out separately: it means `parse()` is not a pure function of its input, which
also makes any caching or incremental-parsing work unsound until it is fixed. The fix is to reset
`mUserDefinedTypeNames` at the *start* of `internalParse` for the root document (imports still need
to contribute into the document being parsed).

---

## 7. Order of work

> **The package does not type-check right now.** The type layer is mid-migration: `base-type.ts` is
> deleted, five type classes and every AST node that consumes them still reference it. Finishing that
> (item 0) comes before everything else, because nothing below can be tested until it does.

This is **one change, not a migration.** The numbering below is a dependency order — what has to
exist before what. Several items only look worthwhile once the one before them has landed (the
validation split is unremarkable until the poison type absorbs; the conversion ranks have nowhere to
live until the numeric type migrates), so slicing this into independently releasable stages mostly
buys ceremony.

**🚩 Blocks everything**
0. Finish the type migration — **numeric first** (it carries the rank table), then texture,
   build-in, pointer, enum, then the AST nodes. Replace `isCastableInto` call sites with
   `conversionRankTo` / `accepts`, and the `instanceof PgslTextureType` / `instanceof PgslSamplerType`
   checks in `variable-declaration-ast.ts` with `isKind`. §3.

**🚩 Blocks shipping the language**
1. ✅ **Done.** §5.2a — left-factor the expression grammar (`expression := simple (op expression)?`,
   postfix suffix chain). Behaviour-preserving, fixed **D11**, **1.75× on CST / −38 % end-to-end**,
   90 lines shorter, both expression junctions retired.
2. §5.2b — precedence tiers on top. Fixes **D1**. This is a language defect: until it lands,
   every shader is either over-parenthesised or type-checked against a tree its author did not
   write.
3. D2 — falls out of item 0; `metaTypes` does not survive the numeric migration. *Expect fallout*:
   code relying on the loose matching will start erroring. That is the point.
4. ✅ **Done.** D3 — vectors and matrices no longer claim `Scalar`.
5. D4 — binary operators must compute a result type, not return the left operand's. Wants the rank
   table from item 0; a same-type-or-reject stopgap is still better than what is there.

**One-liners**
6. D5 — `#META` replacement `''` + `^[ \t]*` anchors; same for the `#IMPORT` regex.
7. D9 — clear `mUserDefinedTypeNames` at the start of a root parse.
8. Add the line-count-preservation test for `preprocessText`.

**Performance** — the grammar is finished; everything here is `core-parser` or the AST layer
9. §5.3 — cache built-in declaration CSTs. **78 % of a small-shader `transpile()`**, and the only
   thing that can move that number. Cheapest item in this document.
10. §5.1b — put the graph failure cache behind a `CodeParserConfiguration` flag, default `true`.
    **−13 % on `full`** when off, and worth ≤3 % of attempts in every grammar in the repo
    (`core.xml`: 0 %). Test both branches, and ship a redundancy metric alongside it.
11. §5.1 — stop allocating an incident object per failed alternative. **−9 %**.
12. §5.6 — write down the failure-cache soundness rule. Still needed while the cache can be switched
    on.
13. §5.1c — `graphIsCircular` on every graph entry, ~7 %. Lowest confidence here; measure first.
14. §5.4 — resolver map in `TypeDeclarationAst` (readability first, speed second).

**Type system**
15. §3 — route arithmetic, assignment, return and overload resolution through `conversionRankTo` /
    `accepts`, with materialization reading the same table. Completes D4 and gives real overload
    diagnostics.
16. §3 — widen the function-scope capability check from `storable` to `constructible`, so a texture
    or an array of textures stops passing a local declaration.
17. §3 — the type cache on the AST context, keyed on `identifierOf`. Then collapse `equals` to `===`
    and make a single `create` the only construction path.
18. §3 — generic binding: `match` / `substitute` and a per-call-site binding map. Prerequisite for
    user-defined generics and for §4c.
19. §3 — fold `new-expression-ast.ts` into the shared overload table.

**Separation of concerns**
20. §2 — **fix the poison type (D10).** ~Half a day, and it turns "one typo → nine incidents" into
    "one typo → one incident". Three absorption points: comparisons (`PgslInvalidType.equals` and
    `conversionRankTo` absorb rather than reject), the property-rule guards, and a poison arm in the
    six expression nodes that dispatch structurally. Do it before 21, or 21 will look like it changed
    nothing.
21. §2 — pull the rules out of `onProcess` into `onValidate`, then into a `Validator` walker with its
    own accumulators. **This is where most of the "jank" you feel actually goes away.**
22. §2 — move the rules into processor classes.
23. §2 — explicit declaration-ordering pass; delete `mProcessingStack` and the four duplicated
    `getX()` bodies.

**Debug information**
24. §1 — a source id in `CstRange`; stop splitting on `#IMPORT`; ranges on types; `source` on
    `PgslParserResultIncident`. Fixes D6/D7/D8. The CST change itself is mechanical (§2).

**Transpiler**
25. §4a — `CodeFragment` tree and a real source map (needs 24 for the input side).
26. §4c — monomorphise generic functions; make the backend total over validated ASTs. Needs the
    binding work from 18.
27. §4d — optional pretty-printing, free once 25 lands.

---

## 8. Open questions for you

28. **Should an override-sized array count as fixed-footprint?** `resolveArray` accepts a length at
   `PipelineCreationFixed` or above and `PgslArrayType` sets `FixedFootprint` at the same threshold,
   so an override-sized array is currently treated as sized. WGSL allows override-sized arrays only
   for workgroup variables and treats them as neither constructible nor host-shareable. If that
   distinction is wanted, the two thresholds have to part company deliberately rather than by
   accident.
29. **Are user-defined generic functions meant to reach WGSL output?** The transpiler throws on them
   today. Monomorphisation (§4c) is the answer if yes; a validator rejection with a clear message is
   the answer if not. This is the one place where the right design depends entirely on a product
   decision I cannot make for you.
30. **Is there a target parse budget?** `full` is 8 025 token in 85 ms today. §5.2 alone takes that
   to ~47 ms, and §5.1 + §5.3 on top land it near 42 ms. After that the grammar has stopped
   backtracking (596 cache hits on 8 000 tokens) and the remaining cost is the per-push constant;
   the only lever left would be first-token dispatch *inside* `core-parser`, which is a much larger
   change than anything in this document. If ~42 ms for a 1 400-line shader is fine, §5 is finished
   and everything else here is correctness and readability work.
   after all. If 85 ms for a 1 400-line shader is fine, then §5 is finished after items 8–10 and
   everything else in §7 is correctness and readability work.

---

*Measurements: Deno 2.9.6, Windows, `benchmark/` inputs (`small` 23 tok, `medium` 1 585 tok,
`full` 8 025 tok). Suite: 223 passed, 1 331 steps, 0 failed. Every defect in §6 and every number in §0 and §5 was
produced by execution against the current tree, not by reading.*
