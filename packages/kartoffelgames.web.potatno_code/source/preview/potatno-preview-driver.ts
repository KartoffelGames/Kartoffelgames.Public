import type { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import { PotatnoCodeGenerator } from '../parser/potatno-code-generator.ts';
import type { PotatnoCodeGeneratorDocumentResult } from '../parser/result/potatno-code-generator-document-result.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import type { PotatnoPreviewFunctionExecutorBuildResult, PotatnoPreviewFunctionExecutorPortTarget } from './potatno-preview-function-executor.ts';
import type { PotatnoPreviewEntry, PotatnoPreviewEntryDisplay, PotatnoPreviewEntryExecutor } from './potatno-preview.ts';

/**
 * Self-contained runtime object behind one visible preview, created via a registry entry's
 * `createDriver`. Builds the preview element, regenerates and compiles the document code and
 * renders — the caller only decides when `refresh()` (graph changed) and `execute()` (render tick)
 * run; the driver never triggers either on its own.
 *
 * The target is either a document port — a value output identified by its generated valueId, or a
 * value input identified by its definition id, like an exit node's output-carrying inputs — or a
 * whole document function, which previews the function's complete output under an
 * executor-reported type like `'rgb'`.
 *
 * @typeParam TProject - The project type the driver targets.
 */
export class PotatnoPreviewDriver<TProject extends PotatnoProject> {
    private mCachedCallable: PotatnoPreviewDriverCallable | null;
    private readonly mDisplay: PotatnoPreviewEntryDisplay<TProject['types']>;
    private mElement: Element | null;
    private readonly mExecutor: PotatnoPreviewEntryExecutor<TProject['types']>;
    private mSpecifiedParameters: Record<string, unknown>;
    private readonly mTarget: PotatnoDocumentFunction<TProject> | PotatnoDocumentPort<TProject>;

    /**
     * The element the display renders into. Lazily created on first access.
     */
    public get element(): Element {
        if (!this.mElement) {
            this.mElement = this.mDisplay.generate();
        }

        return this.mElement;
    }

    /**
     * Constructor. Usually called through a registry entry's `createDriver`.
     *
     * @param pDisplay - Preview display.
     * @param pExecutor - Preview code executor.
     * @param pTarget - The previewed document port or document function.
     */
    public constructor(pDisplay: PotatnoPreviewEntryDisplay<TProject["types"]>, pExecutor: PotatnoPreviewEntryExecutor<TProject["types"]>, pTarget: PotatnoDocumentFunction<TProject> | PotatnoDocumentPort<TProject>) {
        this.mDisplay = pDisplay;
        this.mExecutor = pExecutor;
        this.mTarget = pTarget;
        this.mCachedCallable = null;
        this.mElement = null;

        // Insert default parameters of executor.
        this.mSpecifiedParameters = { ...this.mExecutor.defaultParameters };
    }

    /**
     * Run one render pass with the last compiled callable. Never compiles — an unrefreshed or
     * unresolved driver is skipped, keeping the previously rendered preview visible.
     *
     * @returns A promise resolving when the display's update pass completes.
     */
    public async execute(): Promise<void> {
        if (!this.mCachedCallable) {
            return;
        }

        await this.mDisplay.update(this.element, this.mCachedCallable);
    }

    /**
     * Regenerate the document code and recompile the iteration callable. The targeted value is
     * re-resolved on every call. When it is not emitted, or the display has no adapter for the
     * reported value type, the cached callable is cleared so `execute` no-ops.
     */
    public refresh(): void {
        const lTarget: PotatnoDocumentFunction<TProject> | PotatnoDocumentPort<TProject> = this.mTarget;

        // Resolve the previewed function from the target and regenerate its full document result.
        const lFunction: PotatnoDocumentFunction<TProject> = lTarget instanceof PotatnoDocumentPort ? lTarget.node.function : lTarget;
        const lGeneratorResult: PotatnoCodeGeneratorDocumentResult<TProject> = new PotatnoCodeGenerator<TProject>(lFunction.project).generateFunction(lFunction, true);

        // Resolve the executor port target. Output ports resolve to their generated valueId.
        // Input ports carry their definition id instead — their value has no own valueId and is
        // named at the consuming side, like the output label keying a function's returned object.
        // Function targets preview the function's complete output and need no port target.
        let lPortTarget: PotatnoPreviewFunctionExecutorPortTarget<TProject> | null = null;
        if (lTarget instanceof PotatnoDocumentPort) {
            const lValue: string | null = lTarget.direction === 'input' ? lTarget.definitionId : this.resolvePortValueId(lGeneratorResult, lTarget);
            if (lValue === null) {
                this.mCachedCallable = null;
                return;
            }

            lPortTarget = { documentPort: lTarget, value: lValue };
        }

        // Compile the raw callable. The executor is stored widened, so the result is cast through
        // the matching widened project shape.
        const lBuildResult: PotatnoPreviewFunctionExecutorBuildResult<Record<string, unknown>> = this.mExecutor.compile(
            lGeneratorResult as unknown as PotatnoCodeGeneratorDocumentResult<PotatnoProject<TProject['types']>>,
            lPortTarget as unknown as PotatnoPreviewFunctionExecutorPortTarget<PotatnoProject<TProject['types']>> | null
        );

        // The adapter record defines every type the display can render — no adapter, no preview.
        if (!this.mDisplay.allowsType(lBuildResult.type)) {
            this.mCachedCallable = null;
            return;
        }

        const lAdapter: (pValue: unknown) => unknown = this.mDisplay.adapterFor(lBuildResult.type);

        // Per-call parameters: executor defaults, overlaid by user-specified values, overlaid by
        // whatever the display supplies for the iteration.
        this.mCachedCallable = async (pParameters: Record<string, unknown>): Promise<unknown> => {
            return lAdapter(await lBuildResult.execute({ ...this.mExecutor.defaultParameters, ...this.mSpecifiedParameters, ...pParameters }));
        };
    }

    /**
     * Set user-defined execution parameters, overriding the executor's defaults on every
     * iteration. Partial: only the given keys are set, merged over previously specified values.
     * Parameters the display supplies itself still win. Applies on the next `execute`, no refresh
     * needed.
     *
     * @param pParameters - The parameter values to feed the executor.
     */
    public specifyParameters(pParameters: Record<string, unknown>): void {
        this.mSpecifiedParameters = { ...this.mSpecifiedParameters, ...pParameters };
    }

    /**
     * Find the valueId allocated to an output port across every graph of a generation result.
     *
     * @param pGeneratorResult - The generation result to search.
     * @param pPort - The port whose valueId to find.
     *
     * @returns The valueId, or `null` when the port's value was not emitted.
     */
    private resolvePortValueId(pGeneratorResult: PotatnoCodeGeneratorDocumentResult<TProject>, pPort: PotatnoDocumentPort<TProject>): string | null {
        for (const lFunctionResult of [pGeneratorResult.entryPoint, ...pGeneratorResult.dependencies]) {
            for (const lGraph of lFunctionResult.graphs) {
                const lValueId: string | undefined = lGraph.ports.get(pPort);
                if (lValueId !== undefined) {
                    return lValueId;
                }
            }
        }

        return null;
    }
}

/**
 * Compiled iteration callable handed to the display's `update` loop — parameter merge and adapter
 * coercion baked in.
 */
type PotatnoPreviewDriverCallable = (pParameters: Record<string, unknown>) => Promise<unknown>;
