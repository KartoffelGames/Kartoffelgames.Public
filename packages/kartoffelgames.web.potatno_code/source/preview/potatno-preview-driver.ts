import type { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import type { PotatnoProjectType } from '../project/potatno-project-types-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';

/**
 * Runtime bridge between a port preview and the function's execution.
 *
 * Instances are constructed by the framework at preview time from a triple of
 * (preview definition, document port, function executor). The result
 * definition's update method receives one and uses execute() to obtain the
 * strongly typed function output for its rendering pass.
 *
 * @typeParam TProject - Project type this driver belongs to.
 * @typeParam TExecutionParameter - Execution parameter shape pinned by the preview kind.
 * @typeParam TResult - Execution result shape pinned by the preview kind.
 */
export class PotatnoPreviewDriver<TProject extends PotatnoProject, TExecutionParameter extends PotatnoPreviewDriverParameter, TResult> {
    private readonly mResultDataProjectType: PotatnoProjectType<TProject>;
    private readonly mExecutor: PotatnoPreviewDriverExecutor<TExecutionParameter, TResult>;
    private readonly mPort: PotatnoDocumentPort<TProject>;
    private readonly mValueId: string | null;

    /**
     * The resolved data type of the port being previewed.
     */
    public get resultDataProjectType(): PotatnoProjectType<TProject> {
        return this.mResultDataProjectType;
    }

    /**
     * The document port being previewed.
     */
    public get port(): PotatnoDocumentPort<TProject> {
        return this.mPort;
    }

    /**
     * The valueId whose hook the executor rewrites before each call.
     * A null sentinel signals the main-preview path: no hook rewrite, the
     * function returns its natural value.
     */
    public get valueId(): string | null {
        return this.mValueId;
    }

    /**
     * Constructor.
     *
     * @param pParameters - Constructor parameters.
     */
    public constructor(pParameters: PotatnoPreviewDriverConstructorParameter<TProject, TExecutionParameter, TResult>) {
        this.mResultDataProjectType = pParameters.dataType;
        this.mExecutor = pParameters.executor;
        this.mPort = pParameters.port;
        this.mValueId = pParameters.valueId;
    }

    /**
     * Run the function with the given execution parameter. The bound valueId
     * is passed to the executor for hook rewriting.
     *
     * @param pParameter - Execution parameter required by the preview kind.
     *
     * @returns The strongly typed result for the preview kind.
     */
    public execute(pParameter: TExecutionParameter): Promise<TResult> {
        return this.mExecutor(pParameter, this.mValueId);
    }
}

/**
 * Constructor parameters for PotatnoPreviewDriver.
 */
export type PotatnoPreviewDriverConstructorParameter<TProject extends PotatnoProject, TExecutionParameter extends PotatnoPreviewDriverParameter, TResult> = {
    dataType: PotatnoProjectType<TProject>;
    executor: PotatnoPreviewDriverExecutor<TExecutionParameter, TResult>;
    port: PotatnoDocumentPort<TProject>;
    valueId: string | null;
};

export type PotatnoPreviewDriverParameter = Record<string, unknown>

/**
 * Underlying executor callable the driver wraps. Accepts the typed parameter
 * and the bound valueId, performs the hook rewrite when valueId is non-null,
 * and returns the typed result.
 */
export type PotatnoPreviewDriverExecutor<TExecutionParameter extends PotatnoPreviewDriverParameter, TResult> = (pParameter: TExecutionParameter, pExtractValueId: string | null) => Promise<TResult>;

