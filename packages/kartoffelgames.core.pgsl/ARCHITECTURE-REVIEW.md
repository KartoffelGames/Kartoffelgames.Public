# PGSL architecture review

Open work on `@kartoffelgames/core-pgsl`. Every item below still applies to the current tree. §6 lists
the confirmed defects, §7 the order of work and §8 the questions that need a decision.

## 1. Debug information

### What is lost

**1a. `#META` shifts every following line by one (D1).** `preprocessText` replaces the directive with
`'\n'`, but the match ends at `$`, i.e. *before* the trailing newline, so each `#META` inserts one
extra line. A declaration on source line 2 is reported on line 3. The leading `^\s*` makes it worse:
when a blank line precedes the directive, `\s*` swallows it and the net offset is zero instead of +1,
so the drift is not even constant.

**1b. `#IMPORT` resets line numbers to 1 (D2).** `preprocessText` splits the source on import lines
and `internalParse` calls `super.parse()` on each fragment separately. Each fragment starts counting at
line 1 again.

**1c. There is no source identity anywhere (D3).** `CstRange` is
`[lineStart, columnStart, lineEnd, columnEnd]`
([general.type.ts](source/concrete_syntax_tree/general.type.ts)). An imported declaration at line 1 of
`shared.pgsl` and a main-document declaration at line 1 are indistinguishable, and
`PgslParserResultIncident` exposes only `message`, `line` and `column`.

**1d. Incidents without a node report at `0:0`.** `convertIncidents` defaults to `0, 0` when no node is
attached. Four calls still pass none: the three clip distance checks in
`TypeDeclarationAst.resolveBuildIn`, and `PgslPointerType.assignAddressSpace`, which reports from inside
a type (see §3.2).

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
- Pass the node for the clip distance incidents, and move the pointer incident out of the type (§3.2).

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

Three structural consequences:

- **You cannot build an AST without a context, and you cannot validate without rebuilding.** Every test
  has to go through the full parser.
- **Order is implicit and load-bearing.** Declarations must be registered before their bodies process;
  `AttributeListAst` must exist before `getAccessMode` runs. Nothing in the types enforces this — the
  sequence of statements in `onProcess` is the specification.
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
them.** So validation moves out completely, and conversion stays on the node:

| | Process | Validation | Transpilation |
|---|---|---|---|
| Needs the context? | **yes — it builds it** | no | no |
| Can it fail? | **never** — it records what it could not resolve | **that is its entire job** | no |
| Coupled to the node's own fields? | **yes** — it produces `TData` | no — it reads `data` | no — it reads `data` |
| Belongs | on the AST class (`onProcess`) | in an external processor | in an external processor |

`onProcess` has to establish its own preconditions while consuming them: jobs 2 and 3 create the
context that jobs 4 and 5 read, in a single pass, in an order nothing states. Job 4 does not belong
there at all — most of `VariableDeclarationAst` is `validateDeclaration` and the surrounding
`pushIncident` checks, and none of them need to run during construction. They only need `data` to
exist.

> **The process pass computes, the validator judges.** The process pass never reports an incident.
> Whatever it cannot resolve or compute, it records in `data`, and the validator turns that record
> into the incident. No rule lives in between.

So there are two passes:

| Pass | Input | Output | Context | Incidents |
|---|---|---|---|---|
| **A. Process** — what `onProcess` does today, minus every rule | `Cst` | `Ast` with complete `data` | read + write | none |
| **B. Validate** | processed `Ast` | incidents | none | all of them |

The context keeps what resolution needs: names, scopes and symbol usages. It loses `pushIncident`,
`incidents` and `registerBindingName`.

`PgslValidator` has the transpiler's preconditions, so it is the same shape as `Transpiler`: a map from
AST class to `PgslValidatorProcessor`, a callback that validates a child in place of `pTranspile`, and
an incident list in place of the returned string. On top, it keeps a stack of the nodes it is inside
(see "Rules that look beyond the node").

What that buys:

- **Fast transpile.** Validation writes nothing back into the AST, so skipping it changes no output. A
  source that is already known to be valid goes straight from process to transpile (§4.3).
- `validation/declaration/variable-declaration-...` becomes the answer to "what are the rules for
  `uniform`?".
