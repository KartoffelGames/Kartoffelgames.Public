# PGSL architecture review

Review of `@kartoffelgames/core-pgsl` covering the five questions raised: preprocessor debug
information, CST→AST/validation separation, the type system, AST→text conversion, and performance.

> **Revision 2** — re-measured after the `core-parser` performance work (graph failure caching,
> lexer pattern bucketing, generator rework). §0 and §5 are rewritten against the new numbers;
> §5.3 is now done. All nine defects in §6 were re-verified and still reproduce unchanged.

All numbers below are measured on this machine (Deno 2.9.6, Windows) against the reworked
`benchmark/` inputs. Baseline: **223 tests passing, 0 failing**.

| input | lines | chars | tokens |
|---|---|---|---|
| `small` | 7 | 104 | 23 |
| `medium` (`BenchmarkSource.full(1)`) | 302 | 8 536 | 1 585 |
| `full` (`BenchmarkSource.full(8)`) | 1 387 | 42 710 | 8 025 |

---

## 0. Where the time and the complexity actually are

### After the `core-parser` work

The failure cache did what §5.3 predicted, and then some. Per-token CST cost dropped from
**~53 µs to ~10 µs — about 5× faster**, and the backtracking it was aimed at is essentially gone:

| metric (per parse) | rev 1 | rev 2 | change |
|---|---|---|---|
| graph pushes **per token** | 74 | 8.7 | **8.5× fewer** |
| redundancy (attempts ÷ distinct `(graph, token)` pairs) | 22.6× | **1.6×** | near-optimal |
| failed-attempt redundancy | 26.2× | **1.0×** | every failure computed exactly once |
| failed share of all attempts | 83.1 % | 46.7 % | |
| `circularGraphs` entries copied per token | 294 | 21.5 | 13.7× fewer |
| CST µs/token | ~53 | ~10–11 | **~5×** |

A 1.0× failure redundancy means the cache is perfect — no failing graph is ever retried at a
position it has already failed at. There is nothing left to win from memoisation.

### Current stage split

| Stage | `medium` (1 585 tok) | `full` (8 025 tok) | Share |
|---|---|---|---|
| `new PgslParser()` (once per process) | 0.33 ms | 0.33 ms | — |
| Lexing | 0.94 ms | 4.12 ms | 4–5 % |
| **CST construction (graph resolution)** | **15.4 ms** | **85.3 ms** | **82 %** |
| Built-in declaration CST rebuild (per `parseAst`) | 0.41 ms | 0.41 ms | 0.4 % |
| CST → AST + type resolution + validation | 2.5 ms | 9.3 ms | 9–13 % |
| AST → WGSL text (`Transpiler.transpile`) | 0.20 ms | 0.66 ms | 0.6 % |
| **Total `transpile()`** | **18.7 ms** | **104.5 ms** | |

So the shape of the problem has not changed, only its scale: **CST construction is still 82 % of
the runtime** (down from 91 %), the AST/type layer is 9–13 %, and text generation is under 1 %.

What *has* changed is the *kind* of work left in the parser. With redundancy at 1.6×, the
remaining cost is no longer repeated backtracking — it is the constant cost of each of the ~8.7
graph pushes per token (~1.1 µs each). That moves the remaining targets from "do less work" to
"make each attempt cheaper", and it changes the argument for §5.2: **precedence tiers are now a
correctness fix, not a performance fix.**

The CST grammar still has **no operator precedence and no associativity**, so `if (a + 1 < 10)` is
still rejected. See §5.2 and defect D1.

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

You already have the right pattern in this codebase — it is `Transpiler` +
`ITranspilerProcessor`. A `Map<Constructor, Processor>`, an injected recursion callback, one
processor class per node type, all backend-specific logic in one directory. It is the cleanest
part of the package (§4). **Mirror it for validation.**

Three passes over an immutable AST:

