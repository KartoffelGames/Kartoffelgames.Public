import type { PotatnoProjectType } from '../project/potatno-project-types-definition.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import type { PotatnoPreviewDefinition } from './potatno-preview-definition.ts';
import type { PotatnoPreviewExecutorDefinition } from './potatno-preview-executor-definition.ts';
import type { PotatnoPreviewDisplayDefinition, PotatnoPreviewResultTypeRegistry } from './potatno-preview-display-definition.ts';

/**
 * Project-level preview registry. Holds every runtime preview registration
 * for one project:
 *
 *   - result-displays      keyed by result-type id
 *   - preview-definitions  keyed by (project-type id, result-type id)
 *   - executor-definitions keyed by (function id, result-type id)
 *
 * The TYPE registry (PotatnoPreviewResultTypeRegistry) is a TypeScript shape
 * that describes contracts. This class is the RUNTIME counterpart — the place
 * actual instances live and where the framework looks them up at preview time.
 *
 * Plug into the project the same way PotatnoProjectTypesDefinition does today:
 *
 *   const lTypes    = PotatnoProjectTypesDefinition.new({...});
 *   const lPreviews = PotatnoProjectPreviewsDefinition.new<TProject, MyResultTypes>();
 *   lPreviews.addResultDisplay(...);
 *   lPreviews.addPreviewDefinition(...);
 *   lPreviews.addExecutorDefinition('myFunction', ...);
 *   const lProject  = PotatnoProject.new({ types: lTypes, previews: lPreviews, entryPoint: ... });
 *
 * The Project.previews field is the missing wiring — it doesn't exist yet
 * because that's project-side work.
 *
 * @typeParam TProject - Project type this previews definition belongs to.
 * @typeParam TResultTypes - The project's preview result type registry.
 */
export class PotatnoProjectPreviewsDefinition<TProject extends PotatnoProject, TResultTypes extends PotatnoPreviewResultTypeRegistry> {
    /**
     * Create a new, empty PotatnoProjectPreviewsDefinition.
     *
     * @returns The new previews definition.
     */
    public static new<TProject extends PotatnoProject, TResultTypes extends PotatnoPreviewResultTypeRegistry>(): PotatnoProjectPreviewsDefinition<TProject, TResultTypes> {
        return new PotatnoProjectPreviewsDefinition<TProject, TResultTypes>();
    }

    private readonly mExecutorDefinitions: Map<string, PotatnoPreviewExecutorDefinition<TResultTypes, keyof TResultTypes>>;
    private readonly mPreviewDefinitions: Map<string, PotatnoPreviewDefinition<TProject, TResultTypes, PotatnoProjectType<TProject>, keyof TResultTypes>>;
    private readonly mResultDisplays: Map<keyof TResultTypes, PotatnoPreviewDisplayDefinition<TProject, TResultTypes, keyof TResultTypes>>;

    /**
     * Constructor.
     */
    protected constructor() {
        this.mExecutorDefinitions = new Map<string, PotatnoPreviewExecutorDefinition<TResultTypes, keyof TResultTypes>>();
        this.mPreviewDefinitions = new Map<string, PotatnoPreviewDefinition<TProject, TResultTypes, PotatnoProjectType<TProject>, keyof TResultTypes>>();
        this.mResultDisplays = new Map<keyof TResultTypes, PotatnoPreviewDisplayDefinition<TProject, TResultTypes, keyof TResultTypes>>();
    }

    /**
     * Register an executor for a (function, result-type) pair.
     *
     * @param pFunctionId - The function id this executor produces results for.
     * @param pExecutor - The executor definition.
     */
    public addExecutorDefinition<TResultType extends keyof TResultTypes>(pFunctionId: string, pExecutor: PotatnoPreviewExecutorDefinition<TResultTypes, TResultType>): void {
        const lKey: string = `${pFunctionId}::${String(pExecutor.resultType)}`;
        this.mExecutorDefinitions.set(lKey, pExecutor as unknown as PotatnoPreviewExecutorDefinition<TResultTypes, keyof TResultTypes>);
    }

    /**
     * Register a preview definition for a (project-type, result-type) pair.
     *
     * @param pPreview - The preview definition.
     */
    public addPreviewDefinition<TTypeId extends PotatnoProjectType<TProject>, TResultType extends keyof TResultTypes>(pPreview: PotatnoPreviewDefinition<TProject, TResultTypes, TTypeId, TResultType>): void {
        const lKey: string = `${pPreview.typeId}::${String(pPreview.resultType)}`;
        this.mPreviewDefinitions.set(lKey, pPreview as unknown as PotatnoPreviewDefinition<TProject, TResultTypes, PotatnoProjectType<TProject>, keyof TResultTypes>);
    }

    /**
     * Register a result display for a result type.
     *
     * @param pDisplay - The result display.
     */
    public addResultDisplay<TResultType extends keyof TResultTypes>(pDisplay: PotatnoPreviewDisplayDefinition<TProject, TResultTypes, TResultType>): void {
        this.mResultDisplays.set(pDisplay.resultType, pDisplay as unknown as PotatnoPreviewDisplayDefinition<TProject, TResultTypes, keyof TResultTypes>);
    }

    /**
     * Look up the executor for a (function, result-type) pair.
     *
     * @param pFunctionId - The function id.
     * @param pResultType - The result type id.
     *
     * @returns The matching executor, or undefined if none registered.
     */
    public getExecutorDefinition<TResultType extends keyof TResultTypes>(pFunctionId: string, pResultType: TResultType): PotatnoPreviewExecutorDefinition<TResultTypes, TResultType> | undefined {
        const lKey: string = `${pFunctionId}::${String(pResultType)}`;
        return this.mExecutorDefinitions.get(lKey) as PotatnoPreviewExecutorDefinition<TResultTypes, TResultType> | undefined;
    }

    /**
     * Look up the preview definition for a (project-type, result-type) pair.
     *
     * @param pTypeId - The project type id.
     * @param pResultType - The result type id.
     *
     * @returns The matching preview definition, or undefined if none registered.
     */
    public getPreviewDefinition<TTypeId extends PotatnoProjectType<TProject>, TResultType extends keyof TResultTypes>(pTypeId: TTypeId, pResultType: TResultType): PotatnoPreviewDefinition<TProject, TResultTypes, TTypeId, TResultType> | undefined {
        const lKey: string = `${pTypeId}::${String(pResultType)}`;
        return this.mPreviewDefinitions.get(lKey) as PotatnoPreviewDefinition<TProject, TResultTypes, TTypeId, TResultType> | undefined;
    }

    /**
     * Look up the result display for a result type.
     *
     * @param pResultType - The result type id.
     *
     * @returns The matching result display, or undefined if none registered.
     */
    public getResultDisplay<TResultType extends keyof TResultTypes>(pResultType: TResultType): PotatnoPreviewDisplayDefinition<TProject, TResultTypes, TResultType> | undefined {
        return this.mResultDisplays.get(pResultType) as PotatnoPreviewDisplayDefinition<TProject, TResultTypes, TResultType> | undefined;
    }
}