- Rules can be unit-tested against a hand-built AST, with no parser involved.
- All incidents come from one layer, so severities and error codes become possible.
- Rule sets become swappable per target; WGSL and GLSL do not have the same restrictions.
- `onProcess` shrinks to the part that produces `TData`.

### Lazy processing that never runs

A declaration is only usable below its own declaration, and recursion is forbidden. `DocumentAst`
already enforces both: it processes each user declaration first and registers it afterwards, so
neither a later declaration nor the function itself is visible while a body is processed.

`AbstractSyntaxTreeContext.getAlias` / `getEnum` / `getFunction` / `getStruct` still contain a block for
the other case: if the declaration is not processed yet, guard against re-entry with
`mProcessingStack`, push a synthetic `build-in` scope with `callInBuildInScope`, process. It never runs.
Feature-set declarations are built already processed, and user declarations are only registered once
they are processed. The four blocks, `mProcessingStack` and `callInBuildInScope` can go.

### What the process pass must guarantee

The validator only sees `data`. That holds if the process pass keeps four promises. Each one has gaps
today:

1. **Every failure leaves a trace in `data`.** A reference that did not resolve is stored as `null`
   next to its raw name. It is not inferred from poison: a variable whose declared type is unknown
   resolves to poison as well, and must not be reported as undefined.
   - `TypeDeclarationAstData` keeps only the final `type`. The raw name and the template arguments are
     lost, so none of its rules can be checked afterwards.
   - `VariableNameExpressionAst` marks "not defined" only through `PgslInvalidType`.
   - `BinaryExpressionAst` and `ArithmeticExpressionAst` replace an operator they cannot use with
     `BinaryOr` and `Plus`.
2. **Every CST child ends up in the tree, even after a failure.** `FunctionCallExpressionAst` returns
   `parameters: []` for an unknown function, so its arguments are never processed and never validated.
3. **No exception on user input.** `TypeDeclarationAst.resolveAlias` throws `Alias can't have templates
   values.` instead of recording it. That is already a crash today.
4. **A result that cannot be computed is poison.** Incompatible operands or no matching overload give
   poison, not a guess. Today `int + float` reports and then returns `int`.

Duplicate names fit this already. `registerValue` returns `false` and keeps the first declaration, so
later names resolve to that one. The process pass ignores the `false`; the validator finds the duplicate.

One incident cannot move yet. `PgslPointerType.assignAddressSpace` only sees a conflicting address space
at the moment of the second assignment, and the shared, mutable type (D6) keeps no trace of it. It
stays the context's only incident until §3.2 makes pointers stateless; `pushIncident` goes with it.

### Result types and poison

The process pass still computes result types: the arithmetic dispatch, the rank comparison of the
binary operators, overload selection. When it cannot, the result is poison. To say why, the validator
does not run those rules a second time:

> **A node whose own result is poison reports it, and the message names the input types:**
> `Arithmetic operation not supported for Vector3<float> and Vector2<float>.` For a name, only the
> unresolved reference counts; a resolved variable whose type is poison is defined and is not reported
> as undefined.

The types in the message show the problem, and the rules exist only once. Rules that do not decide the
result type move to the validator completely: the right side of a shift must be unsigned, a constant
shift amount must not be negative.

A function call records the selected overload and its binding (§3.1), or that none matched or several
tie. Its message comes from that record, not from a second binding run.

### Cascading incidents are accepted

`PgslInvalidType` is the fallback when resolution fails or a result cannot be computed, and it
propagates: one undefined variable used three times produces eight incidents. Every one of them is
correct, they are only harder to read. So there is no machinery to absorb poison: no rule skips a poison
input, no comparison treats poison as equal to everything, and `BasePgslType` stays as it is. A rule
that reads poison simply reports.

What stays:

- **Poison has a name generic code can test.** `BasePgslTypeKind.Invalid` is a bit, so the check is
  `isKind(Invalid)` and works anywhere a `BasePgslType` is in hand. Make `PgslInvalidType` a singleton;
  it takes no arguments and carries no state.
- **The process pass passes poison on.** A result that depends on a poison operand is poison.
  `ArithmeticExpressionAst` classifies its operands as scalar, vector or matrix; poison is none of
  them, lands in the catch-all and comes out as poison. An expression whose result does not depend on
  its operands, like a comparison that is always `bool`, keeps that type.
