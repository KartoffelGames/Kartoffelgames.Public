# PGSL architecture review

Open work on `@kartoffelgames/core-pgsl`. Every item below still applies to the current tree. §6 lists
the confirmed defects, §7 the order of work and §8 the questions that need a decision.

> ## 🚩 Ship blocker — D1
>
> **The expression grammar has no operator precedence and no associativity.** `1 * 2 + 3` parses as
> `1 * (2 + 3)`, `1 - 2 - 3` as `1 - (2 - 3)`, and `if (a + 1 < 10)` is rejected outright with
> `Arithmetic operation not supported for used types.`
>
> The emitted WGSL happens to be correct, because the transpiler flattens to a string and WGSL
> re-parses it properly. That is what makes it dangerous: it is invisible in the output and only shows
> up as spurious type errors and as constant folding on the wrong tree. Fix: §5.1.

---

## 1. Debug information

### What is lost

**1a. `#META` shifts every following line by one (D3).** `preprocessText` replaces the directive with
`'\n'`, but the match ends at `$`, i.e. *before* the trailing newline, so each `#META` inserts one
extra line. A declaration on source line 2 is reported on line 3. The leading `^\s*` makes it worse:
when a blank line precedes the directive, `\s*` swallows it and the net offset is zero instead of +1,
so the drift is not even constant.

**1b. `#IMPORT` resets line numbers to 1 (D4).** `preprocessText` splits the source on import lines
and `internalParse` calls `super.parse()` on each fragment separately. Each fragment starts counting at
line 1 again.

**1c. There is no source identity anywhere (D5).** `CstRange` is
`[lineStart, columnStart, lineEnd, columnEnd]`
([general.type.ts](source/concrete_syntax_tree/general.type.ts)). An imported declaration at line 1 of
`shared.pgsl` and a main-document declaration at line 1 are indistinguishable, and
`PgslParserResultIncident` exposes only `message`, `line` and `column`.

**1d. Incidents without a node report at `0:0`.** `convertIncidents` defaults to `0, 0` when no node is
attached. Four calls still pass none: the three clip distance checks in
`TypeDeclarationAst.resolveBuildIn`, and `PgslPointerType.assignAddressSpace`, which reports from inside
a type (see §3.3).

### Suggested fix

**Invariant to adopt: every preprocessor transformation must be line-count preserving.**
`preprocessIfDefReplacements` (pushes `''` for removed lines) and comment stripping (replaces
non-newlines with spaces) already do this. `#META` and `#IMPORT` are the two that break it. A small
unit test pins it down:

```ts
// for every fixture:
assertEquals(preprocessed.split('\n').length, original.split('\n').length);
```

Concretely:

- `#META`: replace with `''`, not `'\n'`, and anchor the regex as `^[ \t]*#META...` so `\s` cannot eat
  newlines. Same anchor for the `#IMPORT` regex.
- `#IMPORT`: stop using `split()`. Blank the import line in place and record
  `Map<lineNumber, importName>`. Then the main document is parsed **once**, with correct line numbers,
  and imports are parsed as separate source units.
- Pass the node for the clip distance incidents, and move the pointer incident out of the type (§3.3).

**Add a source unit id.** The smallest change that fixes 1c:

```ts
// concrete_syntax_tree/general.type.ts
export type CstRange = [
    source: number,            // index into PgslParser's source unit table
    lineStart: number, columnStart: number,
    lineEnd: number, columnEnd: number
];
```

`PgslParser` keeps `Array<{ name: string; text: string }>`; index 0 is the main document, each
`addImport` name gets its own index. `createTokenBoundParameter` takes the id of the unit currently
being parsed. `PgslParserResultIncident` gains a `source: string` getter. This also gives the input
side of a real source map (§4.1).

The CST stays a pure data layer: this is a mechanical change to a data type, no behaviour moves.

### Possible: imports as feature sets — validate before implementing

An import could be represented as a `PgslFeatureSet` instead of being spliced into the document text.
Each import would be parsed as its own source unit into declarations that the document registers the
same way it registers the core feature set. Imports would then never touch the line numbers of the
main document, and `#IMPORT` would no longer need the split in `preprocessText` at all.

This needs to be validated first. Open points:

- **Processing context.** Feature set declarations are built from data and are already processed.
  Imported user code has to be processed against a context, and can reference the core feature set
  and other imports.
