import { Exception } from "@kartoffelgames/core";
import type { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import { PotatnoCodeGenerator } from '../parser/potatno-code-generator.ts';
import type { PotatnoCodeGeneratorDocumentResult } from '../parser/result/potatno-code-generator-document-result.ts';
import { PotatnoProjectTypesDefinition } from "../project/potatno-project-types-definition.ts";
import { PotatnoPreviewDisplay } from "./potatno-preview-display.ts";
import type { PotatnoPreviewFunctionExecutor, PotatnoPreviewFunctionExecutorBuildResult, PotatnoPreviewFunctionExecutorPortTarget, PotatnoPreviewResultType } from './potatno-preview-function-executor.ts';

/**
 * Self-contained runtime object of a preview element.
 * Capable to update itself without further external resources.
 *
 * @typeParam TProject - The project type the driver targets.
 */
export class PotatnoPreviewDriver<TProjectTypes extends PotatnoProjectTypesDefinition> {
    private mCachedCallable: PotatnoPreviewDriverCallable | null;
    private readonly mDisplay: PotatnoPreviewDriverDisplay<TProjectTypes>;
    private mElement: Element | null;
    private readonly mExecutor: PotatnoPreviewFunctionExecutor<TProjectTypes>;
    private mSpecifiedParameters: Record<string, unknown>;
    private readonly mTarget: PotatnoDocumentFunction<TProjectTypes> | PotatnoDocumentPort<TProjectTypes>;

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
     * Executor of this driver.
     */
    public get executor(): PotatnoPreviewFunctionExecutor<TProjectTypes> {
        return this.mExecutor;
    }

    /**
     * Constructor. Usually called through a registry entry's `createDriver`.
     *
     * @param pDisplay - Preview display.
     * @param pExecutor - Preview code executor.
     * @param pTarget - The previewed document port or document function.
     */
    public constructor(pDisplay: PotatnoPreviewDriverDisplay<TProjectTypes>, pExecutor: PotatnoPreviewFunctionExecutor<TProjectTypes>, pTarget: PotatnoDocumentFunction<TProjectTypes> | PotatnoDocumentPort<TProjectTypes>) {
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
        // Resolve the previewed function from the target and regenerate its full document result.
        const lFunction = (() => {
            if (this.mTarget instanceof PotatnoDocumentPort) {
                return this.mTarget.node.function;
            }

            return this.mTarget;
        })();

        // Generate function.
        const lGeneratorResult: PotatnoCodeGeneratorDocumentResult<TProjectTypes> | null = (() => {
            try {
                return new PotatnoCodeGenerator<TProjectTypes>(lFunction.project).generateFunction(lFunction, true);
            } catch {
                return null;
            }
        })();

        // Something happens. Do nothing.
        if (!lGeneratorResult) {
            return;
        }

        // Resolve the executor port target. 
        // - Output ports resolve to their generated valueId.
        // - Input ports should eighter be resolved to the connected input port or the static input value.
        let lPortTarget: PotatnoPreviewFunctionExecutorPortTarget<TProjectTypes> | null = (() => {
            // No port specified use the funcitons "MAIN" preview.
            if (!(this.mTarget instanceof PotatnoDocumentPort)) {
                return null;
            }

            return this.resolvePortTarget(lGeneratorResult, this.mTarget);
        })();

        // Build the result.
        const lBuildResult: PotatnoPreviewFunctionExecutorBuildResult<Record<string, unknown>, PotatnoPreviewResultType<TProjectTypes>> = this.mExecutor.compile(lGeneratorResult, lPortTarget);

        // The adapter record defines every type the display can render — no adapter, no preview.
        if (!this.mDisplay.allowsType(lBuildResult.type)) {
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
     * Resolve the executor target for a generated document port.
     *
     * @param pGeneratorResult - The generation result to search.
     * @param pPort - The target document port.
     *
     * @returns The executor port target, or `null` when the port was not emitted.
     */
    private resolvePortTarget(pGeneratorResult: PotatnoCodeGeneratorDocumentResult<TProjectTypes>, pPort: PotatnoDocumentPort<TProjectTypes>): PotatnoPreviewFunctionExecutorPortTarget<TProjectTypes> {
        const lResolvedPort: PotatnoPreviewDriverResolvedPort = (() => { 
            // TODO: Thats totally shit. Is there anything better?
            for (const lFunctionResult of [pGeneratorResult.entryPoint, ...pGeneratorResult.dependencies]) {
                for (const lGraph of lFunctionResult.graphs) {
                    const lPortValue: string | undefined = lGraph.ports.get(pPort);
                    const lNodeId: string | undefined = lGraph.nodes.get(pPort.node);
                    if (lPortValue !== undefined && lNodeId !== undefined) {
                        return { nodeId: lNodeId, value: lPortValue };
                    }
                }
            }

            throw new Exception(`Port target "${pPort.label}" could not be found.`, this);
        })();

        // Set position of nodes hook position.
        const lHookPosition: string = (() => {
            if (pPort.direction === 'input') {
                return 'start';
            }
            return 'end';
        })();

        return {
            documentPort: pPort,
            nodeHook: pPort.project.generator.values.hook(`${lHookPosition}-${lResolvedPort.nodeId}`),
            value: lResolvedPort.value
        };
    }
}

/**
 * Compiled iteration callable handed to the display's `update` loop — parameter merge and adapter
 * coercion baked in.
 */
type PotatnoPreviewDriverCallable = (pParameters: Record<string, unknown>) => Promise<unknown>;

export type PotatnoPreviewDriverDisplay<TProjectTypes extends PotatnoProjectTypesDefinition> = PotatnoPreviewDisplay<TProjectTypes, Element, any, any, any, any>;

type PotatnoPreviewDriverResolvedPort = {
    nodeId: string;
    value: string;
};

