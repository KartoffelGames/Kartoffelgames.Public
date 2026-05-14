// ============================================================================
// PREVIEW SYSTEM — PLAN AND SCRATCHPAD
// ============================================================================
//
// GOAL
// ----
// Visual node-graph code editor needs a preview system that renders:
// - Main function preview (e.g., pixel shader → canvas of evaluated pixels)
// - Per-node intermediate value preview (opt-in per node, user picks port + display)
// - Multiple display types pluggable: 2d canvas, flat text, sound, 3d, …
// - GPU shaders, external binary data (textures), helper-function previews
//
// Key constraint: all TypeScript types must be INFERRED from real values
// (matching the existing PotatnoProjectTypesDefinition.new pattern).
// NO explicit generic type parameters on factory calls.
//
//
// ============================================================================
// DESIGN RATIONALE (WHY THIS SHAPE)
// ============================================================================
//
// 1. Function definition ≠ executor.
//    PotatnoFunctionDefinition describes how to GENERATE code for a function.
//    PotatnoPreviewFunctionExecutor describes how to RUN that generated code
//    for a preview. They're decoupled because:
//    - One function may have multiple executors (e.g., a pixel shader run via
//      `new Function()` for the 2d-canvas display AND via a WebGPU pipeline
//      for a higher-fidelity display). Each is its own executor instance.
//    - The function definition stays free of any DOM/GPU/runtime concerns —
//      it remains a pure code-gen contract usable from CI/tests without a
//      browser.
//    - The same separation makes type inference cleaner: each side carries
//      only the types it owns.
//
// 2. Per-node previews go through the function executor, not the node.
//    A per-node preview is "run the surrounding function up to and including
//    this node, then return the node's value." That's a function-execution
//    concern, not a node-shape concern. Keeping nodes free of preview hooks
//    means nodes stay reusable across functions and contexts, and a single
//    executor implementation handles every node inside its function.
//
// 3. Every type inferred from a real value.
//    The codebase's existing patterns (PotatnoProjectTypesDefinition.new,
//    PotatnoStaticNodeDefinition.newStaticNode) infer all type parameters
//    from object-literal arguments. The preview API follows the same rule:
//    NO explicit `<…>` generics at call sites. Display parameter shapes,
//    result shapes, and adapter input shapes are all driven by example JS
//    values in the object literal. This keeps the surface ergonomic and
//    consistent with the rest of the project.
//
// 4. Caching is opaque and externally invalidated.
//    The preview framework doesn't observe graph mutations. It assumes the
//    last good build is still valid until something external signals "your
//    cache is stale" (graph saved, user clicked rebuild, code-gen produced
//    a new result, etc.). This keeps a working preview visible while the
//    user is mid-edit and the graph is temporarily broken.
//
//
// ============================================================================
// ARCHITECTURE (FINAL DIRECTION)
// ============================================================================
//
// Two completely separate concerns:
//
//     +---------------------------+         +---------------------------+
//     |  Background / code-gen    |         |  Preview / runtime        |
//     |  (always-on, fast)        |         |  (optional, slow)         |
//     +---------------------------+         +---------------------------+
//     | PotatnoProjectTypesDef    |         | PotatnoPreviewDisplay     |
//     | PotatnoNodeDefinition     |         | PotatnoPreviewFunction-   |
//     | PotatnoFunctionDefinition |         |   Executor                |
//     | PotatnoCodeGenerator      |         | PotatnoPreview (registry) |
//     +---------------------------+         +---------------------------+
//               |                                       |
//               +-----------+      +--------------------+
//                           v      v
//                      PotatnoProject
//
// Node previews are REMOVED from node definitions entirely. Per-node previews
// are produced by the function executor + framework-injected hooks. Debug
// mode of the code generator emits hook comments at every value-output
// assignment AND leaves the natural function return intact — it does not
// substitute or strip. The executor's build callback is responsible for
// rewriting the hook for its pPortTarget (when one is given) into a return
// statement, dropping the dead code after it.
//
//
// ============================================================================
// LIFECYCLE
// ============================================================================
//
// 1. User defines project types (with default.value as a real JS value to drive
//    inference).
//
// 2. User defines function definitions (pure code-gen — no runtime, no preview).
//
// 3. User defines displays. Each display declares:
//    - id
//    - element type (HTMLCanvasElement, HTMLDivElement, AudioNode, …)
//    - expectedParameters: JS-value defaults (e.g. { x: 0, y: 0 }).
//      TYPE-LEVEL ONLY — never read at runtime. Two compile-time uses:
//        (a) pair check against executor.parameters at addDisplay
//        (b) types pExecutor's params inside update's body so the display
//            can write { x, y } without annotating pExecutor explicitly
//      The update body constructs the params directly.
//    - defaultResult (sample of the result shape — drives result-type inference
//      AND defines what adapters must convert to)
//    - typeAdapter table: per-project-type, how to convert a value of that type
//      to the defaultResult shape (used for per-node previews)
//    - generate(): build the DOM/audio element
//    - update(element, executor): outer loop; calls executor per iteration,
//      writes results into element.
//
// 4. User defines function executors. Each executor binds:
//    - one function definition (its code is what gets compiled)
//    - parameters: ITERATION-FED shape (with JS-value defaults). The values
//      the display will pass per call. NOT the function's static inputs —
//      those are resolved inside build via pExecutor helpers (see OQ6/decisions).
//    - build(executor, generatorResult, portTarget): per-target setup; returns
//      the per-iteration callable. Called once per (executor, code-version,
//      target); framework caches the result and only re-invokes build when
//      something explicitly invalidates the cache (see OQ3/decisions).
//
// 5. User registers each (display, executor) pair via PotatnoPreview.addDisplay.
//    The pair MUST agree: executor.parameters must match display.expectedParameters
//    structurally (compile-time TS check).
//
// 6. UI inspects the registered pairs and the active document to decide which
//    previews to offer:
//    - Function-level previews: any (display, executor) pair whose function is
//      the entry function of the document.
//    - Node-level previews: any value port whose dataType has an adapter in
//      some registered display. User opts in per-node; DocumentNode stores
//      (portId, displayId).
//
//
// ============================================================================
// CORE TYPES — API SHAPES (NOT REAL CODE)
// ============================================================================
//
// ---- DISPLAY ----
//
// PotatnoPreviewDisplay.new({
//     id: '2dCanvas',
//     expectedParameters: { x: 0, y: 0 },     // infers {x: number, y: number}
//     defaultResult: [0, 0, 0],               // infers [number, number, number]
//     typeAdapter: {
//         // pValue type is inferred from project type's default.value
//         'number': (pValue) => [pValue, pValue, pValue],
//         // 'boolean': (pValue) => pValue ? [1, 1, 1] : [0, 0, 0],
//     },
//     generate: (): HTMLCanvasElement => { ... },
//     update: (pElement, pExecutor) => {
//         // pExecutor: (params: {x: number, y: number}, target?: string)
//         //           => [number, number, number]
//         for (let lY = 0; lY < H; lY++) {
//             for (let lX = 0; lX < W; lX++) {
//                 const lRgb = pExecutor({ x: lX / W, y: lY / H });
//                 // write lRgb to imageData…
//             }
//         }
//     }
// });
//
// ---- EXECUTOR ----
//
// PotatnoPreviewFunctionExecutor.new(lEntryFunction, {
//     parameters: { x: 0, y: 0 },     // MUST match a display's expectedParameters
//     build: (pExecutor, pGeneratorResult, pPortTarget) => {
//         // pExecutor       : this PotatnoPreviewFunctionExecutor instance.
//         //                   Exposes helpers:
//         //                     .function        : bound function definition
//         //                     .parameters      : iteration parameter spec
//         //                     .projectTypes    : project types (for default values)
//         // pGeneratorResult: PotatnoCodeGeneratorResult subclass.
//         //                     - PotatnoCodeGeneratorFunctionResult: full function
//         //                       code, all hooks intact, natural return intact.
//         //                     - PotatnoCodeGeneratorNodeResult: same full code,
//         //                       plus the originating node reference. Executor
//         //                       can distinguish by `instanceof` or discriminator.
//         //                   Either way, code contains hooks that the executor
//         //                   may need to rewrite.
//         // pPortTarget     : { documentPort, valueId } | null
//         //                   null     → function-level preview
//         //                   non-null → per-node intermediate preview at this port
//         //
//         // Static args (e.g., helper-function inputs): resolve here from project
//         // type defaults — they don't belong in `parameters`:
//         //   const lStaticArgs = pExecutor.function.inputs.map(
//         //       i => pExecutor.projectTypes[i.dataType].default.value
//         //   );
//         //
//         // Return a callable used by the display per iteration:
//         return (pParams: { x: number; y: number }) => {
//             const lCode =  pGeneratorResult.code.replace('/*HOOK[v_42]*/', `\nreturn v_42;`) ;
//             const lFn = Function(lCode +
//                 `\nreturn ${pExecutor.function.functionName};`)();
//             return lFn(pParams.x, pParams.y);
//         };
//     }
// });
//
// ---- DRIVER ----
//
// PotatnoPreviewDriver is the runtime object the UI actually invokes. It
// bundles a configured (display, executor, target) triple and exposes:
//   .element            : the DOM/audio element produced by display.generate()
//   .render()           : compile-on-demand + per-iteration call loop
//   .invalidateCache()  : drop the cached per-iteration callable; next render
//                         re-runs executor.build with the current generator
//                         result
//   .dataType (optional): for per-node drivers, the project-type id of the
//                         port being previewed. Lets the framework choose
//                         the right typeAdapter when wrapping the callable.
//
// One driver per visible preview. The framework constructs drivers from the
// registered (display, executor) pairs in PotatnoPreview plus the active
// document state (which entry function, which opt-in per-node bindings).
//
// Existing source/preview/potatno-preview-driver.ts is roughly this shape
// already — it needs refactoring to match the (display, executor, target)
// composition described here, but the core class isn't being thrown away.
//
// ---- REGISTRATION ----
//
// const lProjectPreviews = PotatnoPreview.new(lProjectTypes);
//
// lProjectPreviews.addDisplay(l2dCanvasDisplay, lEntryFunctionExecutor);
// // l2dCanvasDisplay.expectedParameters MUST extend lEntryFunctionExecutor.parameters
// // (compile error otherwise)
// //
// // Multiple (display, executor) pairs can be added; each is its own slot.
//
// ---- PROJECT WIRING ----
//
// const lProject = PotatnoProject.new({
//     types: lProjectTypes,
//     previews: lProjectPreviews,
//     functions: {
//         entry: lEntryFunction,
//         dynamic: [lUserFunction]
//     }
// });
//
//
// ============================================================================
// HOW PER-NODE PREVIEWS WORK
// ============================================================================
//
// 1. Code generator runs in DEBUG mode and emits hooks at value assignments.
//    Example output line:
//        const v_42 = a + b; /*HOOK[v_42]*/
//    The hook syntax is up to the node's code generator to define — so the
//    executor can't assume a single hard-coded format.
//
// 2. User opts a node-port into preview via the UI.
//    Stored on DocumentNode:
//        { previewBindings: [{ portId: 'result', displayId: '2dCanvas' }] }
//
// 3. Framework asks the code generator for the generator result. Code
//    generator returns a PotatnoCodeGeneratorNodeResult: .code contains
//    the full function code with ALL hooks intact and the natural return
//    intact. The NodeResult also carries the originating node reference.
//    (No stripping or return-injection at this stage.)
//
// 4. Framework calls executor.build(executor, generatorResult, portTarget)
//    where portTarget = { documentPort, valueId: 'v_42' }. Inside build,
//    user code replaces the hook comment for v_42 with `return v_42;` and drops the dead code if necessary.
//    Build returns the per-iteration callable that compiles+invokes this code.
//
// 5. Framework wraps the callable with the display's adapter for the port's
//    dataType (single number → [r, g, b]) so display.update sees the same
//    shape for function-level and node-level previews.
//
// 6. display.update is called with (element, wrappedCallable). Iteration
//    runs, results land in the element.
//
//
// ============================================================================
// OPEN QUESTIONS
// ============================================================================
//
// (none — all resolved; see Decisions Locked below)
//
//
// ============================================================================
// DECISIONS LOCKED
// ============================================================================
//
// Architecture
// ------------
// [X] Node previews REMOVED from node definitions. Owned by function executors
//     + framework hooks.
// [X] PotatnoFunctionDefinition stays PURE (code-gen only). No preview, no
//     executor, no signature field.
// [X] DocumentNode stores per-node preview opt-in: { portId, displayId }.
// [X] Helper functions are previewable EXACTLY like the main entry function:
//     same executor wrapper, same display registration, no special-casing.
//
// Display
// -------
// [X] expectedParameters: JS-value defaults. Type-level only — used for the
//     compile-time pair check at addDisplay AND for typing pExecutor inside
//     update's body. Never read at runtime.
// [X] addDisplay(display, executor) — one call, one pair. Pair must satisfy
//     expectedParameters/parameters structural match at compile time.
// [X] addDisplay returns void (side-effect, mutates the registry). No builder
//     chain. The UI iterates registered displays at runtime; nothing performs
//     typed-by-ID lookups, so accumulating display IDs in the type parameter
//     would add ceremony with no consumer. Easy to upgrade later if needed.
// [X] Framework wraps the executor with the display's adapter BEFORE passing
//     it to display.update. Display always sees (params) → defaultResult-shape,
//     regardless of whether it's a function-level or per-node preview. The
//     display never handles casting itself.
//
// Executor
// --------
// [X] PotatnoPreviewFunctionExecutor.new(functionDef, { parameters, build })
//     wraps a function with its iteration-parameter spec + build callback.
// [X] `parameters` is ITERATION-FED only (values supplied by the display per
//     call). Uses JS-value defaults for type inference.
// [X] STATIC arguments (e.g., helper-function inputs filled from project-type
//     defaults) are NOT in `parameters`. The user resolves them inside build
//     via pExecutor helpers:
//         pExecutor.function       — bound function definition
//         pExecutor.parameters     — iteration parameter spec
//         pExecutor.projectTypes   — project types (for .default.value lookup)
//     Linking parameters to project types happens here, not in the type system.
// [X] build signature: (pExecutor, pGeneratorResult, pPortTarget).
//     pPortTarget is null for function-level, { documentPort, valueId } for
//     per-node. Build returns the per-iteration callable.
//
// Code generator
// --------------
// [X] Code generator has a debug mode that emits hook comments at every
//     value-output assignment AND leaves the natural function return intact.
//     It does NOT strip code or substitute hooks.
// [X] Hook substitution (replacing a hook with `return <valueId>;` and
//     dropping dead code) is the EXECUTOR's job by string manipulation of the code generator's output.
// [X] Code generator result is a class hierarchy:
//         PotatnoCodeGeneratorResult                 (base; code, entry, exit)
//           ├─ PotatnoCodeGeneratorFunctionResult    (full function)
//           └─ PotatnoCodeGeneratorNodeResult        (also carries the node)
//     Executor can distinguish by type (instanceof or discriminator) when
//     deciding whether to substitute a hook.
//
// Caching
// -------
// [X] The build result (per-iteration callable) is cached opaquely by the
//     preview framework. The preview system does NOT auto-detect graph
//     changes — caches persist until something external invalidates them.
//     This keeps the last-valid preview visible while the graph is in an
//     unfinished/broken state. Invalidation is a separate explicit signal
//     (e.g., ui-triggered "rebuild", code-gen completion event).
//
//
// ============================================================================
// WORKED EXAMPLE
// ============================================================================
//
// The file `page/source/index.ts` next to this scratchpad is the live
// playground for the project. It already uses the target API shapes from
// the user's perspective (PotatnoProjectTypesDefinition.new,
// PotatnoFunctionDefinition.new, PotatnoPreview.new, PotatnoPreviewDisplay.new,
// PotatnoProject.new) even though some pieces are not yet implemented. Use
// it as the source of truth for what callers expect from this API — if a
// type doesn't infer correctly there, the API shape needs to change, not
// index.ts.
//
//
// ============================================================================
// INTEGRATION POINTS (HOW THIS PLUGS INTO THE REST OF THE PACKAGE)
// ============================================================================
//
// PotatnoProject  (source/project/potatno-project.ts)
//   - Owns `types`, `functions`, and `previews` (PotatnoPreview instance).
//   - The preview registry is project-wide: every document opened against
//     this project sees the same set of registered (display, executor) pairs.
//
// PotatnoDocument  (source/document/potatno-document.ts)
//   - Holds runtime graph state: DocumentNode instances, DocumentPort
//     instances, connections.
//   - DocumentNode carries the per-node preview opt-in:
//         preview: { portId: string; previewDisplayId: string } | null
//     Persisted with the document so the choice survives reload.
//
// PotatnoCodeApplication  (source/potatno-code-application.ts)
//   - UI shell. Walks the active document's nodes, looks up registered
//     (display, executor) pairs, constructs PotatnoPreviewDriver instances
//     for each visible preview, and inserts driver.element into the DOM at
//     the appropriate spot.
//   - The render loop (renderFrame in page/source/index.ts) calls app.update()
//     each frame; app.update walks active drivers and triggers their
//     render() if their cache is dirty. Cache invalidation flows from
//     code-gen completion → application → drivers.
//
// PotatnoCodeGenerator  (in progress; source/parser/ area)
//   - Has debug and release modes. Debug emits hooks; release does not.
//   - Produces PotatnoCodeGeneratorResult instances:
//         PotatnoCodeGeneratorResult                 (base)
//           ├─ PotatnoCodeGeneratorFunctionResult    (full function)
//           └─ PotatnoCodeGeneratorNodeResult        (carries the node;
//                                                     exposes hookCommentFor)
//   - One generation pass per function produces one FunctionResult; the
//     same pass can produce N NodeResults (one per node whose port is
//     opt-in for preview) sharing the same underlying code.
//
//
// ============================================================================
// IMPLEMENTATION NOTES (TYPESCRIPT INFERENCE PATTERNS)
// ============================================================================
//
// All factory APIs here follow the codebase convention: a static `new`
// method on the class with a protected constructor. The static method
// captures a generic from the literal argument and threads it through to
// the constructor.
//
//     class PotatnoPreviewDisplay<TParams, TResult, TAdapter> {
//         protected constructor(/* … */) { /* … */ }
//
//         public static new<
//             TParams extends Readonly<Record<string, unknown>>,
//             TResult,
//             TAdapter extends Readonly<Record<string, (pValue: never) => TResult>>
//         >(pSpec: {
//             id: string;
//             expectedParameters: TParams;
//             defaultResult: TResult;
//             typeAdapter: TAdapter;
//             generate: () => Element;
//             update: (pElement: Element,
//                      pExecutor: (pParams: TParams) => TResult) => void;
//         }): PotatnoPreviewDisplay<TParams, TResult, TAdapter> {
//             return new PotatnoPreviewDisplay(/* … */);
//         }
//     }
//
// Key tactics:
//
// - JS-VALUE DEFAULTS DRIVE INFERENCE.
//   `expectedParameters: { x: 0, y: 0 }` infers `{x: number, y: number}`.
//   Inside `update`'s signature, `pExecutor: (pParams: TParams) => TResult`
//   then makes `pParams.x` typed inside the body without any annotation.
//
// - PAIR CHECK AT ADDDISPLAY.
//   `addDisplay` is generic over the display's and executor's type
//   parameters, with a constraint that the executor's `parameters` type
//   extends the display's `expectedParameters` type:
//       addDisplay<TParams, TResult, TAdapter>(
//           pDisplay: PotatnoPreviewDisplay<TParams, TResult, TAdapter>,
//           pExecutor: PotatnoPreviewFunctionExecutor<TParams /* must match */>
//       ): void
//
// - PROJECT-TYPE LOOKUP FOR TYPEADAPTER KEYS.
//   The typeAdapter keys must be valid project-type IDs. The display's
//   factory takes the project types as part of its environment (passed
//   via PotatnoPreview.new(lTypes) at registry creation, OR threaded
//   directly into the display.new signature — implementer's choice).
//   The adapter callback's pValue type is inferred from the matching
//   project type's `default.value`:
//       typeAdapter: { 'number': (pValue) => /* pValue: number */ ... }
//
// - DEFAULT VALUES INSTEAD OF EXPLICIT GENERIC ARGUMENTS.
//   Never write `PotatnoPreviewDisplay.new<{x: number, y: number}, …>(…)`.
//   If a generic can't be inferred from a literal value, the API shape
//   is wrong — restructure until it can. This is a hard rule from the
//   user (see DESIGN RATIONALE #3).
//
// - VARIANCE GOTCHA.
//   With `strictFunctionTypes` on, `(p: A) => B` is NOT assignable to
//   `(p: A | C) => B`. Watch this when the typeAdapter table is treated
//   as a union — the framework needs to narrow per-key before calling.
//   If you hit unexpected contravariance errors, the fix is usually to
//   keep keys discriminated at the call site, not to fight the type
//   system with `as` casts.
//
//
// ============================================================================
// NEXT STEPS
// ============================================================================
//
// 1. Write the actual classes under source/preview/:
//    - potatno-preview-display.ts             (rename from -display-definition)
//    - potatno-preview-function-executor.ts   (rename from -executor-definition)
//    - potatno-preview.ts                     (rename from -project-previews-definition)
//    - potatno-preview-driver.ts              (existing — but needs to be refactored to fit the new architecture)
// 2. Code generator: debug-mode hook emission + the
//    PotatnoCodeGeneratorResult / FunctionResult / NodeResult hierarchy.
// 3. Wire the framework's adapter-wrap layer and the cache-invalidation
//    signal between code-gen and preview registry.