| Pass | Input | Output | Context | Incidents |
|---|---|---|---|---|
| **A. Build** | `Cst` | `Ast` (structure only) | none | none |
| **B. Resolve** | `Ast` | resolved data (types, symbols, address spaces) | read+write | resolution only ("unknown name", "cyclic alias") |
| **C. Validate** | resolved `Ast` | incidents | read-only | all semantic rules |

```ts
export interface IValidationProcessor<TAst extends AbstractSyntaxTree> {
    readonly target: Constructor<TAst> | Array<Constructor<TAst>>;
    validate(node: TAst, ctx: ValidationContext, descend: Descend): void;
}

export class Validator {
    private readonly mProcessors: Map<Constructor, IValidationProcessor<AbstractSyntaxTree>>;
    public addProcessor<T>(p: IValidationProcessor<T>): void { /* as Transpiler.addProcessor */ }
    public validate(root: AbstractSyntaxTree): ReadonlyArray<Incident> { /* as Transpiler.transpile */ }
}
```

Then `VariableDeclarationAst` keeps the ~40 lines that produce data, and its ~200 lines of rules
move to `validation/declaration/variable-declaration-validator.ts`. That directory becomes the
place you read to answer "what are the rules for `uniform`?" — today that answer is buried in the
middle of a builder.

Extra wins that fall out of this:
- Rule sets can be swapped per target (WGSL vs GLSL have different restrictions).
- Validators can be unit-tested against a hand-built AST, with no parser involved.
- The 221 `pushIncident` calls end up in one place, so you can attach codes/severities to them.

**Replace lazy processing with an explicit ordering pass.** Between A and B, walk the module-scope
declarations, build the dependency graph (alias → its type, struct → member types, function →
called functions), topologically sort it, and process in that order. Cycles become a proper
incident: `Circular declaration: A -> B -> A`. This deletes `mProcessingStack`, the four
duplicated `getX()` bodies, and `callInBuildInScope`.

### Migration path (incremental — no rewrite)

You do not have to do this in one go, and the intermediate states are shippable:

1. **Mechanical extraction.** In each AST class, move every check that only *reads* and calls
   `pushIncident` out of `onProcess` into a new `protected onValidate(ctx)`. `onProcess` calls it
   at the end. Behaviour identical; tests stay green. This alone tells you exactly how much of each
   class is validation (for `VariableDeclarationAst`: ~200 of 260 lines).
2. **Add the `Validator`.** Walk the tree after processing, call `onValidate`. Now conversion and
   validation are two passes even though the code still lives together.
3. **Move `onValidate` bodies into processor classes**, one node type at a time.
4. **Only then** split `onProcess` into `build()` (no context) and `resolve(ctx)`.

`IDeclarationAst.register()` is already step 0 of this — a separate binding phase that exists for
declarations but not for anything else. Formalising it is the natural next move.

---

## 3. The type system

### Your "tag" idea is right — and you already implemented it

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
type is then itself subject to the ordinary conversion rules. Tags stay — they become the leaf case
`{ kind: 'tag' }`. Nothing else about your design has to change.

This also **subsumes `PgslNewExpressionCallDefinition`**. `new-expression-ast.ts` is 674 lines,
almost all of it a bespoke overload table for vector/matrix/array constructors with its own
matching loop (`DEFINTION_CHECK:` label, min/max parameter counting). With patterns, vector
constructors become ordinary entries in the same overload table as the builtins, and that file
drops to roughly the size of `FunctionCallExpressionAst`.

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
  [type-ast-transpiler-processor.ts:205](source/transpilation/wgsl/type-ast-transpiler-processor.ts:205)
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

The time win is small (the whole AST stage is 2.5 ms on medium), but `equals()` becomes `===` for the common
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
([type-ast-transpiler-processor.ts:96](source/transpilation/wgsl/type-ast-transpiler-processor.ts:96)),
so nested types bypass the main dispatch. Harmless today, but it is a second dispatch table to keep
in sync. The type classes are already registered in the main map via the `target` array — routing
inner types through `pTranspile` would remove the duplicate.