- **Environment values.** `#IFDEF` inside an import depends on the parser's environment values, which
  can change after an import was added. A cached import feature set would have to be rebuilt then.
- **Name clashes.** A clash between feature sets throws an `Exception`; a clash in user code has to be
  an incident with a position.
- **Transpilation.** Core feature set declarations are never emitted, but imported structs, functions
  and variables have to be.
- **Meta values and bindings.** `#META` values and binding declarations of an import still have to
  reach the parser result.
- **Nesting and de-duplication.** Imports that import other imports, and an import used twice, which
  `pUsedImports` handles today.
- **Source identity.** Incidents inside an import still need the source unit id from 1c.

---

## 2. Separating CST→AST conversion from validation

### The CST — leave it alone

`concrete_syntax_tree/*.type.ts` is nothing but `type` aliases: every node is `{ type, range } & fields`,
there is no behaviour, no base class, no inheritance, and the only code that touches it is the graph
converters that build it and the AST classes that consume it. That is what a CST should be. Nothing in
this section changes its shape. Its one data problem is the missing source id (§1c).

### Why it is hard right now

`onProcess(context)` is doing five jobs at once. Taking `VariableDeclarationAst.onProcess` as
representative, in one method it:

1. constructs child AST nodes (`new AttributeListAst(...)`, `new TypeDeclarationAst(...)`),
2. resolves names against the context (`pContext.getAlias`, `getStruct`),
3. **mutates** the context (`registerValue`, `registerBindingName`),
4. validates (`validateDeclaration`, cast checks, many `pushIncident` calls),
5. computes derived data (`getAccessMode`, `getAddressSpace`, `getConstantValue`).

Four structural consequences:

- **You cannot build an AST without a context, and you cannot validate without rebuilding.** Every test
  has to go through the full parser.
- **Order is implicit and load-bearing.** Declarations must be registered before their bodies process;
  `AttributeListAst` must exist before `getAccessMode` runs. Nothing in the types enforces this — the
  sequence of statements in `onProcess` is the specification.
- **The dependency order is faked with lazy processing.** `AbstractSyntaxTreeContext.getAlias` /
  `getEnum` / `getFunction` / `getStruct` all contain the same block: if not processed, guard against
  re-entry with `mProcessingStack`, push a synthetic `build-in` scope with `callInBuildInScope`, process.
  That is an ad-hoc topological sort. When it hits a cycle it returns `undefined`, which surfaces as
  `Typename "X" not defined` — the wrong message for a circular alias. It also does not cover a struct
  used above its declaration (D7).
- **`data` has a "not valid yet" state.** `AbstractSyntaxTree.mData: TData | null` with a throwing
  getter means every node is temporarily invalid, and only runtime checks catch misuse.

### Suggested shape

What makes the transpiler clean is not its `Map<Constructor, Processor>`. It is the precondition. By the
time `Transpiler.transpile` runs:

- every node's `data` is already complete, so a processor never has to ask a context for anything;
- nothing it does can fail, so there is no error channel to thread through the recursion;
- the only shared state is one explicit accumulator (`TranspilationMeta`), which is written and never
  read back to make a decision;
- traversal order belongs to the driver, not to the nodes — `pTranspile` is injected.

**Validation can be given exactly these preconditions. Conversion cannot — conversion is what creates
them.** So externalise validation, and leave conversion on the node:

| | Conversion / resolution | Validation | Transpilation |
|---|---|---|---|
| Needs the context? | **yes — it builds it** | reads it only | not at all |
| Can it fail? | only "name not found" | **that is its entire job** | no |
| Coupled to the node's own fields? | **yes** — it produces `TData` | no — it reads `data` | no — it reads `data` |
| Belongs | on the AST class (`onProcess`) | in an external processor | in an external processor |

`onProcess` has to establish its own preconditions while consuming them: jobs 2 and 3 create the
context that jobs 4 and 5 read, in a single pass, in an order nothing states. Job 4 does not belong
there at all — most of `VariableDeclarationAst` is `validateDeclaration` and the surrounding
`pushIncident` checks, and none of them need to run during construction. They only need `data` to
exist.

So the proposal is two passes:

| Pass | Input | Output | Context | Incidents |
|---|---|---|---|---|
| **A. Process** — what `onProcess` does today, minus the rules | `Cst` | `Ast` with complete `data` | read + write | resolution only ("unknown name", "cyclic alias") |
| **B. Validate** | processed `Ast` | incidents | **read-only** | all semantic rules |

