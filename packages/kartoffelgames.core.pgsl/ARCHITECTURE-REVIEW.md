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
> Fix: **§5.2**, precedence tiers. It should land before anything else in §7.

All numbers below are measured on this machine (Deno 2.9.6, Windows) against the
`benchmark/` inputs. Suite: **223 tests passing, 0 failing**.

| input | lines | chars | tokens |
|---|---|---|---|
| `small` | 7 | 104 | 23 |
| `medium` (`BenchmarkSource.full(1)`) | 302 | 8 536 | 1 585 |
| `full` (`BenchmarkSource.full(8)`) | 1 387 | 42 710 | 8 025 |

---

## 0. Where the time and the complexity actually are

### The parser

```
graph pushes per token                          8.7
redundancy (attempts / distinct graph+token)    1.6x
failed-attempt redundancy                       1.0x
fail share of all attempts                      46.7%
CST cost                                        7.6-8.8 us/token
```

Failed-attempt redundancy of 1.0× means no failing graph is ever retried at a position it has
already failed at — the floor for an ordered-choice grammar. The parser is close to the minimum
*number* of attempts it can make; what costs is the constant work inside each one.

### Stage split

| Stage | `small` (23 tok) | `medium` (1 585 tok) | `full` (8 025 tok) | Share |
|---|---|---|---|---|
| `new PgslParser()` (once per process) | 0.32 ms | 0.32 ms | 0.32 ms | — |
| Lexing | 0.04 ms | 1.00 ms | 4.09 ms | 5 % |
| **CST construction (graph resolution)** | **0.19 ms** | **11.06 ms** | **66.23 ms** | **78 %** |
| Built-in declaration CST rebuild (per `parseAst`) | 0.40 ms | 0.40 ms | 0.40 ms | 0.5 % |
| CST → AST + type resolution + validation | 0.61 ms | 2.01 ms | 9.43 ms | 11–15 % |
| AST → WGSL text (`Transpiler.transpile`) | <0.01 ms | 0.20 ms | 0.66 ms | 0.8 % |
| **Total `transpile()`** | **0.68 ms** | **13.7 ms** | **85.1 ms** | |

This inverts the intuition the package is built around. **CST construction — the part you called the
cleanest — is 78 % of the runtime.** The AST and type layer you called the jankiest is 11–15 %. The
transpiler is under 1 %.

Which is also the good news:

- **Performance is not the interesting problem.** What is left (§5.1 at ~10 %, §5.3 at 0.4 ms) is
  worth taking, but they are afternoons, not projects. Nothing in this document asks you to trade
  readability for speed.
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

**1d. Types carry no range at all.** Every `IType` implementation calls
`super({ type: 'Type', range: [0, 0, 0, 0] })` in its constructor (e.g.
[pgsl-numeric-type.ts:56](source/abstract_syntax_tree/type/pgsl-numeric-type.ts:56)). There are
**23 `pushIncident` call sites that pass no AST node at all** — all of them in `type/*.ts` —
so messages like `Vector type must have a scalar inner type` and
`Texture sampled type must be a numeric type` are reported at line 0, column 0.

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

**⓪ Give poison a name that generic code can test.** Add `invalid: boolean` to `TypeProperties`.
`instanceof PgslInvalidType` works, but a flag is what lets the guard live in code that only sees
`IType` — including the future `Validator` driver. While you are there, make `PgslInvalidType` a
singleton: 18 sites call `new PgslInvalidType().process(pContext)`, and the class ignores its
context and has `range: [0,0,0,0]` anyway.

**① Comparisons must absorb — and the clean place for that is a base class.**

`IType` is an interface with 14 independent implementations, so there is no single method to patch,
and there are ~60 call sites (40 `isImplicitCastableInto`, 17 `equals`, 3 `isExplicitCastableInto`)
so changing call sites is worse. Introduce a base class instead:

```ts
export abstract class BaseType<TCst extends TypeCst = TypeCst>
    extends AbstractSyntaxTree<TCst, TypeProperties> implements IType {

    public equals(pTarget: IType): boolean {
        if (this.data.invalid || pTarget.data.invalid) { return true; }
        return this.onEquals(pTarget);
    }

    public isImplicitCastableInto(pTarget: IType): boolean {
        if (this.data.invalid || pTarget.data.invalid) { return true; }
        return this.onIsImplicitCastableInto(pTarget);
    }

    // ...same for isExplicitCastableInto

    protected abstract onEquals(pTarget: IType): boolean;
    protected abstract onIsImplicitCastableInto(pTarget: IType): boolean;
    protected abstract onIsExplicitCastableInto(pTarget: IType): boolean;
}
```