---

## 5. Performance

Ordered by measured value ÷ effort against the **current** code. Nothing here trades away
readability; two of them *improve* it.

### 5.1 Copy-on-write for `circularGraphs` — **still 25 %, ~1 hour, no API change**

Still open. [`code-parser-process-state.ts:422`](../kartoffelgames.core.parser/source/parser/code-parser-process-state.ts:422)
now uses a plain `Map` instead of `Dictionary`, but it is still an eager copy on every push:

```ts
circularGraphs: new Map<Graph<TTokenType>, number>(lLastGraphStack.circularGraphs),
```

The failure cache cut the number of pushes by 8.5× per token, so the absolute cost fell — but
because total parse time fell further, this is now a *larger* share of what remains:

```
graph pushes                 : 13,819   (medium input, 1585 token)
circularGraph entries copied : 34,110   avg 2.5, max 9
avg graph stack depth        : 46.3     max 83
```

Re-ran the same semantics-preserving copy-on-write parent chain
(`{ graph, count, parent }`, walked on lookup, reset to `null` on token progress) against the
current code:

```
baseline parse() [medium]              17.65 ms
circularGraphs copy -> COW chain       13.21 ms     (-25 %)
sanity: 35 declarations, identical to reference
```

**25 % of parse time for a change confined to four methods in one file.** `moveNextToken` and
`popGraphStack` also still allocate a fresh `Map` whenever the map is non-empty; with a chain both
become `= null`. Note the average stack depth went *up* (38.5 → 46.3), so the copy is not getting
cheaper on its own.

This lives in `core-parser`, so it benefits every parser you build on it.

### 5.1b Incident trace on the failure path — **12 %, small**

New entry: this was 3 % in rev 1 and did not make the list. Now that the total is ~3× smaller it
is worth naming. `CodeParserTrace.push` is called **10 614 times** for the medium input — once per
failed alternative — and each call computes a priority and, when it wins, allocates an incident
object with a nested `range` object.

```
baseline parse() [medium]              17.65 ms
trace.push() no-op                     15.54 ms     (-12 %)
```

Most of those 10 614 incidents are immediately superseded. The cheap fix is to keep only the
*fields* of the current top incident (six primitives on the trace object) instead of allocating an
object per candidate, and to compare priority before doing any other work. `getGraphPosition` — 810
calls, each doing `String.includes('\n')` and possibly `split('\n')` on a token value — should be
called only once the priority check has already passed.

### 5.2 Give the expression grammar precedence tiers — **now a correctness fix, not a perf fix**

**This is the item the `core-parser` work changed most.** In rev 1 this was the biggest performance
item on the list. It no longer is — the failure cache already absorbed the win:

```
                        rev 1                          rev 2
fail share              83.1%                          46.7%
fail redundancy         26.2x                          1.0x
overall redundancy      22.6x                          1.6x
```

At 1.0× failure redundancy each dead alternative is tried exactly once per position, which is the
floor for an ordered-choice grammar. Tiering the grammar would still cut the 46.7 % of attempts
that fail, but it can no longer deliver anything like the multiple it once promised. **Do it for
D1, and treat any speedup as a bonus.**

`lExpressionSyntaxTreeGraph` ([pgsl-parser.ts:1197](source/parser/pgsl-parser.ts:1197)) is a single
ordered 14-way alternation, and each binary operator graph is written as
`simple OP expression` — right-recursive, one flat level, no precedence. There is **no precedence
and no associativity** (re-verified on current code):

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

### 5.3 Memoise failures (packrat) — ✅ **done**

Implemented as `mGraphFailureCache: Map<Graph, Set<number>>` with
`isKnownGraphFailure()`, keyed by `mAbsoluteTokenIndexOffset + cursor`
([code-parser-process-state.ts:304](../kartoffelgames.core.parser/source/parser/code-parser-process-state.ts:304),
[:375](../kartoffelgames.core.parser/source/parser/code-parser-process-state.ts:375)). Measured
result: failure redundancy 26.2× → **1.0×**, graph pushes per token 74 → 8.7, CST µs/token ~53 →
~10. This was the single largest win in the whole review.

