import type { PotatnoProjectType } from '../project/potatno-project-types-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import type { PotatnoPreviewResultTypeRegistry } from './potatno-preview-display-definition.ts';

/**
 * Per-(project-type, result-type) preview definition. A thin record carrying
 * only the per-type adapter — the bulk of the rendering belongs to the
 * corresponding PotatnoPreviewResultDisplay for the result type.
 *
 * One preview definition exists per (project type, registered result type)
 * combination the project supports. Adding the same result type for a new
 * project type is a matter of writing one of these with an appropriate adapter.
 *
 * @typeParam TProject - Project type this preview definition belongs to.
 * @typeParam TResultTypes - The project's full preview result type registry.
 * @typeParam TTypeId - The id of the project type this preview applies to.
 * @typeParam TResultType - The registered result type id this preview produces.
 */
export class PotatnoPreviewDefinition<TProject extends PotatnoProject, TPreviewResultTypes extends PotatnoPreviewResultTypeRegistry, TProjectType extends PotatnoProjectType<TProject>, TPreviewResultType extends keyof TPreviewResultTypes> {
    /**
     * Create a new PotatnoPreviewDefinition.
     *
     * @param pParameters - Configuration including project type id, result type id, and adapter.
     *
     * @returns The new preview definition.
     */
    public static new<TProject extends PotatnoProject, TPreviewResultTypes extends PotatnoPreviewResultTypeRegistry, TProjectType extends PotatnoProjectType<TProject>, TPreviewResultType extends keyof TPreviewResultTypes>(pParameters: PotatnoPreviewDefinitionConstructorParameter<TProject, TPreviewResultTypes, TProjectType, TPreviewResultType>): PotatnoPreviewDefinition<TProject, TPreviewResultTypes, TProjectType, TPreviewResultType> {
        return new PotatnoPreviewDefinition<TProject, TPreviewResultTypes, TProjectType, TPreviewResultType>(pParameters);
    }

    private readonly mAdapter: TPreviewResultTypes[TPreviewResultType]['adapter'];
    private readonly mResultType: TPreviewResultType;
    private readonly mTypeId: TProjectType;

    /**
     * The per-type adapter that fulfils the result display's adapter contract.
     */
    public get adapter(): TPreviewResultTypes[TPreviewResultType]['adapter'] {
        return this.mAdapter;
    }

    /**
     * The registered result type id this preview produces.
     */
    public get resultType(): TPreviewResultType {
        return this.mResultType;
    }

    /**
     * The project type id this preview applies to.
     */
    public get typeId(): TProjectType {
        return this.mTypeId;
    }

    /**
     * Constructor.
     *
     * @param pParameters - Constructor parameters.
     */
    protected constructor(pParameters: PotatnoPreviewDefinitionConstructorParameter<TProject, TPreviewResultTypes, TProjectType, TPreviewResultType>) {
        this.mAdapter = pParameters.adapter;
        this.mResultType = pParameters.resultType;
        this.mTypeId = pParameters.typeId;
    }
}

/**
 * Constructor parameters for PotatnoPreviewDefinition.
 */
export type PotatnoPreviewDefinitionConstructorParameter<TProject extends PotatnoProject, TResultTypes extends PotatnoPreviewResultTypeRegistry, TTypeId extends PotatnoProjectType<TProject>, TResultType extends keyof TResultTypes> = {
    adapter: TResultTypes[TResultType]['adapter'];
    resultType: TResultType;
    typeId: TTypeId;
};
