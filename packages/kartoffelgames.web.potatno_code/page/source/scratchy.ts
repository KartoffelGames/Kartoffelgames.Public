/*
 * Preview architecture — interface sketch.
 *
 * Lives in source/preview/. Nodes, functions, and ports carry no preview
 * fields. Preview-ness emerges from:
 *
 *   - the project's registered result kinds (TKinds — project-generic),
 *   - per-kind result definitions (rendering, shared across types),
 *   - per-(type, kind) preview definitions (a thin adapter only),
 *   - per-function executors (the call body per kind),
 *   - the user's per-output-port toggle in the editor.
 *
 *
 * THE FOUR CORE TYPES
 *
 *   PotatnoPreviewKindRegistry   Shape every project-level kind registry follows.
 *                                Each entry carries three type-only fields:
 *                                  - parameter: what execute() receives
 *                                  - result:    what execute() returns
 *                                  - adapter:   what per-type definitions supply
 *
 *   PotatnoPreviewResultDefinition  One per kind. Owns generate() and the bulk
 *                                of update(). Declares the adapter shape it
 *                                needs by consuming TKinds[TKind]['adapter'].
 *                                Project-author-defined OR ships as a default.
 *
 *   PotatnoPreviewDefinition     One per (type, kind) combination. THIN: just
 *                                the typeId, resultKind, and the adapter
 *                                instance. No generate(), no update() — those
 *                                live on the result definition. The 90%
 *                                duplication goes away.
 *
 *   PotatnoFunctionPreviewExecutor  Function-side. One per kind a function can
 *                                produce. Implements (parameter, valueId) →
 *                                result. Only the function knows how to call
 *                                itself, so this body lives here.
 *
 *
 * MAIN PREVIEW
 *
 * The function definition declares a `returnType: PotatnoProjectType`. The
 * framework synthesizes a virtual output port of that type representing the
 * function's natural return. Previews on that virtual port use the same
 * machinery, with the sentinel `extractValueId === null` meaning "no hook
 * rewrite, run the function naturally." No special types, no special code path.
 *
 *
 * HOOKS (framework-managed, invisible to nodes)
 *
 *     const v17 = a * b;                    // node code-gen emits
 *     const v17 = a * b; /*HOOK_v17* /          // framework appends
 *
 * Executor rewrites the named hook into a target-appropriate value escape
 * (JS return / WGSL buffer write / etc.) when extractValueId is non-null.
 * When null, no rewrite — function returns its natural value.
 */


import type { PotatnoDocumentPort } from '../../source/document/potatno-document-port.ts';
import type { PotatnoProjectType } from '../../source/project/potatno-project-types-definition.ts';
import type { PotatnoProject } from '../../source/project/potatno-project.ts';


// =============================================================================
// (1) Kind registry — project-author-defined, project-generic.
// =============================================================================

/**
 * Shape every kind entry follows. Three type-only fields:
 *   parameter — what execute() accepts.
 *   result    — what execute() returns.
 *   adapter   — what per-type definitions must supply.
 */
export type PotatnoPreviewKindShape = {
    readonly parameter: object;
    readonly result: object;
    readonly adapter: object;
};

/**
 * A project's kind registry. Each key is a kind name; each value is its shape.
 */
export type PotatnoPreviewKindRegistry = Readonly<Record<string, PotatnoPreviewKindShape>>;


// Example registry an author might declare (illustrative — not exported):
//
//   type MyKinds = {
//       flat:  { parameter: {}; result: { value: unknown };
//                adapter:  { valueToText: (pValue: unknown) => string } };
//       '2d':  { parameter: { width: number; height: number };
//                result:   { pixels: Array<unknown> };
//                adapter:  { valueToRgb: (pValue: unknown) => [number, number, number] } };
//       sound: { parameter: { sampleRate: number; durationMs: number };
//                result:   { samples: Float32Array };
//                adapter:  { valueToAmplitude: (pValue: unknown) => number } };
//   };
//
// The project carries TKinds as a generic the way it already carries TTypes:
//
//   class PotatnoProject<TTypes, TKinds extends PotatnoPreviewKindRegistry> { ... }


// =============================================================================
// (2) Result definition — one per kind, owns generate + bulk of update.
// =============================================================================

export type PotatnoPreviewResultDefinition<
    TProject extends PotatnoProject,
    TKinds extends PotatnoPreviewKindRegistry,
    TKind extends keyof TKinds