Pass B has the transpiler's preconditions, so it can be written the same way:

```ts
export interface IValidationProcessor<TAst extends AbstractSyntaxTree> {
    readonly target: Constructor<TAst> | Array<Constructor<TAst>>;
    validate(node: TAst, ctx: ReadonlyValidationContext, descend: Descend): void;
}
```

`Validator` is then the same shape as `Transpiler`, with `descend` replacing `pTranspile` and an
incident list replacing the returned string. `Transpiler.transpile` and `Validator.validate` are the
same walk; one generic `AstWalker<TResult>` could serve both.

What that buys:

- `validation/declaration/variable-declaration-validator.ts` becomes the answer to "what are the rules
  for `uniform`?".
- Rules can be unit-tested against a hand-built AST, with no parser involved.
- All `pushIncident` calls end up in one layer, so severities and error codes become possible.
- Rule sets become swappable per target; WGSL and GLSL do not have the same restrictions.
- `onProcess` shrinks to the part that genuinely produces `TData`.

### The ordering pass

The lazy `getX()` blocks are an ad-hoc topological sort; moving validation around does not fix them.
Replace them with an explicit step before pass A: walk the module-scope declarations, build the
dependency graph (alias → its type, struct → member types, function → called functions), sort
topologically, process in that order. Cycles become `Circular declaration: A -> B -> A` instead of
`Typename "X" not defined`, and a struct used above its declaration resolves (D7). This deletes
`mProcessingStack`, the four duplicated `getX()` bodies and `callInBuildInScope`.

`IDeclarationAst.register()` is already a precursor: a separate binding phase for declarations.
Formalising it is the natural starting point.

### What must stay in the conversion pass

Conversion does fail, but only in **one** way:

> **Conversion may only report "I cannot determine what this is."
> Everything of the form "I know what this is, and it is not allowed" is validation.**

Three things stay on the conversion side:

1. **Resolution failures.** `Typename "X" not defined.`, `Variable "x" not defined.`,
   `Function 'f' is not defined.` Conversion needs the answer to produce `data.type` /
   `data.resolveType`.
2. **Result-type and overload selection.** `a + b`'s result type only exists if the operands are
   compatible, and a function call's `resolveType` only exists once an overload has been picked. The
   failure of that selection ("no overload of `f` matches `(int, float)`") is reported by conversion.
   Everything downstream of the selection — "must be constructible", "must not have an initializer",
   "storage requires `[GroupBinding]`" — is validation.
3. **Cycle detection**, in the ordering pass.

### The poison type (D6)

Without this, splitting validation out just moves the cascade into a different file.

`PgslInvalidType` is the fallback when type resolution fails, but it *propagates* instead of being
*absorbed*: one undefined variable used three times produces six incidents, three of them noise. Only
the first incident of each group is one a user can act on. There are three ways a type gets consulted,
so there are three absorption points, and all three are needed:

**⓪ Poison already has a name generic code can test.** `BasePgslTypeKind.Invalid` is a bit, so the
guard is `isKind(Invalid)` and works anywhere a `BasePgslType` is in hand. Make `PgslInvalidType` a
singleton; it takes no arguments and carries no state.

**① Comparisons must absorb.** `PgslInvalidType.equals` returns `false` and its `conversionRankTo`
returns infinity, so poison is rejected everywhere it appears and each rejection raises its own
incident. Both should absorb — equal to anything, convertible into anything. Poison on the *other* side
of a comparison must be absorbed too; `accepts` on the base already short-circuits on reference
identity, and the invalid check belongs in the same place, so no call site changes.

**② Capability reads must be skipped, not satisfied.** Do not give poison its capability bits — that
would make it constructible and host-shareable and let it slip past rules it should never reach. Guard
where the rules *run*: a single early return at the top of `VariableDeclarationAst.validateDeclaration`
covers that file at once. Once the `Validator` exists this becomes one guard in the driver — skip any
node whose `data` contains a poison type.

**③ Structural dispatch needs a poison arm.** `ArithmeticExpressionAst.onProcess` classifies each
operand as `'scalar' | 'vector' | 'matrix' | 'unknown'`; poison lands in `'unknown'` and hits the
catch-all `Arithmetic operation not supported for used types.` The guard goes right after the operand
types are read:

```ts
// Poison in, poison out - the real error was already reported.
if (lLeftType.isKind(BasePgslTypeKind.Invalid) || lRightType.isKind(BasePgslTypeKind.Invalid)) {
    return PgslInvalidType.INSTANCE;
}
```

The same guard is needed in `comparison-expression-ast.ts`, `logical-expression-ast.ts`,
`binary-expression-ast.ts`, `unary-expression-ast.ts`, `indexed-value-expression-ast.ts` and
`value-decomposition-expression-ast.ts`.

**The invariant to write down and test:**

> **Poison in → poison out, with no incident.** Every operation that consumes a type is either total
> over poison or bails to poison.

```ts
// For each fixture containing exactly one resolution error,
// assert incidents.length === 1 (or === the number of distinct bad references).
```

`transpileInvalidType` throwing `Invalid type encountered during transpilation` stays: it is
unreachable, because `PgslParser.transpile` only transpiles when there are no incidents.

### Validation is not purely local

A few rules are global accumulations rather than node-local checks:

- `registerBindingName` — "binding `X` in group `Y` is already used" (cross-declaration).
- `registerValue` — "variable `x` already defined" (scope-relative).
- Statement rules that need the enclosing function — return type agreement, `discard` only in a
  fragment entry point.

These do not break the design, because the transpiler has the same thing: `TranspilationMeta` is a
driver-owned accumulator. So `ValidationContext` is read-only with respect to the AST and carries its
own scratch state: declared names, used bindings, current function, current loop depth. Scope and
enclosing-node context are traversal state, which the driver passes through `descend`. Give the
context these accumulators from the start — the first non-local rule will otherwise look like proof
that the split does not work.

### Order within the change

The steps are a dependency order, not a release plan:

1. **Fix the poison type (D6).** Everything downstream is judged by incident quality.
2. **Move the rules out of `onProcess`.** Every check that only reads and calls `pushIncident` becomes
   `onValidate(ctx)`. Anything that refuses to move is one of the three conversion-side cases above.
3. **Add the `Validator` walker** with its accumulators.
4. **Move the `onValidate` bodies into processor classes**, mirroring `transpilation/wgsl/`.
5. **Replace the lazy `getX()` blocks with the ordering pass.** Last, because it is the only step that
   touches `AbstractSyntaxTreeContext`.

---

## 3. The type system

### 3.1 Binary operator result types (D2)

Binary operators return the left operand's type instead of computing a result type.
`let x: int = 1 + 2.0;` is accepted and emits `var x:i32=1+2.0;`, which is invalid WGSL, while
`2.0 + 1` is rejected. The two directions disagree.

The rank table already exists on `PgslNumericType` (`CONVERSION_RANKS`). What is missing is using it:

- **Pairwise rule for binary operators.** Try `a → b`, try `b → a`, take whichever is finite. The only
  conversion sources are `AbstractInt` and `AbstractFloat` and they form a chain, so no general lattice
  join is needed. `i32` with `u32`, `f32` with `f16`, and `AbstractFloat` with `i32` all correctly fail.
  Vectors and matrices lift it through their component type.
- **Materialization.** An abstract reaching a position that needs a concrete type becomes its
  lowest-ranked concrete target — `i32` for `AbstractInt`, `f32` for `AbstractFloat`. It comes out of
  the same table; there is no reason for a second default-type mapping.

The arithmetic, comparison, binary and logical expression nodes all need this.

### 3.2 Generic binding

Checking an argument against a generic restriction works. What is missing is **binding**:
`<T>(value: T): T` has to bind `T` to the argument's type and substitute it into the return type, and
the binding has to work through nested types (`Vector3<T>`). Today a generic is only inferred when it is
directly a parameter type.

That wants a `match(pattern, concrete, bindings)` routine and its partner `substitute(type, bindings)`,
living centrally rather than on each type class. The binding is a per-call-site map the resolver builds
and discards — it never becomes state on a type.

Rules to settle before user generics ship: slots are declared in dependency order (`TVector`'s
restriction mentions `TNumber`, so `TNumber` comes first, which rules out mutual recursion), and
alternatives resolve first-match-wins.

`arrayLength` depends on this. It is declared with an unrestricted generic, which accepts any type, so
`arrayLength(5)` passes. It should only accept a pointer to a runtime-sized array (TODO in
[pgsl-numeric-function-feature-set-processor.ts](source/feature_set/core_set/function/pgsl-numeric-function-feature-set-processor.ts)).

