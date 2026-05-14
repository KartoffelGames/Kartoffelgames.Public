import type { PotatnoPreviewResultTypeRegistry } from './potatno-preview-display-definition.ts';

/**
 * Function-side execution body for a single preview result type. The function
 * definition supplies one of these per result type it can produce. The
 * executor knows the function's signature, rewrites the named hook to escape
 * the intermediate value, and returns a result conforming to the registered
 * result type's result shape.
 *
 * Functions that cannot produce a given result type simply do not register an
 * executor for it; the editor filters its available-previews list accordingly.
 *
 * @typeParam TResultTypes - The project's full preview result type registry.
 * @typeParam TResultType - The registered result type id this executor produces.
 */
export class PotatnoPreviewExecutorDefinition<TResultTypes extends PotatnoPreviewResultTypeRegistry, TResultType extends keyof TResultTypes> {
    /**
     * Create a new PotatnoPreviewExecutorDefinition.
     *
     * @param pParameters - Configuration including result type id and execution callback.
     *
     * @returns The new executor definition.
     */
    public static new<TResultTypes extends PotatnoPreviewResultTypeRegistry, TResultType extends keyof TResultTypes>(pParameters: PotatnoPreviewExecutorDefinitionConstructorParameter<TResultTypes, TResultType>): PotatnoPreviewExecutorDefinition<TResultTypes, TResultType> {
        return new PotatnoPreviewExecutorDefinition<TResultTypes, TResultType>(pParameters);
    }

    private readonly mExecutor: PotatnoPreviewExecutorDefinitionFunction<TResultTypes, TResultType>;
    private readonly mResultType: TResultType;

    /**
     * The registered result type id this executor produces.
     */
    public get resultType(): TResultType {
        return this.mResultType;
    }

    /**
     * Constructor.
     *
     * @param pParameters - Constructor parameters.
     */
    protected constructor(pParameters: PotatnoPreviewExecutorDefinitionConstructorParameter<TResultTypes, TResultType>) {
        this.mExecutor = pParameters.execute;
        this.mResultType = pParameters.resultType;
    }

    /**
     * Execute the function with the typed parameter and the requested
     * intermediate-value extraction. A null pExtractValueId signals the
     * main-preview path: no hook rewrite, the function returns its natural value.
     *
     * @param pParameter - Execution parameter required by the result type.
     * @param pExtractValueId - The valueId whose hook to rewrite, or null for main preview.
     *
     * @returns The strongly typed result for the result type.
     */
    public execute(pParameter: TResultTypes[TResultType]['parameter'], pExtractValueId: string | null): Promise<TResultTypes[TResultType]['result']> {
        return this.mExecutor(pParameter, pExtractValueId);
    }
}

/**
 * Underlying executor callable. Performs the hook rewrite for the named
 * valueId (or skips rewrite when null) and runs the function to produce the
 * result type's result.
 */
export type PotatnoPreviewExecutorDefinitionFunction<TResultTypes extends PotatnoPreviewResultTypeRegistry, TResultType extends keyof TResultTypes> = (pParameter: TResultTypes[TResultType]['parameter'], pExtractValueId: string | null) => Promise<TResultTypes[TResultType]['result']>;

/**
 * Constructor parameters for PotatnoPreviewExecutorDefinition.
 */
export type PotatnoPreviewExecutorDefinitionConstructorParameter<TResultTypes extends PotatnoPreviewResultTypeRegistry, TResultType extends keyof TResultTypes> = {
    execute: PotatnoPreviewExecutorDefinitionFunction<TResultTypes, TResultType>;
    resultType: TResultType;
};