> = {
    readonly kind: TKind;

    /** Default parameters used until the user customizes them. */
    readonly defaultParameters: TKinds[TKind]['parameter'];

    /** Build the preview element once. */
    generate(): Element;

    /**
     * Refresh the preview element. Receives the driver (for execute()) and the
     * per-type adapter (for value-shape coercion). The result-definition owns
     * iteration and structural rendering; the adapter handles per-value bits.
     */
    update(
        pElement: Element,
        pDriver: PotatnoPreviewDriver<TProject, TKinds[TKind]['parameter'], TKinds[TKind]['result']>,
        pAdapter: TKinds[TKind]['adapter']
    ): void | Promise<void>;
};


// =============================================================================
// (3) Preview definition — one per (type, kind). Thin: just the adapter.
// =============================================================================

export type PotatnoPreviewDefinition<
    TProject extends PotatnoProject,
    TKinds extends PotatnoPreviewKindRegistry,
    TTypeId extends PotatnoProjectType<TProject>,
    TKind extends keyof TKinds
> = {
    readonly typeId: TTypeId;
    readonly resultKind: TKind;

    /** The per-type fill-in for the result-definition's adapter contract. */
    readonly adapter: TKinds[TKind]['adapter'];
};


// =============================================================================
// (4) Function-side executor — one per kind a function can produce.
// =============================================================================

export type PotatnoFunctionPreviewExecutor<
    TKinds extends PotatnoPreviewKindRegistry,
    TKind extends keyof TKinds
> = (
    pParameter: TKinds[TKind]['parameter'],
    /** null sentinel = no hook rewrite; return the function's natural value. */
    pExtractValueId: string | null
) => Promise<TKinds[TKind]['result']>;


// =============================================================================
// (5) Runtime driver — what update() actually sees.
// =============================================================================

export type PotatnoPreviewDriver<
    TProject extends PotatnoProject,
    TParameter extends object,
    TResult
> = {
    readonly port: PotatnoDocumentPort<TProject>;
    readonly valueId: string | null;
    readonly dataType: PotatnoProjectType<TProject>;

    /**
     * Run the function. Framework rewrites the hook for `valueId` before each
     * call (skipping rewrite when valueId is null — main preview).
     */
    execute(pParameter: TParameter): Promise<TResult>;
};


// =============================================================================
// WIRING (conceptual, not a real function signature)
// =============================================================================
//
// When a preview is toggled on for a port (or the virtual return port):
//
//   1. Find available kinds:
//        (keys of port.type's PotatnoPreviewDefinitions) ∩ (keys of function.executors)
//   2. User picks one (default = type's preferred kind).
//   3. Look up:
//        previewDef    = project.previews[port.type][kind]      // has the adapter
//        resultDef     = project.results[kind]                  // has generate + update
//        executor      = function.preview[kind]                 // has the call body
//   4. Build driver: { port, valueId: port.valueId | null, dataType, execute: executor }
//   5. element = resultDef.generate()
//   6. await resultDef.update(element, driver, previewDef.adapter)


// =============================================================================
// SUB-MODULE LAYOUT (source/preview/)
// =============================================================================
//
//   potatno-preview-kind-registry.ts        - PotatnoPreviewKindShape, PotatnoPreviewKindRegistry
//   potatno-preview-result-definition.ts    - PotatnoPreviewResultDefinition
//   potatno-preview-definition.ts           - PotatnoPreviewDefinition
//   potatno-preview-executor.ts             - PotatnoFunctionPreviewExecutor
//   potatno-preview-driver.ts               - PotatnoPreviewDriver
//   default/                                - Shipped result-definitions for common kinds
//       flat-result-definition.ts
//       two-d-result-definition.ts


// =============================================================================
// NOTES
// =============================================================================

// Adding a new kind. (1) Extend TKinds with a new entry. (2) Write the
// PotatnoPreviewResultDefinition. (3) For every type that should support it,
// write a thin PotatnoPreviewDefinition with just an adapter. (4) For every
// function that should produce it, add an executor. No node touched.

// Per-port override. A port may carry its own PotatnoPreviewDefinition that
// overrides its type's default for that kind. Same shape, used in place of
// the type-registered entry. Used for vec3-as-position vs vec3-as-color.

// Helper functions. Each function definition declares its own returnType and
// executors. Helpers don't inherit from callers — a helper open in the editor
// uses its own executors for both main preview and any port preview inside it.

// Dynamic inputs. Executor concern — it knows its function's input list and
// fills inputs it doesn't have a value for with the type's defaultValue.


export { };