### 3.3 Pointer address space

`PgslPointerType` keeps a mutable `mAssignedAddressSpace` that call sites set through
`assignAddressSpace` (both TODOs in
[pgsl-pointer-type.ts](source/abstract_syntax_tree/type/definition/pgsl-pointer-type.ts)). A type
should be a specification without state:

- Built-in pointer types come from the feature set's type cache, and a feature set is shared by every
  parse of a parser. So the first address space assigned to the `workgroupUniformLoad` pointer sticks
  for every later document.
- The type reports its own incident, without a node (§1d).

The TODO's direction: treat the address space as an internal generic of the pointer. A user pointer
has no address space restriction, a built-in can have one, and every user function called with a
different pointer address space is emitted as its own function.

### 3.4 Modular types

Which types exist is hardcoded in three places:

- `TypeDeclarationAst.resolveType` — a linear chain of 14 resolvers, several of them doing
  `Object.values(PgslXType.typeName).includes(...)` with a fresh array per call. The order of the chain
  is the name-shadowing policy, and that policy is not written down anywhere.
- the type switch in the WGSL `TypeDeclarationAstTranspilerProcessor`,
- the constructor table in `NewExpressionAst` (§3.5).

Adding a type — for example WGSL's `Buffer` — means touching all three. The direction is a resolver
map built once, with struct/alias/enum checked first as context lookups, and eventually types that are
provided by feature sets the same way functions are. How exactly is still to be discussed.

On the way, settle where types are created: `TypeDeclarationAst` constructs them with `new`, while
`NewExpressionAst` uses the context's type cache. Type equality is structural, so both work, but one
way is enough.

### 3.5 `new` expressions

`NewExpressionAst` keeps its own table of constructible types and their parameter patterns. Fold it
into the shared overload mechanism the built-in functions use, so `new Vector3<float>(...)` resolves
like a function call with overloads.

### 3.6 Smaller type items

- **Capability checks as kind tests.** `variable-declaration-ast.ts` still special-cases textures and
  samplers with `instanceof PgslTextureType` / `instanceof PgslSamplerType`. These become
  `isKind(BasePgslTypeKind.Texture)` / `isKind(BasePgslTypeKind.Sampler)`.
- **`frexp` result (D10).** The `exp` property of the `__frexp_result_*` structs has the float type of
  `fract`. WGSL defines it as `i32` / `vecN<i32>`.
- **Array lengths that are not folded (D8).** `PgslArrayType` only keeps a folded static length, so
  `Array<float, SIZE + 1>` is emitted as the runtime-sized `array<f32>`. Either fold constant
  expressions or emit the length expression itself.

---

## 4. AST → text

The transpiler layer is a clean visitor: `Map<Constructor, ITranspilerProcessor>` with an injected
`pTranspile` callback, and the WGSL backend is a pure leaf with no back-references. Four things to
change:

### 4.1 Source map

The source map is not merely unimplemented — it is unimplementable in the current shape:

```ts
// transpilation/transpiler.ts
sourceMap: null,
// ...
export type PgslTranspilationResult = { code: string; sourceMap: null; meta: TranspilationMeta; };
```

The *type* is `null`, so there is not even a slot to fill. `ITranspilerProcessor.process` returns a
bare `string`, so by the time fragments are concatenated, every node's identity is gone. Return a
fragment tree instead:

```ts
export type CodeFragment = string | { origin: AbstractSyntaxTree; parts: Array<CodeFragment> };
process(node: TTarget, emit: Emit, meta: TranspilationMeta): CodeFragment;
```

Processors barely change — `` `{${parts.join('')}}` `` becomes `frag(node, '{', ...parts, '}')`. A final
flatten walks the tree, tracks output line/column, reads the node's range for the input position, and
emits VLQ mappings. This is what makes a WGSL compile error in the browser point back at PGSL source.
It needs the source unit id from §1 for the "which file" column.

### 4.2 Emission policy

`DocumentAstTranspilerProcessor` hardcodes which declarations are emitted
(`FunctionDeclarationAst, VariableDeclarationAst, StructDeclarationAst`) and silently skips everything
else. "Alias and enum are inlined, so skip them" is a property of the language, not of WGSL; a second
backend would have to duplicate the list. Move it to the declaration (`IDeclarationAst.isEmitted`), or
make a missing processor mean "skip" instead of `throw`.

### 4.3 The transpiler must be total over validated ASTs