Each of the 14 type classes renames `public equals` → `protected override onEquals` and so on.
**No call site changes.** Note this is the same template-method idiom `AbstractSyntaxTree` already
uses for `process()` / `onProcess()`, so it reads like the rest of the codebase rather than like a
new concept. It is also the natural home for §3's `conversionRank` / `commonType` later — which is
the real reason to add it now rather than sprinkling `instanceof PgslInvalidType` into 14 files.

**② Property reads must be skipped, not satisfied.** Do **not** make poison's booleans `true` —
that would make it "constructible" and "host shareable" and let it slip past rules it should never
reach. Guard where the rules *run*, not where the properties are read. There are 71 property reads
(`data.concrete` ×23, `data.fixedFootprint` ×10, `data.storable` ×8, `data.constructible` ×8, …)
but they are concentrated in 9 AST files, and they cluster: a single early return at the top of
`VariableDeclarationAst.validateDeclaration` covers eight of them at once.

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

### Your "tag" idea is right — but the implementation should be patterns, not strings

`TypeProperties.metaTypes`
([i-type.interface.ts:53](source/abstract_syntax_tree/type/i-type.interface.ts:53)) *is* the tag
system, and it is already compositional in exactly the way you would need for generics:

```ts
// pgsl-vector-type.ts:176
for (const lMetaType of this.mInnerType.data.metaTypes) {
    lMetaTypeList.push(`Vector<${lMetaType}>`);
    lMetaTypeList.push(`Vector${this.mVectorDimension}<${lMetaType}>`);
}
```

So `Vector4<float>` carries `Vector<numeric-float>`, `Vector4<numeric>`, `Vector`, … and builtin
signatures already match against those tags
(`{ 'TResult': ['numeric-float', 'Vector<numeric-float>'] }`). You do not need to invent this —
you need to fix it and finish it.

**It is broken.** `PgslNumericType.onProcess`
([pgsl-numeric-type.ts:150](source/abstract_syntax_tree/type/pgsl-numeric-type.ts:150)) has a
`switch` with **no `break` statements**, so every case falls through into all the following ones:

```
metaTypes(int)   = ["int","numeric-integer","numeric",
                    "uint","numeric-integer","numeric",     <- fallthrough
                    "numeric-integer","numeric",
                    "float","numeric-float","numeric",      <- fallthrough
                    "float16","numeric-float","numeric",
                    "numeric-float","numeric"]
```

`int` claims to be `float`, `float16` and `uint`. Consequence, verified end to end:

```pgsl
function main(): Vector4<int> {
    let v: Vector4<int> = new Vector4<int>(1, 2, 3, 4);
    return normalize(v);            // restricted to Vector<numeric-float>
}
```
```
incidents: none
wgsl     : fn main()->vec4<i32>{var v:vec4<i32>=vec4<i32>(1,2,3,4);return normalize(v);}
```

`normalize(vec4<i32>)` is not valid WGSL. **Adding `break` to each case is the single
highest-value one-line fix in the package.** Note that it will likely surface latent failures in
code that was relying on the over-permissive matching, so do it early.

Two follow-ups on the tags themselves:

- Make them a **closed union**, not `string`. `metaTypes: Array<string>` means
  `'numeric-float'` vs `'numericFloat'` is a silent no-match. A
  `type PgslTypeTag = 'numeric' | 'numeric-float' | ...` (with a small helper for the
  parameterised ones) turns those into compile errors.
- Store a `Set`, not an `Array`. Matching is `Array.includes` in three hot places
  ([function-call-expression-ast.ts:238](source/abstract_syntax_tree/expression/single_value/function-call-expression-ast.ts:238),
  [new-expression-ast.ts:574](source/abstract_syntax_tree/expression/single_value/new-expression-ast.ts:574),
  [new-expression-ast.ts:617](source/abstract_syntax_tree/expression/single_value/new-expression-ast.ts:617)),
  which is a linear string scan.

### What tags genuinely cannot do

Tags answer *"is this type in set S?"*. They cannot answer *"given the pattern `Vector<T>` and the
actual `Vector4<float>`, what is `T`?"* — and that is your `Vector4<int>` question. For that you
need a **structural pattern**, not a string:

```ts
type TypePattern =
    | { kind: 'tag';     tag: PgslTypeTag }                             // numeric-float
    | { kind: 'generic'; name: string }                                 // T
    | { kind: 'vector';  dim: number | { generic: string }; inner: TypePattern }
    | { kind: 'matrix';  rows: ...; columns: ...; inner: TypePattern }
    | { kind: 'array';   inner: TypePattern }
    | { kind: 'exact';   type: IType };

function match(pattern: TypePattern, actual: IType, bindings: Map<string, IType>): boolean;
```

