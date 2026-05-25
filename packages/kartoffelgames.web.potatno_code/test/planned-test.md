# PotatnoCode test plan

This document plans every Deno.test in the package. Tests follow the conventions in [CLAUDE.md](../../../CLAUDE.md#testing):

- One class per file, one member per `Deno.test`.
- Steps named `ClassName.method()` / `ClassName.property` / `Error: [what]`.
- Three labelled sections per step: `// Setup.` / `// Process.` / `// Evaluation.`.
- Error tests wrap the failing call in an anonymous function and assert the **exact full** message via `expect(fn).toThrow('...')`.
- Integration tests (units that cannot be instantiated directly) drop the `.method()` pattern in favour of functional groupings like `ClassName - SyntaxTree Values`, `ClassName - Validation`, `ClassName - Transpilation`, `ClassName - Error Cases`.
- All cross-file fixtures pull from [test-project.ts](test-project.ts).

### Per-file setup helper

Every test file that needs a live document defines a private helper at the top of the file. The helper reads all definition references off the project — no hardcoded definition ids:

```typescript
const lSetupCalculatorDocument = (): {
    document: PotatnoDocument<typeof TestProject>;
    function: PotatnoDocumentFunction<typeof TestProject>;
    defaultEntry: PotatnoDocumentNode<typeof TestProject>;
    defaultExit: PotatnoDocumentNode<typeof TestProject>;
} => {
    // Read the entry function definition from the project.
    const lEntryDefinition = TestProject.entryPoint;

    // Build a document and the entry function instance.
    const lDocument: PotatnoDocument<typeof TestProject> = new PotatnoDocument(TestProject);
    const lFunction: PotatnoDocumentFunction<typeof TestProject> = lDocument.newFunction({
        definitionId: lEntryDefinition.id,
        id: 'calc-instance-1',
        label: lEntryDefinition.label,
        isSystem: true
    });

    // Resolve the Default entry / exit node definitions from the function
    // definition. The fixture registers Default first in both arrays, so the
    // first element is the Default pair.
    const lNodes = lEntryDefinition.getNodeDefinitions(lFunction);
    const lDefaultEntryDef = lNodes.entry[0];
    const lDefaultExitDef = lNodes.exit[0];

    // Place the Default entry / exit nodes. Not wired - each test wires what it needs.
    const lDefaultEntry = lFunction.newNode(lDefaultEntryDef, { x: 0, y: 0, width: 6, height: 4 }, true);
    const lDefaultExit = lFunction.newNode(lDefaultExitDef, { x: 12, y: 0, width: 6, height: 4 }, true);

    return { document: lDocument, function: lFunction, defaultEntry: lDefaultEntry, defaultExit: lDefaultExit };
};
```

Conventions for the helper:

- **Unwired by default.** Returns the Default entry and Default exit as separate placed nodes. Tests connect ports themselves so wiring-related tests see exactly what they set up. Tests that need a fully-wired baseline call `lDefaultEntry.outputs.flow[0].connect(lDefaultExit.inputs.flow[0])` once.
- **Default-pair only.** The helper places the first entry / first exit node definitions only. Tests that need the X10 pair use `lNodes.entry[1]` / `lNodes.exit[1]`; tests that need the helper function call resolve the helper definition via `[...TestProject.userFunctions.values()][0]` and read `.id` off it.
- **No hardcoded definition ids.** Tests reach into `TestProject.entryPoint`, `TestProject.userFunctions`, and the function definition's `getNodeDefinitions(...)` returns — never string literals like `'calculator'` or `'CalculatorDefaultEntry'`. Renaming a definition in the fixture should not break the tests.
- **Project tests skip the helper.** `project/*.test.ts` files exercise definition-level wiring and do not need a document — they construct `PotatnoProject.new(...)` ad-hoc in each step.

### Naming

Per [CLAUDE.md](../../../CLAUDE.md#testing) the dot notation applies to **every** test file in this package — including the integration-style files. Three top-level `Deno.test`s for the parser are named `PotatnoCodeGenerator.generateDocument()`, `PotatnoCodeGenerator.generateFunction()`, `PotatnoCodeGenerator.generateNode()`, and the serializer file uses `PotatnoSerializer.serialize()`. Functional sub-groupings (Linear / Branching / Conjunctions / Refcount / Hooks / Errors for the generator; Document Shape / Function Shape / Nodes / Ports / Connections / Full TestProject for the serializer) live as `pContext.step` labels nested inside those tests, joined with hyphens (`'Linear - Two-node arithmetic chain'`).

### Layout

The directory layout mirrors `source/`:

```
test/
    test-project.ts                  # shared fixture
    project/
        potatno-project.test.ts
        potatno-function-definition.test.ts
        potatno-port-definition.test.ts
        potatno-project-types-definition.test.ts
    document/
        potatno-document.test.ts
        potatno-document-function.test.ts
        potatno-document-node.test.ts
        potatno-document-port.test.ts
    serialization/
        potatno-serializer.test.ts
    parser/
        potatno-code-generator.test.ts
```

> Note: the user's brief listed `potatno-project-type-definition.test.ts`; the source file is `potatno-project-types-definition.ts` (plural), so the test file is renamed to match.

---

## Shared fixture: `test-project.ts`

The fixture supports every scenario in this plan. The nodes and functions available:

- Types: `number`, `string`, `boolean`.
- Main `calculator` function with `CalculatorDefaultEntry` / `CalculatorX10Entry` / `CalculatorDefaultExit` / `CalculatorX10Exit`.
- User function `gHelperFunction` (id `helperFunction`) — dynamic ports, callable from any graph. Its `value()` reads `pContext.function.label` so multiple document instances of the same definition each emit a call to their own per-instance label. The transitive-dependency tests create two instances of this definition (e.g. `helperOne` and `helperTwo`).
- Arithmetic: `Add`, `Subtract`, `Multiply`, `Divide`.
- Comparison: `Equal`, `Greater`, `Smaller`.
- Generic selector: `Pick` — two `<T>` value inputs (`a`, `b`), one `boolean` condition input, one `<T>` value output. Emits an IIFE that returns `a` when the condition is true and `b` otherwise.
- Parsing: `NumberToString` (`toString`), `ParseStringToNumber` (`parseString`).
- Flow control: `If` (with `then` / `else` flow outputs and a `code.next` merged tail).
- Side-effect: `GlobalMultiplier` (sets `__globalMultiplier` in scope).
- `Pass` — flow-only side-effect-free marker for linear-flow and branch-layout tests.
- `Const` — pure-value (no flow ports) producer for refcount / dedup tests.
- Import group `ExtraComparison`: `GreaterOrEqual`, `SmallerOrEqual`.

> The fixture is now feature-complete for this plan; no further additions are required.

---

## `project/potatno-project.test.ts`

Scope: confirm the project definition is wired up correctly. Pure unit tests against an in-test `PotatnoProject.new(...)`; the shared fixture is not needed here.

| `Deno.test` | Steps |
|---|---|
| `PotatnoProject.new()` | `Construct with minimal config`, `Construct with dynamic user functions`, `Construct registers built-in conjunction nodes` (verify the two conjunction node definitions appear in `nodeDefinitions` even with no user calls). |
| `PotatnoProject.types` | `Returns the provided types definition`. |
| `PotatnoProject.entryPoint` | `Returns the entry function definition`. |
| `PotatnoProject.userFunctions` | `Empty when none provided`, `Contains added user functions keyed by id`. |
| `PotatnoProject.imports` | `Empty when none added`, `Contains added imports in insertion order`. |
| `PotatnoProject.nodeDefinitions` | `Returns conjunction nodes when no nodes added`, `Returns added node definitions plus conjunctions`. |
| `PotatnoProject.generator` | `Returns the provided generator object`. |
| `PotatnoProject.addImport()` | `Appends a single import`, `Appends multiple imports in call order`. |
| `PotatnoProject.addNodeDefinition()` | `Registers a node definition by id`, `Re-registering the same id overwrites the previous definition`. |
| `PotatnoProject.getFunction()` | `Returns the entry function when its id matches`, `Returns a user function when its id matches`, `Returns undefined for unknown id`. |

---

## `project/potatno-function-definition.test.ts`

Scope: definition wiring only. No document, no generator runs.

| `Deno.test` | Steps |
|---|---|
| `PotatnoFunctionDefinition.new()` | `Construct with no statics flags`, `Construct with combined statics flags`, `Construct stores id and label`. |
| `PotatnoFunctionDefinition.id` | `Returns the provided id`. |
| `PotatnoFunctionDefinition.label` | `Returns the provided label`. |
| `PotatnoFunctionDefinition.statics` | `Returns the raw statics bitmask`, `Returns zero for none flag`. |
| `PotatnoFunctionDefinition.codeGenerator` | `Returns the provided generator object with body and value callbacks`. |
| `PotatnoFunctionDefinition.getNodeDefinitions()` | `Returns empty arrays when no providers are configured`, `Entry callback nodes are returned via .entry`, `Exit callback nodes are returned via .exit`, `Dynamic callback nodes are returned via .dynamic`, `Each property re-invokes the provider on access` (call twice, verify provider runs twice — lazy generation per accessor). |

Constants test:

| `Deno.test` | Steps |
|---|---|
| `PotatnoFunctionDefinitionStatics` | `none is 0`, `imports is 1`, `inputs is 2`, `outputs is 4`. |

---

## `project/potatno-port-definition.test.ts`

| `Deno.test` | Steps |
|---|---|
| `PotatnoPortDefinition.new()` | `Construct flow port`, `Construct value port with concrete data type`, `Construct value port with generic data type`. |
| `PotatnoPortDefinition.label` | `Returns the provided label`. |
| `PotatnoPortDefinition.id` | `Returns the provided id`. |
| `PotatnoPortDefinition.portType` | `Returns 'flow' for flow ports`, `Returns 'value' for value ports`. |
| `PotatnoPortDefinition.dataType` | `Returns the configured data type for value ports`, `Returns null for flow ports`. |
| `PotatnoPortDefinition.regions` | `Returns empty add array when no regions provided`, `Returns the configured add regions`. |

---

## `project/potatno-project-types-definition.test.ts`

| `Deno.test` | Steps |
|---|---|
| `PotatnoProjectTypesDefinition.new()` | `Construct with single type`, `Construct with multiple types`. |
| `PotatnoProjectTypesDefinition.types` | `Returns a readonly map keyed by type name`, `Map size matches type count`. |
| `PotatnoProjectTypesDefinition.typeNames` | `Returns the configured type names`, `Order matches insertion`. |
| `PotatnoProjectTypesDefinition.getType()` | `Returns the definition for an existing type`, `Type definition has a name field matching the lookup key`. |
| `PotatnoProjectTypesDefinition.isGenericType()` | `Returns true for <T>`, `Returns true for <TValue>`, `Returns false for plain identifier`, `Returns false for empty string`, `Returns false for string with leading bracket but no closing`, `Returns false for string with only closing bracket`. |
| `Error: PotatnoProjectTypesDefinition.getType() on unknown type` | Wrap `lTypes.getType('missing' as any)`, expect `'Type "missing" is not defined in the project types definition.'`. |

---

## `document/potatno-document.test.ts`

Scope: every public surface of the document, plus a `PotatnoDocument - Validation` section for the cross-function recursion path.

The shared fixture (`TestProject`) provides the project. Each test that needs nodes constructs them via `lDocument.newFunction(...)` / `lFunction.newNode(...)`.

| `Deno.test` | Steps |
|---|---|
| `PotatnoDocument.constructor()` | `Creates document with empty functions set`, `Creates document referencing the provided project`. |
| `PotatnoDocument.project` | `Returns the project passed in`. |
| `PotatnoDocument.functions` | `Empty when no functions added`, `Contains added function instances`, `Does not include removed functions`. |
| `PotatnoDocument.nodeDefinitions` | `Returns project definitions when no functions are present`, `Returns project plus function-node definitions when functions exist`. |
| `PotatnoDocument.newFunction()` | `Creates and returns a function`, `Adds the function to the functions set`, `Registers a corresponding PotatnoFunctionNodeDefinition`. |
| `PotatnoDocument.addFunction()` | `Adds an externally constructed function`, `Registers a corresponding PotatnoFunctionNodeDefinition`. |
| `PotatnoDocument.removeFunction()` | `Returns true when the function existed`, `Returns false for a function that was never added`, `Removes the function from the set`, `Removes the corresponding function-node definition`. |
| `Error: PotatnoDocument.removeFunction() on system function` | Build a system-flagged function via the public constructor parameter, expect `'Cannot remove a system function.'`. |

### `PotatnoDocument - Validation`

Single `Deno.test('PotatnoDocument - Validation', ...)` with sub-steps for each validation case. Each step builds a minimal graph that triggers exactly one error type and asserts the error count and message.

| Step | What it verifies |
|---|---|
| `Empty document` | `lDocument.validate()` returns an empty array. |
| `Single valid function` | A function with a wired entry → exit returns no errors. |
| `Missing function definition` | Function constructed with a definition id not in the project → one error containing `definition "<id>" could not be found.`. |
| `Cross-function recursion: A → A` | A user function whose graph contains a function node pointing at itself → one error about cycle participation. |
| `Cross-function recursion: A → B → A` | Two user functions cross-referencing → one error per participating function. |
| `Two independent recursion cycles` | A→B→A and C→D→C in the same document → four errors (each participant flagged). |
| `Acyclic A → B → C` | Three-deep chain with no cycle → no recursion errors. |
| `Recursion error item points at the offending function` | Assert `lError.item === lFunction` for the cycle case. |

---

## `document/potatno-document-function.test.ts`

| `Deno.test` | Steps |
|---|---|
| `PotatnoDocumentFunction.constructor()` | `Stores id`, `Stores label`, `Stores definitionId`, `Stores isSystem flag`, `Initialises empty nodes set`, `Initialises empty inputs array`, `Initialises empty outputs array`, `Initialises empty imports array`. |
| `PotatnoDocumentFunction.id` | `Returns the provided id`. |
| `PotatnoDocumentFunction.definitionId` | `Returns the provided definition id`. |
| `PotatnoDocumentFunction.document` | `Returns the provided document`. |
| `PotatnoDocumentFunction.project` | `Returns the provided project`. |
| `PotatnoDocumentFunction.label` | `Getter returns the constructor value`, `Setter updates the label`. |
| `PotatnoDocumentFunction.isSystem` | `Returns true for system function`, `Returns false for user function`. |
| `PotatnoDocumentFunction.nodes` | `Empty after construction`, `Contains added nodes`, `Does not contain removed nodes`. |
| `PotatnoDocumentFunction.imports` | `Empty after construction`, `Contains added imports`. |
| `PotatnoDocumentFunction.inputs` | `Empty after construction`, `Contains added input ports in insertion order`. |
| `PotatnoDocumentFunction.outputs` | `Empty after construction`, `Contains added output ports in insertion order`. |
| `PotatnoDocumentFunction.nodeDefinitions` | `Returns document definitions when the function definition has no dynamic provider`, `Includes dynamic definitions returned by the function definition's dynamic callback`. |
| `PotatnoDocumentFunction.addImport()` | `Adds a new import`, `No-op for duplicate import`. |
| `PotatnoDocumentFunction.removeImport()` | `Removes an existing import`, `No-op for unknown import`. |
| `PotatnoDocumentFunction.addInput()` | `Adds a new input`, `No-op for duplicate label`. |
| `PotatnoDocumentFunction.removeInput()` | `Removes an existing input by label`, `No-op for unknown label`. |
| `PotatnoDocumentFunction.addOutput()` | `Adds a new output`, `No-op for duplicate label`. |
| `PotatnoDocumentFunction.removeOutput()` | `Removes an existing output by label`, `No-op for unknown label`. |
| `PotatnoDocumentFunction.addNode()` | `Adds a pre-built node to the nodes set`. |
| `PotatnoDocumentFunction.newNode()` | `Creates a node from the definition`, `Mirrors definition input port ids and types`, `Mirrors definition output port ids and types`, `Defaults isSystem to false`, `Honours pSystem=true`. |
| `PotatnoDocumentFunction.removeNode()` | `Removes the node from the set`, `Disconnects all input port connections before removal`, `Disconnects all output port connections before removal`. |
| `PotatnoDocumentFunction.getExitNodes()` | `Returns nodes whose definitionId matches an exit definition`, `Returns empty array when no exit-matching nodes exist`. |
| `Error: PotatnoDocumentFunction.getExitNodes() on missing definition` | Function whose definitionId is not in the project → expect `'Function definition not found for function "<label>".'`. |

### `PotatnoDocumentFunction - Validation`

| Step | What it verifies |
|---|---|
| `Valid graph` | Function with a wired entry → Add → exit returns no errors. |
| `Missing function definition` | Definition id not in project → one error `Function "<label>" definition "<id>" could not be found.`. |
| `Flow input not connected` | Exit node's `exec` input has no connection → one port-validation error from the port; the function delegates so verify it surfaces here. |
| `Connection cycle in graph` | A → B → A wired via flow → at least one node flagged with `is part of a connection cycle.`. |
| `Node reachable from multiple entry nodes` | Default and X10 entries both wired into one downstream node → one error `Node "<label>" is reachable from multiple entry nodes.`. |
| `Region constraint - required missing` | Definition with `regions.requires: ['x']` placed where no predecessor adds `x` → one error `Node "<label>" requires region "x" but it is not active.`. |
| `Region constraint - forbidden present` | Definition with empty `requires`/`allows` placed downstream of a port adding `x` → one error `Node "<label>" does not allow region "x".`. |
| `Region constraint - allowed pass-through` | Definition `allows: ['x']` with predecessor adding `x` → no errors. |
| `Port resync - new definition port` | Node built with stale port list, definition has an extra port → the extra port is added silently, no errors. |
| `Port resync - removed unconnected port` | Stale port absent from definition and unconnected → removed silently, no errors. |
| `Port resync - removed connected port` | Stale connected port absent from definition → one error `Port "<label>" on node "<node>" no longer exists in its definition.`. |
| `Port resync - changed type, unconnected` | Port portType changed, no connections → replaced silently. Verify via `node.inputs.list` that the replacement has the new portType. |
| `Port resync - changed type, connected` | Port portType changed and has connections → one error `Port "<label>" on node "<node>" has a changed type.`. |
| `Validation errors include item references` | For each of the above, assert `lError.item` points at the right node / port / function. |

---

## `document/potatno-document-node.test.ts`

The constructor is exercised indirectly through `PotatnoDocumentFunction.newNode()`; tests build nodes via that path to mirror real usage.

| `Deno.test` | Steps |
|---|---|
| `PotatnoDocumentNode.constructor()` | `Sets category snapshot from constructor`, `Sets definitionId`, `Sets label`, `Sets isSystem`, `Stores transformation`, `Builds input ports from configuration`, `Builds output ports from configuration`, `Buckets flow ports into inputs.flow / outputs.flow`, `Buckets value ports into inputs.value / outputs.value`, `Builds the inputs.map / outputs.map keyed by definitionId`. |
| `PotatnoDocumentNode.definitionId` | `Returns the provided definition id`. |
| `PotatnoDocumentNode.document` | `Returns the provided document`. |
| `PotatnoDocumentNode.function` | `Returns the provided function`. |
| `PotatnoDocumentNode.project` | `Returns the provided project`. |
| `PotatnoDocumentNode.category` | `Returns the snapshot from construction even if the definition later changes`. |
| `PotatnoDocumentNode.label` | `Getter returns the constructor value`, `Setter updates the label`. |
| `PotatnoDocumentNode.isSystem` | `Returns true when constructed as system`, `Returns false otherwise`. |
| `PotatnoDocumentNode.transformation` | `Returns the stored transformation`. |
| `PotatnoDocumentNode.inputs` | `Returns an ordered list`, `Map lookup by definitionId returns the port`, `Flow array contains only flow ports`, `Value array contains only value ports`. |
| `PotatnoDocumentNode.outputs` | Same as inputs but for outputs. |
| `PotatnoDocumentNode.hasFlowPorts` | `True when input flow port present`, `True when output flow port present`, `False when no flow ports`. |
| `PotatnoDocumentNode.hasValuePorts` | `True when input value port present`, `True when output value port present`, `False when no value ports`. |
| `PotatnoDocumentNode.moveTo()` | `Updates transformation.x and transformation.y`. |
| `PotatnoDocumentNode.resizeTo()` | `Updates width and height`, `Clamps width to minimum 4`, `Clamps height to minimum 2`. |

### `PotatnoDocumentNode - Validation`

Single `Deno.test('PotatnoDocumentNode - Validation', ...)`. The node's `validate(pIncomingRegions)` is normally driven by `PotatnoDocumentFunction.validate()`, so steps call it directly with a controlled `Set<string>` for regions.

| Step | What it verifies |
|---|---|
| `Missing definition` | Construct a node with a definitionId not present in the function's `nodeDefinitions` → one error `Node "<label>" definition "<id>" could not be found.`. |
| `Region required and present` | Definition requires `'x'`, incoming set contains `'x'` → no region errors. |
| `Region required and absent` | Definition requires `'x'`, incoming set empty → one error `Node "<label>" requires region "x" but it is not active.`. |
| `Region allowed pass-through` | Definition allows `'x'`, incoming contains `'x'` → no errors. |
| `Region forbidden` | Definition has empty `allows`/`requires` but defines at least one of them as non-empty (forcing the allow-set check), incoming set contains `'y'` → one error `Node "<label>" does not allow region "y".`. |
| `Resync delegates to ports` | Verified above in document-function tests; here re-assert that port-level errors from validate() propagate through. |

> No `Error:` (throw) tests on this class — the validate path returns errors, it does not throw.

---

## `document/potatno-document-port.test.ts`

| `Deno.test` | Steps |
|---|---|
| `PotatnoDocumentPort.constructor()` | `Construct flow input`, `Construct flow output`, `Construct value input`, `Construct value output`, `Direct value seeded from project type default for non-generic value ports`, `Direct value empty for flow ports`, `Direct value empty for generic value ports`. |
| `Error: PotatnoDocumentPort.constructor() - flow port with data type` | Construct flow port with non-null `dataType` → expect `'Flow ports cannot have a value type.'`. |
| `Error: PotatnoDocumentPort.constructor() - value port without data type` | Construct value port with `null` `dataType` → expect `'Value ports must have a value type.'`. |
| `PotatnoDocumentPort.label` | `Getter returns constructor value`, `Setter updates label`. |
| `PotatnoDocumentPort.definitionId` | `Returns provided id`. |
| `PotatnoDocumentPort.direction` | `Returns 'input' for input port`, `Returns 'output' for output port`. |
| `PotatnoDocumentPort.portType` | `Returns 'flow' / 'value' as configured`. |
| `PotatnoDocumentPort.node` | `Returns the owning node`. |
| `PotatnoDocumentPort.document` | `Returns the owning document`. |
| `PotatnoDocumentPort.project` | `Returns the owning project`. |
| `PotatnoDocumentPort.dataType` | `Returns the configured data type`, `Returns empty string when none (flow port)`. |
| `PotatnoDocumentPort.directValue` | `Reflects seeded default`, `Reflects set value`. |
| `PotatnoDocumentPort.connectedPorts` | `Empty after construction`, `Contains the peer after connect()`, `Does not contain the peer after disconnect()`. |
| `PotatnoDocumentPort.connect()` | `Connects an output value to an input value of matching type`, `Connects flow output to flow input`, `Bidirectional - both ports list each other after a single call`, `Flow input allows multiple incoming connections`, `Value output allows multiple outgoing connections`, `Flow output replaces an existing connection when a second is added (1-export rule)`, `Value input replaces an existing connection when a second is added (1-import rule)`, `Idempotent for an already-connected pair`. |
| `Error: PotatnoDocumentPort.connect() - mismatched port types` | Flow ↔ value → expect `'Cannot connect port <id> of node <label> to port <id> of node <label> due to incompatible port types.'`. |
| `Error: PotatnoDocumentPort.connect() - same direction` | Output ↔ output → expect `'Cannot connect port <id> of node <label> to port <id> of node <label> due to incompatible directions.'`. |
| `PotatnoDocumentPort.disconnect()` | `Removes a connection`, `Bidirectional`, `No-op when not connected`. |
| `PotatnoDocumentPort.setDirectValue()` | `Updates direct value for value port`, `Preserves length contract by replacing in place`. |
| `Error: PotatnoDocumentPort.setDirectValue() - flow port` | Expect `'Only value ports can have a direct value.'`. |
| `Error: PotatnoDocumentPort.setDirectValue() - generic port` | Expect `'Generic value ports cannot have a direct value.'`. |
| `Error: PotatnoDocumentPort.setDirectValue() - length mismatch` | Pass an array of wrong length → expect `'The provided value does not match the expected length of the default value for this port's type.'`. |
| `PotatnoDocumentPort.resolvedDataType` | `Returns same as dataType for non-generic value ports`, `Returns empty string for flow ports`, `Output generic port resolves via connected input port on the same node with the same generic`, `Output generic port returns the generic when no resolving input exists`, `Input generic port resolves via its connected output port`, `Input generic port returns the generic when not connected`. |

### `PotatnoDocumentPort - Validation`

| Step | What it verifies |
|---|---|
| `Output flow with single connection` | No errors. |
| `Output flow with multiple connections` | One error `Flow output port "<id>" on node "<label>" can only have one connection.`. |
| `Output value generic resolved` | All same-generic input ports connected → no errors. |
| `Output value generic unresolved` | One same-generic input port unconnected → one error `Generic output port "<id>" on node "<label>" cannot resolve generic type "<generic>" because its input port "<id>" is not connected.`. |
| `Input flow connected` | No errors. |
| `Input flow unconnected` | One error `Flow input port "<id>" on node "<label>" must have at least one connection.`. |
| `Input value with single matching connection` | No errors. |
| `Input value with multiple connections` | One error `Value input port "<id>" on node "<label>" can only have one connection.`. |
| `Input value with type mismatch` | Connect number ↔ string → one error `Value input port "<id>" on node "<label>" expects type "<resolved>" but is connected to type "<resolved>".`. |
| `Input value unconnected` | No errors (direct value will be used at generation time). |

---

## `serialization/potatno-serializer.test.ts`

Per the brief: do **not** assert against the JSON shape. Round-trip through `PotatnoSerializer.serialize` → `PotatnoDeserializer.deserialize` and assert structural equivalence with the original document. The test file is organised as a single `Deno.test` per public method on `PotatnoSerializer`, with each step driving a round-trip scenario through `serialize` + `deserialize` and asserting equivalence.

| `Deno.test` | Steps |
|---|---|
| `PotatnoSerializer.constructor()` | `Construct without arguments` (sanity-check the parameterless constructor). |
| `PotatnoSerializer.serialize()` | One step per round-trip scenario: `Round trip - Empty document`, `Round trip - Document with a single empty function`, `Round trip - Document with multiple functions`, `Round trip - Function id and label preserved`, `Round trip - Function isSystem flag preserved`, `Round trip - Function definitionId preserved`, `Round trip - Function inputs in insertion order`, `Round trip - Function outputs in insertion order`, `Round trip - Function imports in insertion order`, `Round trip - Single node with no ports`, `Round trip - Node with input ports`, `Round trip - Node with output ports`, `Round trip - Node with mixed flow / value ports`, `Round trip - Node category preserved`, `Round trip - Node label preserved`, `Round trip - Node isSystem preserved`, `Round trip - Node transformation preserved`, `Round trip - Port definitionId preserved`, `Round trip - Port label preserved`, `Round trip - Port portType preserved`, `Round trip - Port dataType preserved for value ports`, `Round trip - Port dataType null for flow ports after deserialize`, `Round trip - Port directValue preserved for unconnected value ports`, `Round trip - Port directValue preserved when overridden via setDirectValue`, `Round trip - Single value connection between two nodes`, `Round trip - Single flow connection between two nodes`, `Round trip - Value output fan-out`, `Round trip - Flow input fan-in`, `Round trip - Multiple parallel connections between the same pair`, `Round trip - Connections survive across function boundaries`, `Round trip - Full TestProject calculator scenario`. |

The "Full TestProject calculator scenario" step builds the document via the helper plus extra wiring: default entry → Add → Multiply → default exit, plus a helperFunction call, plus a GlobalMultiplier, plus an `If` with both branches wired into the exit. Round-trip and assert: same function count, same node count per function, same connection multiset, same port direct values.

> Helper: write a private `expectDocumentsEquivalent(pA, pB)` in the test file. It iterates functions, then nodes by definitionId / position, then ports by definitionId, then compares `Set<string>` representations of connections by `(sourceDefinitionId, sourcePortId, targetDefinitionId, targetPortId)`. This avoids depending on node-identity equality (the deserializer creates fresh instances).

---

## `parser/potatno-code-generator.test.ts`

Three top-level `Deno.test`s, one per public method on `PotatnoCodeGenerator`, named with dot notation per the CLAUDE.md convention. Sub-groupings (Linear / Branching / Conjunctions / Refcount / Hooks / Errors) live as hyphen-joined `pContext.step` labels nested inside each test. Every step builds a graph and asserts the **complete** generated string character-for-character.

The brief is firm: *"It MUST check the complete code generation output, not just parts of it."* — so each step uses one `expect(lCodeResult).toBe(\`...full string...\`)` with the expected output written out in full as a template literal.

Steps that assert on intermediate function or node outputs deconstruct the result via `pResult.entryPoint.code` (function-level) and `pResult.entryPoint.graphs[0].code` (node/graph-level) but always assert the full generated string for that scope.

### `Deno.test('PotatnoCodeGenerator.generateDocument()', ...)`

| Step | Graph |
|---|---|
| `Document - Linear flow only` | `Default Entry → Pass → Default Exit`. Asserts full document code including the `let __globalMultiplier = 1;` init, the pass marker, and the return statement. |
| `Document - Chained arithmetic` | `Default Entry → Add(a,b) → Multiply(result, b) → Default Exit(result)`. |
| `Document - Multiple entries` | Both `Default Entry → ... → Default Exit` and `X10 Entry → ... → X10 Exit` populated. Asserts the body callback emits `calculatorDefault` and `calculatorX10` as two named consts concatenated. |
| `Document - GlobalMultiplier in flow` | `Default Entry → GlobalMultiplier(5) → Default Exit`. Asserts `__globalMultiplier = 5;` appears between init and return. |
| `Document - Single helperFunction call` | Default entry calls a single `helperFunction` instance (labelled `helperOne`) and returns its result. Asserts both the helper function body and the entry function body appear, with the helper preceding the entry. |
| `Document - Transitive helperFunction dependency` | Two instances of `gHelperFunction` (`helperOne` and `helperTwo`). `helperOne`'s graph contains a function-call node for `helperTwo`; the main entry contains a function-call node for `helperOne`. Assert dependency order: `helperTwo` first, then `helperOne`, then the entry — and that the call sites emit `helperOne(...)` / `helperTwo(...)` correctly thanks to `pContext.function.label`. |
| `Document - ExtraComparison import used` | Function enables the import, uses `greaterOrEqual` in a chain. Assert the resulting code contains the comparison and the import nodes do not duplicate. |
| `Document - X10 exit composed with GlobalMultiplier` | `X10 Entry → GlobalMultiplier(5) → X10 Exit`. Assert the return is `((result) * 10) * __globalMultiplier;` and the multiplier write is `__globalMultiplier = 5;` — verifying composition, not replacement. |
| `Error: generateDocument without system function` | Document with only non-system user functions → expect `'No entry point function found for code generation.'`. |

### `Deno.test('PotatnoCodeGenerator.generateFunction()', ...)`

`generateFunction` walks **all** of a function's exit nodes. Steps assert `pResult.entryPoint.code` (the function body) and `pResult.entryPoint.graphs` (one graph per exit node).

| Step | Graph |
|---|---|
| `Function - Single exit` | Calculator default-only wiring. Assert one graph and the function body's single named const. |
| `Function - Two exits` | Both default + X10 wired. Assert two graphs, two named consts. |
| `Function - Unwired exit produces no graph for that exit` | Only default wired; X10 exit has no flow input. Assert one graph for the wired exit and that the body code does not include `calculatorX10`. |
| `Function - helperFunction call records the dependency` | Entry → helperFunction → exit. Assert `pResult.dependencies` length 1 and `pResult.dependencies[0].function.label === 'helperFunction'`. |

### `Deno.test('PotatnoCodeGenerator.generateNode()', ...)`

`generateNode` walks a single exit node's subgraph. Steps assert `pResult.entryPoint.graphs[0].code`.

| Step | Graph |
|---|---|
| `Linear - Single entry → exit` | Trivial flow, no value computation. |
| `Linear - Single value-producer feeds exit` | Entry → exit with a `Const` node driving the exit's `result` input (no flow port). Verifies pure-value emission. |
| `Linear - Two-node arithmetic chain` | Entry → Add → Multiply → exit. Verifies value-id stability and statement ordering. |
| `Linear - Multiple flow nodes in sequence` | Entry → Pass → Pass → Pass → exit. Verifies linear flow ordering (use repeated `Pass` instances; assertions on count and order). |
| `Linear - Pick selects between two value inputs` | `Entry → Pick(Const(1), Const(2), Greater(a, b)) → Exit`. Asserts the IIFE form is emitted exactly once with the correct value-id ordering, that both `Const` inputs are emitted before the `Pick`, and that the `<T>` output resolves to `number` (matching the connected input type). |
| `Branching - If with both branches terminating at exit` | `Entry → If → then: Pass → Exit`, `If → else: Pass → Exit`. Assert `if (...) { ... } else { ... }` with each branch body filled and `code.next` empty (no shared downstream). |
| `Branching - If with only the then branch wired` | Else branch empty → `else { }` in output. |
| `Branching - If with shared downstream after merge` | `Entry → If → then: PassA → MergePass → Exit` and `If → else: PassB → MergePass → Exit`. Assert `MergePass` appears **once** in the `code.next` of the if and is **not** duplicated in either branch. |
| `Branching - Nested If with inner branches merging before outer` | Outer If's then-branch contains its own If whose two branches both feed back into the outer then's continuation. Assert no duplication of the outer-then's continuation in the inner branches. |
| `Branching - Nested If with full convergence at exit` | Outer If branches each contain an inner If; everything converges at exit. Assert the merged tail at the outer-If's `code.next` is the exit's return, and the inner-If `code.next` strings are empty. |
| `Conjunction - Flow passthrough` | `Entry → FlowConjunction → Pass → Exit`. Output identical to `Entry → Pass → Exit`. |
| `Conjunction - Value passthrough` | `Entry → Const → ValueConjunction → Exit(result)`. Output identical to direct `Const → Exit(result)`. |
| `Conjunction - Chain resolves to single upstream` | Three value conjunctions in a row → one upstream `Const`. Output identical to direct wiring. |
| `Refcount - Pure-value producer used once` | `Entry → Add(Const, Const) → Exit`. Each `Const` emits exactly once. |
| `Refcount - Pure-value producer used twice in the same flow node` | `Entry → Add(SharedConst, SharedConst) → Exit`. Single `Const` node feeds both inputs — assert it emits exactly once. |
| `Refcount - Pure-value producer feeding multiple downstream flow nodes` | `SharedConst → Add → Exit` and same `SharedConst → Multiply → Exit` (both flow nodes in the same chain). Assert `SharedConst` emits exactly once and at the latest position where all consumers have decremented its refcount. |
| `Hooks - Appended for every input and output valueId` | Run any non-trivial graph and assert the `/*[<valueId>]*/` markers appear after each node's emitted code in the exact count of `inputs + outputs` value ids. |
| `Hooks - Custom hook generator is honoured` | Spin up a one-off project whose `generator.hook` returns `<<id>>` and confirm the markers in the output use that form. |
| `Error: Walk emits zero nodes` | An exit node whose flow input is unconnected → expect `'Walk did not reach an entry node from exit "<label>".'`. |
| `Error: Unconnected generic value input` | A `Pick` node with one of its `<T>` value inputs unconnected → expect `'Generic value inputs must be allways connected'`. |
| `Error: Missing node definition for a node in the graph` | Construct a node whose definitionId does not exist in `pNode.function.nodeDefinitions` → expect `'Node definition "<id>" not found for node "<label>".'`. |
| `Error: Malformed flow conjunction chain on forward walk` | Conjunction with no output connection during merge handling → expect `'Conjunction nodes must have a valid input and output connection'`. |
| `Error: Merge node with no common branch point` | Two disjoint entry chains feed the same merge node → expect `'No common branch point found for merge node.'`. |

---

## Notes and decisions

- **Fixture is complete.** `test-project.ts` includes `Pass`, `Const`, and `Pick` nodes. Multi-instance user-function calls work via the new `pContext.function` surface on `value()`, so no `gNestedHelperFunction` is needed — transitive-dependency tests create two document instances of the same `gHelperFunction` definition.
- **`Walk did not reach an entry node...` error message stays.** Per the brief: changing it later is not expensive enough to bikeshed now.
- **Multi-entry validation uses `getNodeDefinitions`.** The "node reachable from multiple entry nodes" step in `PotatnoDocumentFunction - Validation` reads the two entry node definitions via `TestProject.entryPoint.getNodeDefinitions(lFunction).entry[0]` and `[1]`, never by hard-coded definition id.