`PgslParser.transpile` only skips transpilation when there are incidents, so any gap between "the
front end accepts it" and "the backend can emit it" becomes an **uncaught exception** instead of an
incident. `FunctionDeclarationAstTranspilerProcessor` throws for functions with several headers and
for generic parameter or return types, and the numeric type transpiler throws for abstract numerics
that were never materialized (§3.1).

The rule: either the validator rejects it with a location, or the backend can emit it. For generic
user functions that means a monomorphisation pass that instantiates one concrete function per
call-site signature before transpilation — the only way generics can reach WGSL, since WGSL has no
user generics. It needs the binding from §3.2.

### 4.4 Output is fully minified

Every processor joins with no whitespace, so the generated WGSL is one long line. Once fragments are a
tree (§4.1), indentation is a flatten-time concern — a pretty-printer without touching a single
processor.

---

## 5. Parser

### 5.1 Precedence tiers (D1)

The left-factored `expression := simple ( binaryOperator expression )?` is right-recursive and
un-tiered. It is the shape a precedence ladder grows out of: one flat operator list becomes one level
per precedence class.

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

Each level commits on one lookahead token after parsing its operand. Associativity is explicit in the
loop. The grammar becomes a precedence table that reads top to bottom.

### 5.2 `core-parser` analytics count the wrong case (D11)

[code-parser-process-state.ts](../kartoffelgames.core.parser/source/parser/code-parser-process-state.ts)
counts a circular graph rejection (`graphIsCircular`) and a cached failure (`isKnownGraphFailure`) only
when analytics are **disabled** — both checks read `if (!this.mConfiguration.debug.analitics)` while
their comments say "on enabled analitics". Three `core-parser` test steps fail on it, and with
analytics disabled every such graph still creates an analytics entry.

### 5.3 Write down the failure-cache soundness rule

The graph failure cache (`mGraphFailureCache`, `isKnownGraphFailure()`) is correct only because
`.converter()` callbacks run on success, so a failing graph leaves no side effects behind. Write it
next to the cache and in the `core-parser` docs: **a graph that fails must be side-effect-free;
converters must not mutate observable state.** And note why the cache lives on
`CodeParserProcessState`: it is per `parse()` on purpose, so it can never carry state from one call
into the next.

### 5.4 Optional: parser performance

- **`graphIsCircular` on every graph entry.** It walks up the parent chain while
  `token.cursor === token.start`. It is what keeps a malformed self-referencing grammar from hanging,
  so not a delete — but it could be skipped for graphs that are known to consume a token before
  recursing. Measure before building anything.
- **A redundancy metric next to the failure cache flag.** The analytics count hits, misses and cache
  hits per graph, but nobody can tell from them whether their grammar is redundant enough to want the
  cache. Expose attempts ÷ distinct `(graph, token)` pairs, so the flag is a measured choice. A
  redundancy assertion in the benchmark suite would also catch grammar regressions.

---

## 6. Confirmed defects

Each of these is reproduced against the current tree.

| # | Defect | Repro | Effect |
|---|---|---|---|
| **D1** 🚩 | No operator precedence or associativity | `if (a + 1 < 10) { }` | Rejected with `Arithmetic operation not supported for used types.` `1 * 2 + 3` parses as `1 * (2 + 3)`; `1 - 2 - 3` as `1 - (2 - 3)`. §5.1 |
| **D2** | Binary operators return the left operand's type | `let x: int = 1 + 2.0;` | Accepted, emits `var x:i32=1+2.0;` (invalid). `2.0 + 1` is rejected. §3.1 |
| **D3** | `#META` replacement inserts a newline | declaration on source line 2 after a `#META` | Reported at line 3; the drift depends on surrounding blank lines. §1a |
| **D4** | `#IMPORT` split restarts line numbering | declaration on line 3 after one import | Reported at line 2. §1b |
| **D5** | No source identity in `CstRange` | two declarations named `dup`, one imported | Both report a bare line number; the file is unknowable. §1c |
| **D6** | `PgslInvalidType` propagates instead of absorbing | `let a: float = nope + nope + nope;` | Six incidents for three real mistakes. §2 |
| **D7** | Declarations are not ordered before processing | `function f(): Light { ... }` above `struct Light { ... }` | `Typename "Light" not defined.` §2, ordering pass |
| **D8** | Array lengths are only kept as folded constants | `private a: Array<float, SIZE + 1>;` | Emitted as runtime-sized `array<f32>`, without an incident. §3.6 |
| **D9** | Pointer address space is mutable state on a shared type | `workgroupUniformLoad(&a)` on a `workgroup` variable, then on a `private` variable in a second document of the same parser | The second document gets `Pointer address space is already assigned and cannot be changed` at `0:0`. §3.3 |
| **D10** | `frexp` result has a float `exp` | `frexp(1.5).exp` | Typed as the float type instead of `i32` / `vecN<i32>`. §3.6 |
| **D11** | `core-parser` analytics count with analytics disabled | `core-parser` test suite | Circular and cached counts stay `0` when analytics are on; three steps fail. §5.2 |