Matching fills `bindings`, so `Vector<T>` against `Vector4<float>` binds `T = float`, and the inner
type is then itself subject to the ordinary conversion rules.

**And the `metaTypes` field goes away entirely — replaced by one integer field.**

The complete set of restriction strings that any code in this package ever *queries*:

```
numeric   numeric-integer   numeric-float   boolean
Vector<X>   Vector2<X>   Vector3<X>   Vector4<X>   Vector2   Vector3   Vector4
Matrix2x2<X> ... Matrix4x4<X>
Array   Pointer<Array>
```

One grammar production — `pattern := name ( '<' pattern '>' )?` — and every one of them is
structural. They are **already written as patterns** in the tables
(`'Vector<numeric-float>'`, `'Pointer<Array>'`); the current code fakes matching by pre-expanding the
cross-product into strings at construction time. One parse of `medium` builds **6 522 strings to
serve 114 lookups** — it is materialising a combinatorial answer to a question with twelve possible
forms.

#### The kind mask

```ts
/**
 * Every classification a PGSL type can carry, as one bitmask.
 *
 * Layout:
 *   bits  0-12  exclusive kind   - exactly one is set per type
 *   bit     13  BuildIn marker   - combines with the wrapped type's kind
 *   bits 14-19  numeric refinement
 *   bits 20-23  capability       - implied by the kind, never stored per instance
 */
export const BaseTypeKind = (() => {
    // Capabilities. Declared first so the kinds below can fold them in.
    const Scalar = 1 << 20;
    const Composite = 1 << 21;
    const Indexable = 1 << 22;
    const Plain = 1 << 23;

    // Exclusive kinds. Exactly one of bits 0-12 is set on any type.
    const Numeric = 1 << 0 | Scalar | Plain;
    const Boolean = 1 << 1 | Scalar | Plain;
    const String = 1 << 2;
    const Void = 1 << 3;
    const Invalid = 1 << 4;
    const Vector = 1 << 5 | Composite | Indexable | Plain;
    const Matrix = 1 << 6 | Composite | Indexable | Plain;
    const Array = 1 << 7 | Indexable | Plain;
    const Pointer = 1 << 8;
    const Struct = 1 << 9 | Composite | Plain;
    const Enum = 1 << 10 | Composite;
    const Texture = 1 << 11;
    const Sampler = 1 << 12;

    // Marker. Combined with the kind of the type it wraps.
    const BuildIn = 1 << 13;

    // Numeric refinements. Each states its implication once.
    const Integer = 1 << 14 | Numeric;
    const Float = 1 << 15 | Numeric;
    const Signed = 1 << 16 | Integer;
    const Unsigned = 1 << 17 | Integer;
    const Half = 1 << 18 | Float;
    const Abstract = 1 << 19;

    return {
        Scalar, Composite, Indexable, Plain,
        Numeric, Boolean, String, Void, Invalid, Vector, Matrix, Array, Pointer, Struct, Enum, Texture, Sampler,
        BuildIn,
        Integer, Float, Signed, Unsigned, Half, Abstract
    } as const;
})();

export type BaseTypeKind = number;

/** Bits 0-12: the exclusive-kind region. */
export const BASE_TYPE_KIND_MASK: number = (1 << 13) - 1;

/**
 * Check whether a kind satisfies a wanted classification.
 * Always use this - `(pKind & pWanted) !== 0` is wrong for composite constants.
 */
export function hasKind(pKind: BaseTypeKind, pWanted: BaseTypeKind): boolean {
    return (pKind & pWanted) === pWanted;
}
```

No `enum` — the IIFE is the idiom `PgslAccessModeEnum.CST` already uses
([pgsl-access-mode-enum.ts:19](source/buildin/enum/pgsl-access-mode-enum.ts:19)), and inside it
`Signed = 1 << 16 | Integer` is ordinary scoping. A flat `{ … } as const` cannot reference its own
keys, so it would need one object per level of the hierarchy, spread back together.

Matching is then a subset test plus a dimension compare:

```ts
function match(pPattern: TypePattern, pType: BaseType, pBindings: Map<string, BaseType>): boolean {
    if (!hasKind(pType.kind, pPattern.kind)) { return false; }
    if (pPattern.dimension !== 0 && pPattern.dimension !== pType.dimension) { return false; }
    if (pPattern.inner) { return match(pPattern.inner, pType.inner!, pBindings); }
    return true;
}
```