Two follow-ups worth writing down now that the cache exists:

- **The soundness rule is now load-bearing and still undocumented.** The cache is correct only
  because `.converter()` callbacks run on success only, so a failing graph leaves no side effects.
  PGSL's converters *do* mutate parser state (`mUserDefinedTypeNames.add` at
  [pgsl-parser.ts:526](source/parser/pgsl-parser.ts:526), 590, 651, 714), which means this is one
  refactor away from a very hard bug. Put it in the `core-parser` docs and in a comment on
  `mGraphFailureCache`: **a graph that fails must be side-effect-free; converters must not mutate
  observable state.**
- **The cache lives on `CodeParserProcessState`**, i.e. it is per-`parse()`. That is the safe
  choice given D9 (parser instance state leaks between calls, so a cross-call cache would be
  unsound today). Worth a comment saying so, otherwise it looks like a missed optimisation.

### 5.4 Stop rebuilding built-in declarations on every parse — ~0.4 ms, ~15 minutes

`parseAst` ([pgsl-parser.ts:203-217](source/parser/pgsl-parser.ts:203)) calls
`PgslTextureBuildInFunction.texture()`, `PgslNumericBuildInFunction.numeric()` and seven siblings
on **every invocation**, rebuilding ~2000 lines' worth of CST objects each time. Measured at
0.41 ms per `parseAst`.

This item got *relatively more* important, because the fixed cost stayed put while everything
around it got faster. It is 0.4 % of the `full` input — but the whole `small` pipeline now takes
**0.73 ms**, so rebuilding the built-ins is **over half** of it. For an editor or a tool that
transpiles many small shaders, this is now the dominant cost. These are compile-time constants:
build them once into a `static readonly` array.

### 5.5 Replace the linear resolver chain in `TypeDeclarationAst` — readability + a little time

`resolveType` ([type-declaration-ast.ts:396](source/abstract_syntax_tree/general/type-declaration-ast.ts:396))
tries 14 resolvers in sequence, and several of them do
`Object.values(PgslTextureType.typeName).includes(pRawName as any)` — a fresh array allocated per
call, 249 times per shader.

Build one `Map<string, (ctx, name, template) => IType>` at module load. Struct/alias/enum stay as
context lookups checked first. Besides the allocations, this removes the *implicit* rule that the
order of those 14 `if` statements is the name-shadowing policy — right now that policy is
undocumented and only expressible by moving lines around.

(`TypeDeclarationAst` is processed **379 times** on the medium input.)

### 5.6 Intern types

See §3. **336 numeric-type constructions for 6 distinct types** on the medium input; 708 of 1904
AST nodes (37 %) are type objects. Small time win, meaningful correctness and clarity win.

The AST stage is now 9–13 % of the pipeline rather than 4 %, so this is no longer quite as far
below the noise floor as it was — but it is still the wrong place to start.

### Not worth optimising

- The transpiler proper: 0.20 ms (medium) / 0.66 ms (full).
- The lexer. Now 0.94 ms / 4.12 ms, a steady 4–5 % — the pattern bucketing and first-character
  pre-check did their job. The WGSL template-list disambiguation in there is genuinely tricky and
  it is in the right place.
- The AST/type layer. Change it for clarity and correctness (§2, §3), not speed.

---

## 6. Confirmed defects

Each of these was reproduced by execution, not just by reading. **All nine were re-run against the
current code and reproduce unchanged** — the `core-parser` work did not touch any of them, and did
not introduce new ones (223 tests still pass). Ordered by severity.