---

## 7. Order of work

The numbering is a dependency order — what has to exist before what — not a release plan.

**🚩 Blocks shipping the language**
1. §5.1 — precedence tiers. Fixes **D1**.
2. §3.1 — binary operator result types and materialization. Fixes **D2** and removes the abstract
   numeric case from §4.3.

**Small fixes**
3. §5.2 — the two inverted analytics checks in `core-parser`. Fixes **D11**.
4. §1 — `#META` replacement `''` plus `^[ \t]*` anchors, and the line-count-preservation test. Fixes
   **D3**.
5. §1d — pass the node for the clip distance incidents.
6. §3.6 — `frexp` `exp` type (**D10**) and `isKind` instead of `instanceof` for textures and samplers.
7. §5.3 — write down the failure-cache soundness rule.

**Validation rework** — §2
8. Fix the poison type. Fixes **D6**.
9. Move the rules out of `onProcess` into `onValidate`.
10. Add the `Validator` walker with its accumulators.
11. Move the rules into processor classes.
12. The ordering pass. Fixes **D7**, deletes `mProcessingStack`, the duplicated `getX()` bodies and
    `callInBuildInScope`.

**Type system** — §3
13. §3.3 — pointer address space as an internal generic. Fixes **D9** and the pointer part of §1d.
14. §3.2 — generic binding (`match` / `substitute`), then restrict `arrayLength`. Prerequisite for user
    generics and for §4.3.
15. §3.5 — fold `new` expressions into the shared overload mechanism.
16. §3.4 — modular types: resolver map, then types provided by feature sets. Discuss first.
17. §3.6 — array length expressions. Fixes **D8**.

**Debug information** — §1
18. Source unit id in `CstRange`, stop splitting on `#IMPORT`, `source` on
    `PgslParserResultIncident`. Fixes **D4** and **D5**.
19. Possible: imports as feature sets. Validate the open points in §1 first; if it holds, it replaces
    the `#IMPORT` part of 18.

**Transpiler** — §4
20. §4.1 — `CodeFragment` tree and a real source map. Needs 18 for the input side.
21. §4.3 — monomorphise generic functions; make the backend total over validated ASTs. Needs 14.
22. §4.2 — emission policy on the declaration.
23. §4.4 — pretty-printing, free once 20 lands.

**Cleanup**
24. Static state: `AttributeListAst.mValidAttributes` and the lazily filled `mValidValues` of the four
    enum classes.
25. The CST `buildIn` flags. Built-ins are built from data and never pass through `onProcess`, so the
    two places that still read the flag (`FunctionOverloadDeclarationAst` for the block return type,
    `StructPropertyDeclarationAst` for the concrete check) always see `false`.

**Optional** — §5.4
26. Skip `graphIsCircular` for graphs that consume a token before recursing. Measure first.
27. Redundancy metric next to the failure cache flag.

---

## 8. Open questions

1. **Should an override-sized array count as fixed-footprint?** `resolveArray` accepts a length at
   `PipelineCreationFixed` or above, and `PgslArrayType` sets `FixedFootprint` at the same threshold, so
   an override-sized array is treated as sized. WGSL allows override-sized arrays only for workgroup
   variables and treats them as neither constructible nor host-shareable. If that distinction is
   wanted, the two thresholds have to part company deliberately rather than by accident.
2. **Are user-defined generic functions meant to reach WGSL output?** The transpiler throws on them
   today. Monomorphisation (§4.3) is the answer if yes; a validator rejection with a clear message is
   the answer if not.
3. **Is there a parse time target?** The grammar no longer backtracks, and the remaining cost is
   `core-parser`'s per-graph overhead. Without a target, everything in §5.4 stays optional.