#### Why the implications are folded in

`Integer = 1 << 14 | Numeric` rather than a bare bit, because the alternative restates the hierarchy
at every type that declares a kind. Write `uint` as `Scalar | Plain | Integer | Unsigned`, forget
`Numeric`, and every `numeric` restriction silently stops matching `uint` — no error, no incident,
just an overload that never resolves. That is D2 again, in a new place. Folded, `uint` writes
`BaseTypeKind.Unsigned` and cannot be an integer that is not numeric.

The cost is one rule: **composite constants make `!== 0` wrong**, because `Numeric` and `Integer`
share a bit. Always go through `hasKind`.

If you prefer each type to spell out its full mask — which does read better at the declaration
site — that is a fair trade, but write the hierarchy down once as data and assert it in a test,
otherwise you have swapped an impossible bug for a silent one:

```ts
const IMPLIES: Array<[label: string, when: BaseTypeKind, then: BaseTypeKind]> = [
    ['Integer => Numeric', BaseTypeKind.Integer, BaseTypeKind.Numeric],
    ['Signed  => Integer', BaseTypeKind.Signed, BaseTypeKind.Integer],
    ['Vector  => Composite|Indexable', BaseTypeKind.Vector, BaseTypeKind.Composite | BaseTypeKind.Indexable]
    // ...
];
```

#### What goes in the mask and what stays a property

`Scalar`, `Composite`, `Indexable` and `Plain` are folded into the kinds, so they are never stored
per instance. **That is what kills D3**: today `PgslVectorType` computes
`scalar: this.mInnerType.data.scalar` and so reports a vector of scalars as scalar. With the fold,
`Vector` does not carry `Scalar` and cannot be made to.

`storable`, `hostShareable`, `constructible`, `fixedFootprint` and `concrete` stay booleans in
`TypeProperties`. Not because they are cheaper that way — they are not, and it would not matter —
but because they are **not a function of the kind**: an `Array` is constructible only if its element
type is and its length is fixed. A bit that has to be computed per instance is the same manual work
as a boolean with none of the folding benefit, and it costs headroom you will want: 13 kinds + marker
+ 6 refinements + 9 properties is 29 of the 31 usable bits (JS bitwise ops are signed, so bit 31 is
not really yours), and `PgslTextureType` alone has 17 sub-kinds.

Two more decisions in that block: `BuildIn` is a marker rather than a kind, because
`PgslBuildInType` delegates everything to its underlying type — its mask is `underlying.kind |
BuildIn`. And the six numeric types get distinct masks, so numeric `equals` becomes a mask compare
and `numericTypeName` stops being load-bearing.

`Array` currently declares `composite: false` while carrying `indexable: true`; the block above
mirrors that rather than silently changing it, but WGSL does class arrays as composite, so it is
worth a look.

#### What the change actually touches

- **Removes** tag construction from 14 type files (`pgsl-texture-type.ts` 19 references,
  `pgsl-numeric-type.ts` 18, vector and matrix 7 each, …) and deletes `metaTypes` from
  `TypeProperties`.
- **Changes three query sites**:
  [function-call-expression-ast.ts:238](source/abstract_syntax_tree/expression/single_value/function-call-expression-ast.ts:238),
  [new-expression-ast.ts:574](source/abstract_syntax_tree/expression/single_value/new-expression-ast.ts:574)
  and `:617`. That is the entire consumer surface.
- **Adds** a pattern parser (~40 lines), `match()` (~15 lines), and two fields per type class.

Keep the strings as the notation in the built-in tables — they are the most readable form there
is — and parse them once into a pattern tree at module load. Add a test asserting every restriction
string in every table parses, so a typo fails loudly instead of silently never matching.

This also **subsumes `PgslNewExpressionCallDefinition`**. `new-expression-ast.ts` is 674 lines,
almost all of it a bespoke overload table for vector/matrix/array constructors with its own
matching loop (`DEFINTION_CHECK:` label, min/max parameter counting). With patterns, vector
constructors become ordinary entries in the same overload table as the builtins, and that file
drops to roughly the size of `FunctionCallExpressionAst`.

### Order for the type work

Five steps, in dependency order:

1. **`BaseType` replaces the `IType` interface.** One name, not two. `IType` has 292 occurrences
   across 45 files, but essentially all of them are annotations, so this is a rename plus 14 classes
   changing `implements IType` to `extends BaseType`. Everything below needs somewhere to live, and
   an interface cannot hold behaviour — that is exactly why the poison rule currently has nowhere to
   go.
