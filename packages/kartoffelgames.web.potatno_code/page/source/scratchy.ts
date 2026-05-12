/*
 * Scratchpad for the preview-driver pattern.
 * Not imported anywhere — code-shaped thinking only.
 *
 * Core idea: the function definition owns "how to repeatedly call the generated
 * code to produce something visualisable." Node previews piggyback on it by
 * asking for one intermediate value instead of the final return.
 *
 * Two responsibilities, separated:
 *   - driver:  runs the generated code N times, returns a per-iteration result set.
 *              Optionally swaps the final return for an extracted intermediate valueId.
 *   - render:  paints the result set into the preview element.
 */


// =============================================================================
// (1) HOOK INJECTION — framework-level, not node-level.
// =============================================================================
//
// The code generator automatically appends a uniform "hook" marker after
// every value-output assignment, keyed by valueId. Node code generators do
// NOT emit hooks manually — they just emit normal assignments. In JS:
//
//     const v17 = a * b;            // what the node emits
//     const v17 = a * b; /*HOOK_v17*/   // what ends up in the generated blob
//
// The driver, when asked to extract a valueId, swaps that hook for an early
// return / debug write / framebuffer paint, depending on its target language.
//
//     JS:    /*HOOK_v17*/  ->  "return v17;"
//     GLSL:  /*HOOK_v17*/  ->  "gl_FragColor = vec4(vec3(v17), 1.0); return;"
//     WGSL:  /*HOOK_v17*/  ->  "_debug_out[index] = v17; return;"
//
// No node has to know which target it ends up in — it only knows its own
// valueId and which port to expose.


// =============================================================================
// (2) JS PIXEL-SHADER DRIVER — drive separate from render.
// =============================================================================

type DriverResult = {
    readonly width: number;
    readonly height: number;
    // Row-major, one entry per iteration. Number | [r,g,b] when extracting,
    // [r,g,b] for the final shader output.
    readonly values: Array<number | [number, number, number]>;
};

const lPixelShaderDriver = (pGeneratedCode: string, pFunctionName: string, pExtractValueId: string | null): DriverResult => {
    // Rewrite the hook of the requested valueId into an early return.
    // When no extraction is requested, the code runs unchanged and returns its normal output.
    const lCode: string = pExtractValueId === null
        ? pGeneratedCode
        : pGeneratedCode.replace(`/*HOOK_${pExtractValueId}*/`, `return ${pExtractValueId};`);

    // Compile the rewritten code into a callable.
    const lFn: (pX: number, pY: number) => number | [number, number, number] = Function(lCode + `\nreturn ${pFunctionName};`)();

    // Drive the function across the synthetic input set. The grid size is the driver's
    // choice — the function signature only knows about a single (x, y) call.
    const lWidth: number = 50;
    const lHeight: number = 50;
    const lValues: Array<number | [number, number, number]> = new Array<number | [number, number, number]>(lWidth * lHeight);
    for (let lY: number = 0; lY < lHeight; lY++) {
        for (let lX: number = 0; lX < lWidth; lX++) {
            lValues[lY * lWidth + lX] = lFn(lX / lWidth, lY / lHeight);
        }
    }

    return { width: lWidth, height: lHeight, values: lValues };
};

const lPixelShaderRender = (pCanvas: HTMLCanvasElement, pResult: DriverResult): void => {
    pCanvas.width = pResult.width;
    pCanvas.height = pResult.height;

    const lCtx: CanvasRenderingContext2D = pCanvas.getContext('2d')!;
    const lImg: ImageData = lCtx.createImageData(pResult.width, pResult.height);

    for (let lI: number = 0; lI < pResult.values.length; lI++) {
        // Coerce scalar intermediate values into greyscale.
        const lValue: number | [number, number, number] = pResult.values[lI];
        const lRgb: [number, number, number] = typeof lValue === 'number' ? [lValue, lValue, lValue] : lValue;

        const lIdx: number = lI * 4;
        lImg.data[lIdx]     = Math.max(0, Math.min(255, Math.round(lRgb[0] * 255)));
        lImg.data[lIdx + 1] = Math.max(0, Math.min(255, Math.round(lRgb[1] * 255)));
        lImg.data[lIdx + 2] = Math.max(0, Math.min(255, Math.round(lRgb[2] * 255)));
        lImg.data[lIdx + 3] = 255;
    }

    lCtx.putImageData(lImg, 0, 0);
};