| # | Defect | Repro | Effect |
|---|---|---|---|
| **D1** | No operator precedence or associativity | `if (a + 1 < 10) { }` | Rejected with `Arithmetic operation not supported for used types.` Ordinary code needs redundant parens. §5.2 |
| **D2** | `metaTypes` switch falls through (no `break`) — [pgsl-numeric-type.ts:150](source/abstract_syntax_tree/type/pgsl-numeric-type.ts:150) | `normalize(v)` where `v: Vector4<int>` | Accepted with no incident; emits `normalize(vec4<i32>)`, invalid WGSL |
| **D3** | Vectors report `scalar: true` — [pgsl-vector-type.ts:195](source/abstract_syntax_tree/type/pgsl-vector-type.ts:195) copies the inner type's `scalar` | `param p: Vector4<float> = ...;` | Passes `lMustBeScalar()`, then **uncaught** `Exception: Unsupported parameter type` |
| **D4** | Binary ops return the left operand's type — [arithmetic-expression-ast.ts:143/207/305](source/abstract_syntax_tree/expression/operation/arithmetic-expression-ast.ts:207) | `let x: int = 1 + 2.0;` | Accepted, emits `var x:i32 = 1 + 2.0;` (invalid). `2.0 + 1` is rejected — asymmetric |
| **D5** | `#META` replacement inserts a newline — [pgsl-parser.ts:1938](source/parser/pgsl-parser.ts:1938) | decl on source line 2 | Reported at line 3; drift accumulates per directive |
| **D6** | `#IMPORT` split restarts line numbering — [pgsl-parser.ts:1935](source/parser/pgsl-parser.ts:1935) | decl on source line 3 after one import | Reported at line 2 |
| **D7** | No source identity in `CstRange` | two decls named `dup`, one imported | Both report a bare line number; the file is unknowable |
| **D8** | Types are constructed with `range: [0,0,0,0]` | any type-level incident | 23 `pushIncident` sites report `0:0` |
| **D9** | Parser instance state leaks across `parse()` calls — `mUserDefinedTypeNames` is never cleared at entry ([pgsl-parser.ts:1823](source/parser/pgsl-parser.ts:1823) only overwrites at exit) | `p.parse('alias MyAlias = float;')` then `p.parse('private v: Vector4<MyAlias>;')` | `template[0].type` is `VariableNameExpression` on a fresh parser but `TypeDeclaration` on a reused one — **same input, different CST** |

D9 is worth calling out separately: it means `parse()` is not a pure function of its input, which
also makes any caching or incremental-parsing work unsound until it is fixed. The fix is to reset
`mUserDefinedTypeNames` at the *start* of `internalParse` for the root document (imports still need
to contribute into the document being parsed).

---

## 7. Suggested order of work

Grouped so each step is independently shippable and keeps the suite green.

**Quick correctness wins (a day, mostly one-liners)**
1. D2 — add `break` to the `metaTypes` switch. *Expect fallout*: code relying on the loose matching
   will start erroring. That is the point.
2. D3 — `scalar: false` for vectors and matrices.
3. D5 — `#META` replacement `''` + `^[ \t]*` anchors; same for the `#IMPORT` regex.
4. D9 — clear `mUserDefinedTypeNames` at the start of a root parse.
5. Add the line-count-preservation test for `preprocessText`.

**Performance (a few days, no design change)**
6. §5.1 — copy-on-write `circularGraphs` in `core-parser`. **−25 %**, still the largest remaining
   single item.
7. §5.1b — stop allocating an incident object per failed alternative. **−12 %.**
8. §5.4 — cache built-in declaration CSTs. Now **over half** of the small-shader pipeline.
9. §5.5 — resolver map in `TypeDeclarationAst`.

~~§5.3 — memoise failures~~ ✅ **done.** 26.2× → 1.0× failure redundancy, ~5× CST speedup.

**Grammar (now a correctness item, not a performance one)**
10. §5.2 — precedence tiers for expressions. Fixes D1. The performance argument has largely been
    absorbed by the failure cache (redundancy is already 1.6×), so judge this on D1 alone.