2. **Delete `isExplicitCastableInto`.** It is dead. PGSL has no cast syntax — no cast token, no cast
   CST node — and `new` only constructs composites (`Array`, `Vector*`, `Matrix*`), so there are no
   scalar conversion constructors either. The only call sites are self-recursion:
   `PgslVectorType`, `PgslMatrixType` and `PgslBuildInType` delegating to their own inner type.
   Fourteen implementations, zero external callers. If PGSL ever grows WGSL-style `f32(x)`
   conversion constructors it comes back — as one method on `BaseType`, expressed through
   `conversionRank`.
3. **Poison absorption** in `BaseType` (D10 ①–③, §2).
4. **One `kind` bitmask plus the pattern matcher replaces `metaTypes`** — above. D2 dies with
   it, and the 90 `instanceof Pgsl*Type` sites go with it.
5. **`conversionRank` / `commonType` / `concretize`** on `BaseType` — below. D4 dies with it.

D3 (`scalar: false` for vectors and matrices) is independent of all of this and can go in at any
point.

**Do not stop after step 4.** Patterns answer *matching* — "does this type satisfy this
constraint?". They do not answer *joining* — "what single type do these candidates agree on?" —
which is what `resolveStrictestType`
([function-call-expression-ast.ts:280](source/abstract_syntax_tree/expression/single_value/function-call-expression-ast.ts:280))
does today by pairwise probing, and what D4 and the abstract-numeric handling actually need. Those
are two independent mechanisms; doing only the first leaves the second exactly as broken as it is
now.

### The actual missing piece: no `commonType` / conversion rank

This is the deeper problem, and I think it is what you are feeling as "the type clusterfuck".

`ArithmeticExpressionAst.processScalarOperation`
([arithmetic-expression-ast.ts:207](source/abstract_syntax_tree/expression/operation/arithmetic-expression-ast.ts:207)):

```ts
if (!pRightType.isImplicitCastableInto(pLeftType) && !pLeftType.isImplicitCastableInto(pRightType)) {
    pContext.pushIncident('Left and right side of arithmetic expression must be the same type.', this);
}
return pLeftType;   // <- always the left one
```

Same at lines 143 and 305. The result type of a binary operation is *whichever operand was written
first*. Verified:

```
let x: int = 1 + 2.0;   ACCEPTED -> var x:i32 = 1 + 2.0;   (invalid WGSL)
let x: int = 2.0 + 1;   REJECTED
```

The same expression with its operands swapped gives different answers, and one of them emits
broken output.

`FunctionCallExpressionAst.resolveStrictestType`
([function-call-expression-ast.ts:280](source/abstract_syntax_tree/expression/single_value/function-call-expression-ast.ts:280))
*is* a correct join — but it exists only for function generic inference. Every other site
(arithmetic, assignment, return, array elements, struct init) rolls its own ad-hoc rule.

**Introduce one shared operation and use it everywhere.** WGSL already specifies exactly this; I
would adopt its conversion-rank table rather than invent one:

```ts
/** null = not convertible. Lower rank = more preferred. 0 = identity. */
export function conversionRank(pFrom: IType, pTo: IType): number | null;

/** The unique T minimising rank(a→T) + rank(b→T). null if none or ambiguous. */
export function commonType(pA: IType, pB: IType): IType | null;

/** AbstractInteger -> int, AbstractFloat -> float. Identity for concrete types. */
export function concretize(pType: IType): IType;
```

Then:

- **Binary operators**: `commonType(left, right)`, then check the operator is defined for that type.
  Symmetric by construction; the `1 + 2.0` bug cannot recur.
- **Assignment / return / parameter passing**: `conversionRank(source, target) !== null`.
- **Overload resolution** (functions, `new`, builtins): for each candidate, sum the parameter
  ranks; pick the minimum; report *ambiguous* on a tie. This replaces "first match wins" in both
  `matchFunctionHeader` and the `DEFINTION_CHECK` loop, and it makes real diagnostics possible:
  `no overload of 'sin' accepts (int); candidates: sin(float), sin(float16), sin(Vector<float>)`.
  Today the message for `sin(someInt)` is
  `Function block return type does not match the declared return type.`
- **Materialisation**: call `concretize()` at the defined points (variable declaration without an
  explicit type, argument to a concrete parameter, struct member initialiser). Right now
  abstract-to-concrete is emergent — it happens to work because literals are emitted verbatim and
  WGSL has its own abstract types, but
  [type-ast-transpiler-processor.ts:205](source/transpilation/wgsl/type/type-ast-transpiler-processor.ts:205)
  hard-`throw`s if an abstract type ever reaches output. Making materialisation explicit turns that
  landmine into a rule.