// =============================================================================
// (3) HOW THE TWO LEVELS WIRE INTO IT.
// =============================================================================
//
// Function-definition preview — extracts nothing, paints the final output.
//
//   preview: {
//       generate: (): Element => document.createElement('canvas'),
//       update: (pElement, pFunction, _pPreviewInputData, pCode) => {
//           const lResult = lPixelShaderDriver(pCode, pFunction.functionName, null);
//           lPixelShaderRender(pElement as HTMLCanvasElement, lResult);
//       }
//   }
//
// Node preview (e.g. Multiply.result) — extracts that valueId, same render.
//
//   preview: {
//       generate: (): Element => document.createElement('canvas'),
//       update: (pElement, pContext, pFunction, _pPreviewInputData, pCode) => {
//           const lResult = lPixelShaderDriver(pCode, pFunction.functionName, pContext.outputs['result'].valueId);
//           lPixelShaderRender(pElement as HTMLCanvasElement, lResult);
//       }
//   }
//
// The node has no idea the driver iterates pixels. It just says
// "give me the per-iteration values of v17 and paint them."


// =============================================================================
// (4) GPU SHADER VARIANT — same shape, different internals. Sketched only.
// =============================================================================
//
// const lFragmentDriver = async (pGeneratedWgsl: string, pEntryName: string, pExtractValueId: string | null): Promise<DriverResult> => {
//     // For extraction: swap the hook for a debug-buffer write, expand the bind
//     // layout to include a storage buffer the size of the canvas.
//     const lShaderSource: string = pExtractValueId === null
//         ? pGeneratedWgsl
//         : pGeneratedWgsl.replace(`/*HOOK_${pExtractValueId}*/`, `_debug_out[u32(pos.x) + u32(pos.y) * WIDTH] = ${pExtractValueId}; return;`);
//
//     // Compile, bind the driver's hardcoded inputs (vertex buffer, uniforms, sample
//     // textures), dispatch onto a readback target the size of the preview canvas,
//     // map and copy back.
//     const lPixels = await runShaderToReadback(lShaderSource, pEntryName, /* driver-owned inputs */);
//
//     return { width: 50, height: 50, values: lPixels };
// };
//
// Same node preview code as the JS case — only the driver function swaps.
// That's the whole reason for separating drive from render.


// =============================================================================
// (5) DYNAMIC INPUTS — the only case that doesn't have a clean answer.
// =============================================================================
//
// When the user adds inputs the function-definition author didn't anticipate,
// the driver doesn't know what to pass for them. Three options, ordered by
// how much they're worth doing:
//
// (5a) Default-value fallback. Driver passes the type's defaultValue for any
//      input it doesn't have a dedicated value for. Preview is "your function
//      with the user-added inputs at rest." Almost always useful and honest.
//
// (5b) Per-port preview provider. Each port definition optionally supplies a
//      previewValue() callback that returns a sample value. The driver maps
//      the function's input list, calls previewValue() per port (or falls back
//      to type defaultValue), and passes the array. Author no longer needs to
//      know which dynamic ports exist.
//
// (5c) Whitelist + disable. Function definition declares which port labels it
//      knows how to drive; anything else turns the preview off with a message.
//      Last resort.
//
// (5b) sketched:

// type PotatnoPortDefinitionPreview = {
//     readonly previewValue?: () => unknown;
// };
//
// const lGatherPreviewArgs = (pInputs, pDriverProvided, pProject): Array<unknown> => {
//     return pInputs.map((pInput) => {
//         // Driver wins for ports it knows about (e.g. the pixel x/y).
//         if (pInput.label in pDriverProvided) {
//             return pDriverProvided[pInput.label];
//         }
//         // Otherwise: port-level previewValue, then type-level defaultValue.
//         const lPortPreviewValue: unknown = lookupPortPreviewValue(pInput, pProject);
//         return lPortPreviewValue ?? pProject.types.getType(pInput.dataType).defaultValue;
//     });
// };


// =============================================================================
// (6) HELPER FUNCTIONS — each function definition owns its driver.
// =============================================================================
//
// The entry-point pixel shader is called `lFn(x, y)`. A user-created helper
// `MultiBy2AndX(x)` is called `lFn(0)` (or whatever its signature). The
// driver can't be shared between them — each knows how to call itself.
//
// Rule: `drive` and `render` live on every function definition, not just
// the entry point. When the editor opens a function — entry point or helper
// — that function's driver is what runs, both for the function-level preview
// and for every node-level preview inside it.
//
// "Which driver runs?" = "Which function is currently open in the editor?"
//   NOT "which function in production calls this one?"
//
// Helpers do not inherit drivers from callers. A helper is previewed in
// isolation, with whatever inputs its own author declared.
//
// Default when no driver declared: call once with each input at its type's
// `defaultValue`, render the result as a single text readout. No canvas.
// That's the honest "we don't know what to vary" fallback.
//
// Author wants a canvas-style sweep? Declare a driver that varies one input
// across N samples. The MultiBy2AndX example, with a 1D scalar sweep:

const lScalarSweepDriver = (pGeneratedCode: string, pFunctionName: string, pExtractValueId: string | null): DriverResult => {
    const lCode: string = pExtractValueId === null
        ? pGeneratedCode
        : pGeneratedCode.replace(`/*HOOK_${pExtractValueId}*/`, `return ${pExtractValueId};`);

    const lFn: (pX: number) => number = Function(lCode + `\nreturn ${pFunctionName};`)();

    // Vary x across the preview width; result is a 1-row strip.
    const lWidth: number = 50;
    const lValues: Array<number | [number, number, number]> = new Array<number | [number, number, number]>(lWidth);
    for (let lX: number = 0; lX < lWidth; lX++) {
        lValues[lX] = lFn(lX / lWidth);
    }
    return { width: lWidth, height: 1, values: lValues };
};

// Multi-input helper with one varied input: the driver fills the rest with
// type defaults (section 5a) and varies only the input(s) the author chose:
//
//   for (let i = 0; i < N; i++) {
//       values[i] = lFn(/* x = */ i / N, /* others = type defaults */);
//   }
//
// The framework can synthesize the "everything default + one varied" driver
// from a small declarative config rather than asking authors to hand-write
// the loop every time:
//
//   preview: {
//       drive: { kind: 'sweep', varyInput: 'x', samples: 50 },
//       render: 'scalar-strip'
//   }
//
// Hand-written drivers are still the escape hatch when 'kind' doesn't fit.


// =============================================================================
// (7) PROPOSED ARCHITECTURE — type-level previews + user-toggled ports.
// =============================================================================
//
// Nodes don't define previews. Previews are defined ONCE per project type, and
// the user toggles which output ports get previewed in the editor.
//
// Three owners, three concerns:
//
//   TYPE     "what does a value of this type LOOK like?"
//            (driverResult) => Element
//            Handles 1x1 (single), Wx1 (strip), WxH (grid) result shapes.
//
//   FUNCTION "how do I CALL myself for previews?"
//            drive: (code, fnName, extractValueId | null) => DriverResult
//            Optional render override for performance cases (compile-to-WebGPU etc.).
//
//   PORT     Rare per-output-port renderer override.
//            E.g. vec3-as-position needs an arrow-field renderer, not the vec3
//            default of "paint RGB". Almost no ports need this.
//
// The user picks WHEN: a port-level toggle in the editor turns preview on/off
// per output port. Once on, the framework wires it itself:
//
//   driverResult = function.drive(code, fn.functionName, port.valueId);
//   element      = port.previewRender?.(driverResult) ?? port.type.preview(driverResult);
//
// Nodes contribute nothing. They emit normal code. The framework decides what's
// previewable from the project's type definitions and the user's per-port toggles.


// Type-side — extension to today's PotatnoProjectTypesDefinition entries:
//
//   number: {
//       defaultValue: ['0'],
//       convert: ...,
//       inputs: ...,
//       preview: (pResult: DriverResult): Element => {
//           if (pResult.width === 1 && pResult.height === 1) {
//               // Single-value: text readout.
//               const lText: HTMLSpanElement = document.createElement('span');
//               lText.textContent = String(pResult.values[0]);
//               return lText;
//           }
//           // Grid or strip: greyscale image. Handles both Wx1 and WxH uniformly.
//           const lCanvas: HTMLCanvasElement = document.createElement('canvas');
//           lCanvas.width = pResult.width;
//           lCanvas.height = pResult.height;
//           // ... paint values as greyscale ...
//           return lCanvas;
//       }
//   }


// Function-side after the change:
//
//   preview: {
//       drive: (code, fnName, extractValueId) => DriverResult,
//       // Optional. When omitted, framework applies the return type's
//       // preview() to drive(..., null) and gets the main preview for free.
//       render?: (element: Element, result: DriverResult) => void
//   }


// Node-side after the change: nothing. No preview field on PotatnoNodeDefinition.
//
// Per-output-port renderer override (rare escape hatch — vec3-as-position):
//
//   ports: {
//       outputs: [
//           { label: 'normal', id: 'normal', portType: 'value', dataType: 'vec3',
//             previewRender: (pResult: DriverResult): Element => renderArrowField(pResult) }
//       ]
//   }


// Why this is worth the refactor:
//
//   - Define once, preview anywhere. Add Subtract, Modulo, Math.floor — they
//     all render as numbers because numbers know how to render. Author writes
//     zero preview code per node.
//
//   - The Multiply node at index.ts:298-332 (30 lines of bespoke per-pixel
//     iteration logic) collapses to zero lines. The loop lives in the type's
//     preview; the driver lives on the function.
//
//   - User-driven instead of author-driven. Users decide which intermediate
//     values matter for the debugging session, not the node author at design
//     time. Clicking a port is the only verb.
//
//   - The "I added a node and forgot the preview block" failure mode is gone.

export { };