- **Rules must not throw on poison.** Poison has no capability bits, so a kind check simply fails and
  the rule reports.

`transpileInvalidType` throwing `Invalid type encountered during transpilation` stays. After validation
it is unreachable, because `PgslParser.transpile` only transpiles when there are no incidents. On fast
transpile it is the right answer to invalid input.

### Rules that look beyond the node

The validator has no context. Two kinds of rule need more than the current node, and the tree covers
both:

- **Rules about an enclosing node.** `break` only inside a loop or switch, `continue` only inside a
  loop, `discard` only in a fragment entry point (not checked today), and an incident inside a generic
  instance that names its binding (§3.1). The validator keeps a stack of the nodes it is inside while
  it walks, and a processor asks it for the nearest enclosing loop or function.
- **Rules across declarations.** "Binding `X` in group `Y` is already used" and "`x` is already
  defined" compare siblings, so the node that owns the scope checks them: the `DocumentAst` processor
  over `data.content`, a block over its statements, a function over its parameters.

Return types are already local: the function overload compares its block's `returnType` with the
declared one.

### Order within the change

The steps are a dependency order, not a release plan:

1. **The `PgslValidator` walker** with its parent stack, run after processing. No rules yet.
2. **The process pass keeps its promises**: a trace of every failure in `data`, every child in the
   tree, no exception on user input, poison for results it cannot compute, `PgslInvalidType` as a
   singleton.
3. **Move the rules**, file by file, from `onProcess` into validator processors, mirroring
   `transpilation/wgsl/`. Steps 2 and 3 go together per file. Result-type failures change to the
   message with the input types, and their tests with them.
4. **Strip the context** of `incidents` (except the pointer incident until §3.2) and
   `registerBindingName`, and add fast transpile to `PgslParser`.

---

## 3. The type system

### 3.1 Generics and monomorphisation

User functions get generics, and since WGSL has none, every use of a generic function has to become
a concrete function in the output. Today only the built-in functions of the feature sets have
generics, and even their call side is incomplete. This section covers both.

#### What exists

- **The generic type.** `PgslGenericType` holds a name and a list of restriction types; an empty list
  is a wildcard. `accepts` checks a type against the restrictions, `conversionRankTo` takes the worst
  rank over all restrictions, and its kind is the AND of the restriction kinds.
- **Generic overloads.** `FunctionOverloadDeclarationAstData.generics` lists the generics of an
  overload. A parameter or return type *is* a generic when it shares the generic's `PgslGenericType`
  instance.
- **Feature sets.** `createOverload({ 'TResult': [...] }, { 'e': 'TResult' }, 'TResult')` references a
  generic by name, but only as a whole parameter or return type. `explicitGenerics` marks functions
  like `bitcast` whose generic has to be written.
- **Calls.** `FunctionCallExpressionAst.matchFunctionHeader` takes explicit generics by position, infers
  the others from arguments whose parameter is directly a generic, and substitutes the return type
  when it is directly a generic. The grammar accepts `f<T, U>(...)` at call sites.