### Aliases

`resolveAlias` returns `lAlias.data.underlyingType`
([type-declaration-ast.ts:61](source/abstract_syntax_tree/general/type-declaration-ast.ts:61)), so
the alias name is gone the moment it is resolved. Transparency is the right semantics, but it means
diagnostics say `Vector4<float>` where the user wrote `Position`.

`IType.shadowedType` already exists for exactly this purpose and is currently almost unused (every
type defaults it to `this`). Populate it in `resolveAlias`, unwrap it in `equals` /
`conversionRank` / transpilation, and use it for display names. Zero new concepts.

### Interning

`PgslNumericType` is constructed and processed **336 times** on the medium input, for **6 distinct
types**. In total, 708 of 1904 AST nodes (37 %) are type objects. Each one allocates a fresh
`TypeProperties` object plus a `metaTypes` array of ~16 strings.

```ts
PgslNumericType.get('int')                  // interned singleton
PgslVectorType.get(4, PgslNumericType.get('float'))   // cached by structural key
```

The time win is small (the whole AST stage is 2.0 ms on medium), but `equals()` becomes `===` for the common
case, tag sets are computed once, and a whole class of "two `Vector4<float>` objects that are not
the same object" bugs disappears.

---

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
Ordered by measured value ÷ effort. Nothing here trades away readability; two of them *improve* it.

The parser is already close to the minimum *number* of attempts an ordered-choice grammar can make —
8.7 graph pushes per token, 1.6× overall redundancy, 1.0× on failures. What is left is the constant
cost of each attempt, so the remaining items are small and there are not many of them.

### 5.1 Incident trace on the failure path — **~10 %, the largest single item left**

`CodeParserTrace.push` is called **10 614 times** on the medium input — once per failed
alternative — and each call computes a priority and, when it wins, allocates an incident object
with a nested `range` object.

```
baseline parse() [medium]              12.39 ms
trace.push() no-op                     11.10 ms     (-10 %)
```

Almost all of those 10 614 incidents are immediately superseded. The cheap fix is to keep only the
*fields* of the current top incident (six primitives on the trace object) instead of allocating an
object per candidate, and to compare priority before doing any other work. `getGraphPosition` —
which does `String.includes('\n')` and possibly `split('\n')` on a token value — should be called
only after the priority comparison has already passed.

This is the last item in this document with a double-digit percentage behind it.

### 5.2 Give the expression grammar precedence tiers — 🚩 **the ship blocker (D1)**

This is not a performance item. The parser already tries each dead alternative exactly once per
position:

```
fail share          46.7%
fail redundancy     1.0x      <- the floor for an ordered-choice grammar
overall redundancy  1.6x
```

Tiering the grammar would cut the 46.7 % of attempts that fail, but with redundancy already at the
floor it cannot deliver a multiple. **Judge this change on D1 alone and treat any speedup as a
rounding error.** It is, on the other hand, the one defect in this document that makes the
*language* wrong rather than merely leaky, and that is why this section blocks shipping.

At 1.0× failure redundancy each dead alternative is tried exactly once per position, which is the
floor for an ordered-choice grammar. **Judge this change on D1 alone and treat any speedup as a
rounding error.** It is, on the other hand, the one defect in this document that makes the
*language* wrong rather than merely leaky, and it is the reason this section is marked as blocking.

`lExpressionSyntaxTreeGraph` ([pgsl-parser.ts:1197](source/parser/pgsl-parser.ts:1197)) is a single
ordered 14-way alternation, and each binary operator graph is written as
`simple OP expression` — right-recursive, one flat level, no precedence. There is **no precedence
and no associativity**:

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

An ordinary shader condition is rejected, and the user is forced to parenthesise everything.

The standard fix is one graph per precedence level, each left-recursive via iteration:

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
makes the grammar right-recursive with no precedence. The tier ladder above deletes both junctions
as a byproduct *and* fixes D1. One change, not two.

### 5.3 Stop rebuilding built-in declarations on every parse — ~0.4 ms, ~15 minutes

`parseAst` ([pgsl-parser.ts:203-217](source/parser/pgsl-parser.ts:203)) calls
`PgslTextureBuildInFunction.texture()`, `PgslNumericBuildInFunction.numeric()` and seven siblings
on **every invocation**, rebuilding ~2000 lines' worth of CST objects each time. Measured at
0.40 ms per `parseAst`.