**Type system**
11. §3 — `conversionRank` / `commonType` / `concretize`; route arithmetic, assignment, return and
    overload resolution through them. Fixes D4 and gives real overload diagnostics.
12. §3 — type interning; close the tag union.
13. §3 — type patterns for generics; fold `new-expression-ast.ts` into the shared overload table.

**Debug information**
14. §1 — source-unit ids in `CstRange`; stop splitting on `#IMPORT`; ranges on types;
    `source` on `PgslParserResultIncident`. Fixes D6/D7/D8.

**Separation of concerns**
15. §2 steps 1–2 — mechanical `onValidate` extraction plus a `Validator` walker. Shippable on its
    own and immediately makes the rules readable.
16. §2 steps 3–4 — move rules into processor classes; then split build/resolve.
17. §2 — explicit declaration-ordering pass; delete `mProcessingStack` and the four duplicated
    `getX()` bodies.

**Transpiler**
18. §4a — `CodeFragment` tree and a real source map (needs 14 for the input side).
19. §4c — monomorphise generic functions; make the backend total over validated ASTs.
20. §4d — optional pretty-printing, free once 18 lands.

---

## 8. Open questions for you

1. **Was the flat expression alternation deliberate?** It reads as though precedence was meant to
   be handled by alternation order (`lComparisonExpressionGraph` before
   `lArithmeticExpressionGraph`). If there was a reason not to use precedence tiers — a
   `core-parser` limitation with left recursion, say — that changes the recommendation in §5.2.
   The `isJunction` flag and `MAX_JUNCTION_CIRCULAR_REFERENCES` suggest left recursion is at least
   partially supported.
2. **Is `metaTypes` intended as the general tag mechanism, or a stopgap for builtin signatures?**
   My recommendation in §3 assumes the former.
3. **Are user-defined generic functions meant to reach WGSL output?** The transpiler throws on them
   today. Monomorphisation (§4c) is the answer if yes; a validator rejection with a clear message
   is the answer if not.
4. **`trimTokenCache` appears to be broken.** It still defaults to `false` and PGSL never sets it
   ([pgsl-parser.ts:106](source/parser/pgsl-parser.ts:106) calls `super(new PgslLexer())` with no
   config). Forcing it on makes the medium benchmark input fail outright:

   ```
   trimTokenCache = false (default): 35 declarations
   trimTokenCache = true           : THREW -> Circular graph detected.
   ```

   I did not check whether this predates the recent work. Either way, it now carries real weight:
   the failure cache keys on `mAbsoluteTokenIndexOffset + cursor`, and that offset only advances on
   *linear* pops, so trimming and the cache have to agree on token identity. If the option is dead,
   deleting it removes a branch from `popGraphStack` (a hot path) and removes the need for
   `mAbsoluteTokenIndexOffset` entirely. If it is meant to work, it needs a test.
5. **Is there a target parse budget?** `full` is 8 025 token in ~105 ms; `medium` is 1 585 token in
   ~19 ms. §5.1 + §5.1b together should take medium to roughly 12 ms. If you need materially better
   than that, the remaining cost is the per-push constant (~1.1 µs × 8.7 pushes per token) and the
   next step would be reducing pushes per token — which is where a tiered grammar (§5.2) would come
   back into play as a performance item.
6. **Was the `Dictionary` → `Map` change in `pushGraphStack` deliberate, or a side effect?** If you
   were already in there for the failure cache, §5.1 is a natural follow-up in the same file.

---

*Revision 2 measurements: Deno 2.9.6, Windows, `benchmark/` inputs
(`small` 23 tok, `medium` 1 585 tok, `full` 8 025 tok). Baseline suite: 223 passed, 0 failed.
Revision 1 measurements used the former `benchmark/full-transpile.bench.ts` shader
(147 lines / 5513 chars / 1021 tokens); rev 1 → rev 2 comparisons in §0 are normalised per token.*