- **User declarations.** The CST has room for generics (`FunctionOverloadDeclarationCst.generics`, and
  a parameter type can be a generic name), and `FunctionOverloadDeclarationAst` processes them. The
  grammar never produces them: the function graph sets `generics: []` ("User functions do not support
  generics."), so that whole path is dead code.
- **Entry points** reject generics. The transpiler writes the `<...>` list only for `explicitGenerics`
  functions.

#### What is broken on the call side

These hit the built-in functions today, without any user generics:

- **The first matching overload wins (D13).** Overloads are tried in declaration order, and the first
  one that accepts the arguments is taken; conversion ranks are never compared.
  `dot(new Vector2(1, 2), new Vector2(3, 4))` picks the `int` overload, so
  `let r: float = dot(...)` is rejected although it is valid WGSL. The `AbstractFloat` overloads of
  `frexp`, `modf`, `length`, `distance`, `cross`, `mix` and `determinant` can never be reached,
  because the `float` overload before them always accepts an abstract argument.
- **An inferred generic is not fitted into its restrictions (D10).** `sqrt(4)` binds `TResult` to
  `AbstractInt`, which is not one of the float alternatives; it only passes `accepts` because it
  converts into one. `let r: int = sqrt(4);` is accepted and emits `var r:i32=sqrt(4);`.
- **Explicit generics are not checked (D11).** `bitcast<bool>(v)` is accepted and emitted.
- **A generic that cannot be inferred stays unbound (D12).** `bitcast(v)` resolves to the type
  `Generic[TResult]`, and the only incident is the assignment that follows. `explicitGenerics` is only
  read by the transpiler.
- **Binding only works at the top level.** A parameter like `Vector3<T>` is compared with
  `conversionRankTo`, which cannot see into the generic, and a return type like `Vector3<T>` is never
  substituted. That is why the feature sets spell out every vector type as its own overload or
  restriction alternative.
- **The call does not record its result.** Its data keeps the function declaration and the explicit
  generic list, but not the overload that matched or what the generics were bound to. Without that,
  the transpiler cannot pick an instance.

Smaller leftovers: the user-declaration path builds the generics twice, so `data.generics` holds other
instances than the parameter types and explicit generics could never match them; the
`typeof … === 'string'` checks in `FunctionOverloadDeclarationAst` and
`FunctionDeclarationAstTranspilerProcessor` are dead, since a parameter type is always a
`TypeDeclarationAst`; and `FunctionDeclarationAst` reports `Functions with multiple headers cannot have
generic parameters.` when it finds *attributes*.

#### Binding

One routine for every call, built-in or user, replaces `matchFunctionHeader`. For each overload with
the right parameter count:

1. **Explicit generics.** All or none. Each one is checked against its restrictions (fixes D11). A
   generic that occurs in no parameter cannot be inferred and has to be written; that rule replaces
   `explicitGenerics` for the check (fixes D12), and the flag only keeps its transpiler meaning.
2. **Match** each parameter pattern against its argument type: `match(pattern, argument, bindings)`.
   A generic collects the argument type as a candidate. A composite pattern (`Vector3<T>`, `Array<T>`,
   `*T`) requires the same type class and shape and recurses into its inner type. A concrete pattern is
   a plain conversion check.
3. **Resolve** each generic from its candidates: the type every candidate converts to at the lowest
   rank. It is the same pairwise rule the binary operators use now.
4. **Fit into the restrictions.** If the resolved type is not itself one of the alternatives, take the
   alternative it converts to at the lowest rank (fixes D10). A wildcard keeps the type. This is also
   where materialization happens: a user function can only be instantiated with concrete types, so an
   abstract binding becomes its cheapest concrete target — `int` for `AbstractInt`, `float` for
   `AbstractFloat` — out of the same rank table.
5. **Rank the overload** by the conversion rank of each argument into its substituted parameter type.
6. **Select** the overload that is no worse than every other one for each argument and better for at
   least one. Without such an overload the call is ambiguous; the call records it and the validator
   reports it (fixes D13). WGSL resolves its built-in overloads by conversion rank the same way.
7. **Substitute** the bindings into the return type: `substitute(pattern, bindings)` rebuilds
   `Vector3<T>` as `Vector3<float>` through the context's type cache.

`match` and `substitute` live in one place with an arm per composite type class, not as methods on the
types. The binding belongs to the call and never becomes state on a type. The call's data keeps the
selected overload and its binding, or why there is none (§2).

Rules for restrictions: a generic can only reference generics declared before it
(`<TNumber extends int | float, TVector extends Vector3<TNumber>>`), which rules out cycles. Within a
restriction the lowest rank decides, not the order of the alternatives.

`arrayLength` is a direct beneficiary. It accepts anything today (an empty restriction), and should
only accept a pointer to a runtime-sized array (TODO in
[pgsl-numeric-function-feature-set-processor.ts](source/feature_set/core_set/function/pgsl-numeric-function-feature-set-processor.ts)).

#### Generic names in scope

`TypeDeclarationAst.resolveType` resolves names through the context, and the context's scopes only
hold values. A generic name has to resolve inside its function header and body, so a scope needs types
too: a `Map<name, BasePgslType>` that `resolveType` checks before structs and aliases. While the header
is processed, `T` resolves to its `PgslGenericType`; inside the body it resolves to the type the body is
currently checked with. That one lookup is what makes `Vector3<T>` and `let x: T` work. A generic name
that shadows a module-scope type is an incident.

#### Monomorphisation

WGSL has no generics and no function overloading, so every binding a generic user function is called
with becomes its own function. The AST makes this cheap: every node computes its types from the context
while it is processed, so an instance is the overload's CST processed again with the binding in scope.
The result is an ordinary, fully concrete `FunctionOverloadDeclarationAst`, and the transpiler handles
it like any other function.

- **The generic overload** is processed once for its header: generics, restrictions, parameter and
  return patterns. That is all a call needs for binding.
- **Instances** live in a registry on the context, per overload and binding, that `DocumentAst` hands
  to the transpiler. The declaration's own data stays unchanged after its processing.

#### Checking the body

A generic is a type with a restriction, retrieved from the function scope and checked like any other
type. The catch is that most rules ask what a type *is*: `ArithmeticExpressionAst` asks "scalar, vector
or matrix?", and the result of `a + b` depends on the answer. For `T extends float | Vector3<float>`
there are two answers. Teaching every node to handle a type with several answers is the hard way.

The easy way gives `T` one answer at a time. The body is processed once for every alternative of the
restrictions, with `T` resolving to that alternative in the function scope. Every node sees an ordinary
type, and every existing rule applies unchanged. The body is valid when it is valid for every
alternative. An incident that only some alternatives cause names them (`with T = float16`), and the
same incident from several alternatives is reported once.

- **These processed alternatives are the instances.** Binding always ends on an alternative (step 4),
  so a call only picks one of them, and only the picked ones are emitted.
- **They are processed while the declaration itself is processed**, so they see exactly what the
  declaration sees: nothing below it, and not the function itself. Recursion stays impossible.
- **The count is the product of the independent generics' alternatives.** A generic whose restriction
  is built from another one (`TVector extends Vector3<TNumber>`) adds none of its own. Two independent
  generics with four alternatives each make sixteen bodies, which is fine for shader code.

`PgslGenericType` then stays a pattern for binding. Its worst-rank `conversionRankTo` over the
restrictions is no longer needed.

**`<T>` without `extends`** has no alternatives to go through. Its body is processed once with `T` as an
opaque type. It has no capabilities, so it can only be passed on and returned. For that,
`PgslGenericType.conversionRankTo` has to return 0 for the generic itself; today a wildcard converts
into nothing, not even into itself. Its instances are created on the first call with a new binding.

**Pointer parameters** (§3.2) are instantiated on the first call too. Their address space and access
mode are never written, so there are no alternatives to check in advance, and some body rules depend
on them: writing through a pointer is only an error for some address spaces.

Instances created on a call are processed later than their declaration, but must resolve names as the
declaration did. Each module-scope declaration gets its index, and a late instance only sees the
declarations above its own. Otherwise it would see the function itself and instantiate forever. A late
instance is processed at module scope, not in the caller's scope chain, and not in the `build-in`
scope, where `registerSymbolUsage` ignores usages that decide the `enable` directives.

#### Emission

- The generic overload is never emitted; each of its used instances is, through the function
  declaration's transpiler, and the call transpiler writes the instance's name.
- Instances are named `<name>__GENERIC__<n>`, numbered per function: `hello<T>` becomes
  `hello__GENERIC__1`, `hello__GENERIC__2`. `__GENERIC__` is a reserved name part, so a user identifier
  that contains it is an incident. WGSL only reserves identifiers that *start* with two underscores, so
  the names are valid WGSL.
- A function with a single used instance keeps its plain name. That keeps today's output of pointer
  functions unchanged (§3.2).
- WGSL does not care about the order of module-scope functions, so the instances are emitted where the
  generic declaration stands.

User functions then only reach the transpiler as concrete instances, which closes the gaps of §4.3.

#### Declaration syntax

TypeScript-like: `function name<T extends float | float16>(a: T, b: Vector3<T>): T`. A generic
without `extends` is a wildcard. The CST shape exists (`FunctionDeclarationGenericCst`: a name and a
list of restriction types). The `string` case of `FunctionDeclarationParameterCst.typeDeclaration` goes
away once `T` resolves through the scope like any other type name.

#### Feature sets and `new`

With nested patterns the built-in definitions can shrink: `dot` becomes one overload per vector size
with a generic component instead of eighteen concrete ones. That is optional cleanup once binding
works. `NewExpressionAst` should use the same binding (§3.4).

#### Order within the change

1. **Binding** for the existing built-in calls: explicit and inferred generics checked against their
   restrictions, rank-based overload selection, nested `match` and `substitute`, and the call stores
   its overload and binding. Fixes D10–D13 without any grammar change. Then restrict `arrayLength`.
2. **Generic names in scope.**
3. **Instances**: the registry, emission with `__GENERIC__` names, and late instances at module scope
   with the visibility of their declaration.
4. **Pointers** as the first user of late instances (§3.2). They need no new syntax, so they prove the
   instance pipeline before generics are visible to users.
5. **The declaration syntax**: `<T extends ...>` with the body checked per alternative, then
   wildcards.
6. Optional: shrink the feature sets, fold `new` into the binding.

### 3.2 Pointer address space

`PgslPointerType` keeps a mutable `mAssignedAddressSpace` that the call sets through
`assignAddressSpace` (both TODOs in
[pgsl-pointer-type.ts](source/abstract_syntax_tree/type/definition/pgsl-pointer-type.ts)). A type
should be a specification without state:

- Built-in pointer types come from the feature set's type cache, and a feature set is shared by every
  parse of a parser. So the first address space assigned to the `workgroupUniformLoad` pointer sticks
  for every later document (D6).
- The type reports its own incident, without a node (§1d).
- A user function with a pointer parameter is emitted with the address space of its first call. A
  second call with another address space is that same incident at `0:0`.
- A built-in cannot restrict the address space. `workgroupUniformLoad(&value)` on a `private` variable
  is accepted, though WGSL only takes a `workgroup` pointer (D8).
- The access mode is not part of the pointer at all. A `read_write` storage variable passed to a
  pointer parameter emits `ptr<storage,f32>`, which WGSL reads as `read`, so the call is invalid
  (D7).

The TODO's direction fits §3.1: address space and access mode become an implicit generic of the
pointer. `PgslPointerType` takes both as constructor values and never changes. A pointer written as a
parameter type (`*float`) leaves them unbound, so binding takes them from the argument; a built-in
overload restricts them (`workgroup` for `workgroupUniformLoad`). Every user function called with a
different address space or access mode becomes its own late instance (§3.1, checking the body).

User functions with `storage`, `uniform` or `workgroup` pointer parameters also need WGSL's
`unrestricted_pointer_parameters` language feature; core WGSL only allows `function` and `private`
pointer parameters.

### 3.3 Modular types

Which types exist is hardcoded in three places:

- `TypeDeclarationAst.resolveType` — a linear chain of 14 resolvers, several of them doing
  `Object.values(PgslXType.typeName).includes(...)` with a fresh array per call. The order of the chain
  is the name-shadowing policy, and that policy is not written down anywhere.
- the type switch in the WGSL `TypeDeclarationAstTranspilerProcessor`,
- the constructor table in `NewExpressionAst` (§3.4).

Adding a type — for example WGSL's `Buffer` — means touching all three. The direction is a resolver
map built once, with struct/alias/enum checked first as context lookups, and eventually types that are
provided by feature sets the same way functions are. How exactly is still to be discussed. The scoped
generic names from §3.1 become the first entry of that lookup.

On the way, settle where types are created: `TypeDeclarationAst` constructs them with `new`, while
`NewExpressionAst` uses the context's type cache. Type equality is structural, so both work, but one
way is enough.

### 3.4 `new` expressions

`NewExpressionAst` keeps its own table of constructible types and their parameter patterns, with its
own handling of a single generic. Fold it into the binding of §3.1, so `new Vector3<float>(...)`
resolves like a function call with overloads. Two things the overloads cannot express yet: a variadic
parameter count (`Array(...)` takes 1 to 100 values) and a generic that is tied to no parameter.

Its element type is the first concrete argument, or else the first argument, not the common type
(D14). `new Vector3(1, 2.0, 3)` is a `Vector3<AbstractInt>`, so
`let v: Vector3<int> = new Vector3(1, 2.0, 3);` is accepted and emits `var v:vec3<i32>=vec3(1,2.0,3);`.
With binding, the element type is the resolved generic of step 3.

### 3.5 Smaller type items

- **Capability checks as kind tests.** `variable-declaration-ast.ts` still special-cases textures and
  samplers with `instanceof PgslTextureType` / `instanceof PgslSamplerType`. These become
  `isKind(BasePgslTypeKind.Texture)` / `isKind(BasePgslTypeKind.Sampler)`.
- **Shift operands (D9).** `BinaryExpressionAst` requires the left side of a shift to be a variable,
  so `5 << 2u` is rejected with `Left expression of a shift operation must be a variable that can store
  a value.` WGSL has no such rule. The rule goes, and the test `Non-variable in shift left expression`
  that expects it goes with it.
- **Array lengths (D5).** `PgslArrayType` only keeps a folded static length. `Array<float, SIZE + 1>` is
  emitted as the runtime-sized `array<f32>`, and with `param SIZE: uint = 4u;` the array
  `Array<float, SIZE>` is emitted as `array<f32,4>`, so overriding `SIZE` at pipeline creation does
  not resize it. Emit the length expression as written.
- **Override-sized arrays.** They are fixed-footprint, like in WGSL, which `PgslArrayType` already does.
  But WGSL only counts an array with a constant length as constructible and only allows override-sized
  arrays in `workgroup` variables. `PgslArrayType` sets `Constructible` at the same threshold as
  `FixedFootprint`, so `private a: Array<float, SIZE>;` and a local `let a: Array<float, SIZE>;` are
  accepted. Today D5 hides it, because the length is emitted as a constant.

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
backend would have to duplicate the list. Move it to the declaration (`BaseDeclarationAst.isEmitted`),
or make a missing processor mean "skip" instead of `throw`.

### 4.3 The transpiler must be total over validated ASTs

`PgslParser.transpile` only skips transpilation when there are incidents, so any gap between "the
front end accepts it" and "the backend can emit it" becomes an **uncaught exception** instead of an
incident. `FunctionDeclarationAstTranspilerProcessor` throws for a function with several headers, and
the type transpiler throws for a generic type and for abstract numerics. None of these is reachable
today, because a user function has exactly one header, no generics and only written, concrete types.
User generics make all three reachable.

The rule: either the validator rejects it with a location, or the backend can emit it. For generics
that is §3.1: only concrete instances reach the transpiler, and binding materializes abstract types
before an instance is made.

Fast transpile (§2) skips the validator, so the transpiler sees whatever the process pass produced.
That is only safe for a source that is already known to be valid. On invalid input it can throw, when
poison reaches `transpileInvalidType`, or emit WGSL that does not compile.

### 4.4 Output is fully minified

Every processor joins with no whitespace, so the generated WGSL is one long line. Once fragments are a
tree (§4.1), indentation is a flatten-time concern — a pretty-printer without touching a single
processor.

---

## 5. Parser

The target is as low as possible without giving up readability. A gain that is only possible by making
the code unreadable and abstract is not worth it.

- **Per-graph cost of the `core-parser` engine.** Parse time is dominated by the fixed cost of entering
  a graph: a generator for every graph, node and node value, and the process stack around them. A
  grammar can only lower how often that cost is paid; a main loop without a generator per step would
  lower the cost itself. That is a rework of `core-parser`, not of PGSL, and only worth it if the loop
  stays as readable as the generators.
- **A redundancy metric next to the failure cache flag.** The analytics count hits, misses and cache
  hits per graph, but nobody can tell from them whether their grammar is redundant enough to want the
  cache. Expose attempts ÷ distinct `(graph, token)` pairs, so the flag is a measured choice. For PGSL
  the answer is already known: the grammar retries nothing, and enabling the cache makes parsing
  slower.

---

## 6. Confirmed defects

Each of these is reproduced against the current tree.

| # | Defect | Repro | Effect |
|---|---|---|---|
| **D1** | `#META` replacement inserts a newline | declaration on source line 2 after a `#META` | Reported at line 3; the drift depends on surrounding blank lines. §1a |
| **D2** | `#IMPORT` split restarts line numbering | `#IMPORT` on line 3, mistake on line 4 | Reported at line 2. §1b |
| **D3** | No source identity in `CstRange` | two declarations named `dup`, one imported | Both report a bare line number; the file is unknowable. §1c |
| **D5** | Array lengths are only kept as folded constants | `private a: Array<float, SIZE + 1>;`, or `Array<float, SIZE>` with `param SIZE: uint = 4u;` | Emitted as runtime-sized `array<f32>`, or as `array<f32,4>` that overriding `SIZE` does not resize; no incident. §3.5 |
| **D6** | Pointer address space is mutable state on a shared type | `workgroupUniformLoad(&a)` on a `workgroup` variable, then on a `private` variable in a second document of the same parser | The second document gets `Pointer address space is already assigned and cannot be changed` at `0:0`. §3.2 |
| **D7** | The pointer access mode is not part of the pointer | a `read_write` storage variable passed to a `*float` parameter | Emits `ptr<storage,f32>`, which is `read` in WGSL; the call is invalid. §3.2 |
| **D8** | Built-ins cannot restrict a pointer's address space | `workgroupUniformLoad(&value)` on a `private` variable | Accepted and emitted. §3.2 |
| **D9** | The left side of a shift has to be a variable | `let x: int = 5 << 2u;` | `Left expression of a shift operation must be a variable that can store a value.`; valid in WGSL. §3.5 |
| **D10** | Inferred generics are not fitted into their restrictions | `let r: int = sqrt(4);` | Accepted, emits `var r:i32=sqrt(4);` (invalid). §3.1 |
| **D11** | Explicit generics are not checked | `bitcast<bool>(v)` | Accepted and emitted. §3.1 |
| **D12** | A generic that cannot be inferred stays unbound | `bitcast(v)` | Result type `Generic[TResult]`; only the following assignment reports. §3.1 |
| **D13** | The first matching overload wins | `let r: float = dot(new Vector2(1, 2), new Vector2(3, 4));` | Rejected, though valid WGSL: the `int` overload is taken before the abstract one. §3.1 |
| **D14** | `new` takes its element type from the first argument | `let v: Vector3<int> = new Vector3(1, 2.0, 3);` | Accepted, emits `var v:vec3<i32>=vec3(1,2.0,3);` (invalid). §3.4 |

---

## 7. Order of work

The numbering is a dependency order — what has to exist before what — not a release plan.

**Small fixes**
1. §1 — `#META` replacement `''` plus `^[ \t]*` anchors, and the line-count-preservation test. Fixes
   **D1**.
2. §1d — pass the node for the clip distance incidents.
3. §2 — delete the lazy branches of the `getX()` methods, `mProcessingStack` and `callInBuildInScope`.
4. §3.5 — drop the shift rule (**D9**), and `isKind` instead of `instanceof` for textures and
   samplers.

**Validation rework** — §2
5. `PgslValidator` walker with its parent stack.
6. The process pass keeps its promises: a trace of every failure in `data`, every child in the tree,
   no exception on user input, poison for results it cannot compute.
7. Move every rule out of `onProcess` into validator processors; result-type failures report with the
   input types.
8. Strip incidents and `registerBindingName` from the context, add fast transpile.

**Generics** — §3.1, §3.2
9. Binding for the built-in calls, then restrict `arrayLength`. Fixes **D10**–**D13**.
10. Generic names in scope.
11. Instances: registry, `__GENERIC__` names, late instances at module scope with the visibility of
    their declaration. Makes the backend total for functions (§4.3).
12. §3.2 — address space and access mode as an implicit generic of the pointer. Fixes **D6**, **D7**,
    **D8** and the pointer part of §1d, and removes the last incident from the context.
13. The declaration syntax `<T extends ...>`, the body checked per alternative, then wildcards.
14. §3.4 — fold `new` expressions into the binding. Fixes **D14**.
15. Optional: shrink the feature sets with nested patterns.

**Type system** — §3
16. §3.3 — modular types: resolver map, then types provided by feature sets. Discuss first.
17. §3.5 — array length expressions, then `Constructible` only for constant lengths. Fixes **D5**.

**Debug information** — §1
18. Source unit id in `CstRange`, stop splitting on `#IMPORT`, `source` on
    `PgslParserResultIncident`. Fixes **D2** and **D3**.
19. Possible: imports as feature sets. Validate the open points in §1 first; if it holds, it replaces
    the `#IMPORT` part of 18.

**Transpiler** — §4
20. §4.1 — `CodeFragment` tree and a real source map. Needs 18 for the input side.
21. §4.2 — emission policy on the declaration.
22. §4.4 — pretty-printing, free once 20 lands.

**Cleanup**
23. Static state: `AttributeListAst.mValidAttributes` and the lazily filled `mValidValues` of the four
    enum classes.

**Optional** — §5
24. Engine without a generator per step, if it stays readable.
25. Redundancy metric next to the failure cache flag.

---

## 8. Open questions

None at the moment.