This is a fixed cost that does not scale with input size, so it dominates small inputs: 0.4 % of the
`full` input, but **over half** of the whole 0.68 ms `small` pipeline. For an editor or a tool that
transpiles many small shaders it is the dominant cost. These are compile-time constants: build them
once into a `static readonly` array.

### 5.4 Replace the linear resolver chain in `TypeDeclarationAst` — readability + a little time

`resolveType` ([type-declaration-ast.ts:396](source/abstract_syntax_tree/general/type-declaration-ast.ts:396))
tries 14 resolvers in sequence, and several of them do
`Object.values(PgslTextureType.typeName).includes(pRawName as any)` — a fresh array allocated per
call, 249 times per shader.

Build one `Map<string, (ctx, name, template) => IType>` at module load. Struct/alias/enum stay as
context lookups checked first. Besides the allocations, this removes the *implicit* rule that the
order of those 14 `if` statements is the name-shadowing policy — right now that policy is
undocumented and only expressible by moving lines around.

(`TypeDeclarationAst` is processed **379 times** on the medium input.)

### 5.5 Intern types

See §3. **336 numeric-type constructions for 6 distinct types** on the medium input; 708 of 1904
AST nodes (37 %) are type objects. Small time win, meaningful correctness and clarity win.

At 11–15 % of the pipeline the AST stage is not far below the noise floor, but it is still the wrong
place to start — do this for the correctness win, not the time.

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
| **D2** | `metaTypes` switch falls through (no `break`) — [pgsl-numeric-type.ts:150](source/abstract_syntax_tree/type/pgsl-numeric-type.ts:150) | `normalize(v)` where `v: Vector4<int>` | Accepted with no incident; emits `normalize(vec4<i32>)`, invalid WGSL |
| **D3** | Vectors report `scalar: true` — [pgsl-vector-type.ts:195](source/abstract_syntax_tree/type/pgsl-vector-type.ts:195) copies the inner type's `scalar` | `param p: Vector4<float> = ...;` | Passes `lMustBeScalar()`, then **uncaught** `Exception: Unsupported parameter type` |
| **D4** | Binary ops return the left operand's type — [arithmetic-expression-ast.ts:143/207/305](source/abstract_syntax_tree/expression/operation/arithmetic-expression-ast.ts:207) | `let x: int = 1 + 2.0;` | Accepted, emits `var x:i32 = 1 + 2.0;` (invalid). `2.0 + 1` is rejected — asymmetric |
| **D5** | `#META` replacement inserts a newline — [pgsl-parser.ts:1938](source/parser/pgsl-parser.ts:1938) | decl on source line 2 | Reported at line 3; drift accumulates per directive |
| **D6** | `#IMPORT` split restarts line numbering — [pgsl-parser.ts:1935](source/parser/pgsl-parser.ts:1935) | decl on source line 3 after one import | Reported at line 2 |
| **D7** | No source identity in `CstRange` | two decls named `dup`, one imported | Both report a bare line number; the file is unknowable |
| **D8** | Types are constructed with `range: [0,0,0,0]` | any type-level incident | 23 `pushIncident` sites report `0:0` |
| **D9** | Parser instance state leaks across `parse()` calls — `mUserDefinedTypeNames` is never cleared at entry ([pgsl-parser.ts:1823](source/parser/pgsl-parser.ts:1823) only overwrites at exit) | `p.parse('alias MyAlias = float;')` then `p.parse('private v: Vector4<MyAlias>;')` | `template[0].type` is `VariableNameExpression` on a fresh parser but `TypeDeclaration` on a reused one — **same input, different CST** |
| **D10** | `PgslInvalidType` propagates instead of absorbing — `equals` / `isImplicitCastableInto` / `isExplicitCastableInto` all return `false` unconditionally ([pgsl-invalid-type.ts:41](source/abstract_syntax_tree/type/pgsl-invalid-type.ts:41)) | one undefined variable used three times | **9 incidents**, 6 of them noise. One unknown typename in a function body gives 7. §2 |

D9 is worth calling out separately: it means `parse()` is not a pure function of its input, which
also makes any caching or incremental-parsing work unsound until it is fixed. The fix is to reset
`mUserDefinedTypeNames` at the *start* of `internalParse` for the root document (imports still need
to contribute into the document being parsed).

---

## 7. Order of work

This is **one change, not a migration.** The numbering below is a dependency order — what has to
exist before what. Several items only look worthwhile once the one before them has landed (the
validation split is unremarkable until the poison type absorbs; `commonType` has nowhere to live
until `BaseType` exists), so slicing this into independently releasable stages mostly buys ceremony.

**🚩 Blocks shipping the language**
1. §5.2 — precedence tiers for expressions. Fixes **D1**. This is a language defect: until it lands,
   every shader is either over-parenthesised or type-checked against a tree its author did not
   write. The two expression junctions disappear with it.
2. D2 — add `break` to the `metaTypes` switch. *Expect fallout*: code relying on the loose matching
   will start erroring. That is the point.
3. D3 — `scalar: false` for vectors and matrices.
4. D4 — binary operators must compute a result type, not return the left operand's (wants item 11's
   `commonType`; a same-type-or-reject stopgap is still better than what is there).

**One-liners**
5. D5 — `#META` replacement `''` + `^[ \t]*` anchors; same for the `#IMPORT` regex.
6. D9 — clear `mUserDefinedTypeNames` at the start of a root parse.
7. Add the line-count-preservation test for `preprocessText`.

**Performance**
8. §5.1 — stop allocating an incident object per failed alternative. **−10 %**, the largest single
   item left anywhere in the pipeline.
9. §5.3 — cache built-in declaration CSTs. **Over half** of the small-shader pipeline.
10. §5.4 — resolver map in `TypeDeclarationAst` (readability first, speed second).
11. §5.6 — write down the failure-cache soundness rule. No runtime effect; prevents a bug that would
    be extremely hard to find.

**Type system**
12. §3 — `conversionRank` / `commonType` / `concretize`; route arithmetic, assignment, return and
    overload resolution through them. Completes D4 and gives real overload diagnostics. Wants
    `BaseType` from item 15 to exist first.
13. §3 — type interning; close the tag union.
14. §3 — type patterns for generics; fold `new-expression-ast.ts` into the shared overload table.

**Separation of concerns**
15. §2 — **fix the poison type (D10).** ~Half a day, and it turns "one typo → nine incidents" into
    "one typo → one incident". Three absorption points: comparisons (via a new `BaseType`),
    property-rule guards, and a poison arm in the six expression nodes that dispatch structurally.
    Do it before 16, or 16 will look like it changed nothing.
16. §2 — pull the rules out of `onProcess` into `onValidate`, then into a `Validator` walker with its
    own accumulators. **This is where most of the "jank" you feel actually goes away.**
17. §2 — move the rules into processor classes.
18. §2 — explicit declaration-ordering pass; delete `mProcessingStack` and the four duplicated
    `getX()` bodies.

**Debug information**
19. §1 — a source id in `CstRange`; stop splitting on `#IMPORT`; ranges on types; `source` on
    `PgslParserResultIncident`. Fixes D6/D7/D8. The CST change itself is mechanical (§2).

**Transpiler**
20. §4a — `CodeFragment` tree and a real source map (needs 19 for the input side).
21. §4c — monomorphise generic functions; make the backend total over validated ASTs.
22. §4d — optional pretty-printing, free once 20 lands.
21. §4d — optional pretty-printing, free once 19 lands.

---

## 8. Open questions for you

1. **Is `metaTypes` intended as the general tag mechanism, or a stopgap for built-in function
   signatures?** My recommendation in §3 assumes the former — that the tag idea you described is the
   one already in the code, and that the work is to finish it (fix D2, close the union, add
   structural patterns for generics) rather than to design a new one. If it was only ever meant to
   match built-in overloads, §3 should be read as "grow it" rather than "fix it".
2. **Are user-defined generic functions meant to reach WGSL output?** The transpiler throws on them
   today. Monomorphisation (§4c) is the answer if yes; a validator rejection with a clear message is
   the answer if not. This is the one place where the right design depends entirely on a product
   decision I cannot make for you.
3. **Is there a target parse budget?** `full` is 8 025 token in 85 ms, `medium` 1 585 token in
   13.7 ms. §5.1 + §5.3 together take medium to roughly 12 ms. Below that, the remaining cost is the
   per-push constant (~1.1 µs × 8.7 pushes per token), and the next lever would be *reducing pushes
   per token* — which is where a tiered grammar (§5.2) would come back as a performance item after
   all. If 85 ms for a 1 400-line shader is fine, then §5 is finished after those two and everything
   else is correctness and readability work.
   after all. If 85 ms for a 1 400-line shader is fine, then §5 is finished after items 8–10 and
   everything else in §7 is correctness and readability work.

---

*Measurements: Deno 2.9.6, Windows, `benchmark/` inputs (`small` 23 tok, `medium` 1 585 tok,
`full` 8 025 tok). Suite: 223 passed, 0 failed. Every defect in §6 and every number in §0 and §5 was
produced by execution against the current tree, not by reading.*
