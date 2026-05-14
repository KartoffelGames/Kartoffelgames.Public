import type { PotatnoProject } from '../project/potatno-project.ts';
import type { PotatnoPreviewDriver, PotatnoPreviewDriverParameter } from './potatno-preview-driver.ts';

/**
 * Per-result-type rendering definition. Owns the structural rendering shared
 * across every project type — generating the preview element, executing
 * through the driver, iterating the results, and painting them. The per-value
 * coercion logic is supplied by per-(project-type, result-type) preview
 * definitions as an adapter conforming to the result type's adapter contract.
 *
 * One result display exists per registered preview result type. Project
 * authors write one per result type they register; common result types ship
 * as defaults.
 *
 * @typeParam TProject - Project type this result display belongs to.
 * @typeParam TResultTypes - The project's full preview result type registry.
 * @typeParam TResultType - The specific result type id this display produces.
 */
export class PotatnoPreviewDisplayDefinition<TProject extends PotatnoProject, TResultTypes extends PotatnoPreviewResultTypeRegistry, TResultType extends keyof TResultTypes> {
    /**
     * Create a new PotatnoPreviewResultDisplay.
     *
     * @param pParameters - Configuration including result type id, default parameters, and rendering callbacks.
     *
     * @returns The new result display.
     */
    public static new<TProject extends PotatnoProject, TResultTypes extends PotatnoPreviewResultTypeRegistry, TResultType extends keyof TResultTypes>(pParameters: PotatnoPreviewDisplayDefinitionConstructorParameter<TProject, TResultTypes, TResultType>): PotatnoPreviewDisplayDefinition<TProject, TResultTypes, TResultType> {
        return new PotatnoPreviewDisplayDefinition<TProject, TResultTypes, TResultType>(pParameters);
    }

    private readonly mDefaultParameters: TResultTypes[TResultType]['parameter'];
    private readonly mGenerator: PotatnoPreviewResultDisplayGenerator;
    private readonly mResultType: TResultType;
    private readonly mUpdater: PotatnoPreviewResultDisplayUpdater<TProject, TResultTypes, TResultType>;

    /**
     * Default execution parameters used when the user has not customized them.
     */
    public get defaultParameters(): TResultTypes[TResultType]['parameter'] {
        return this.mDefaultParameters;
    }

    /**
     * The registered result type id this display produces.
     */
    public get resultType(): TResultType {
        return this.mResultType;
    }

    /**
     * Constructor.
     *
     * @param pParameters - Constructor parameters.
     */
    protected constructor(pParameters: PotatnoPreviewDisplayDefinitionConstructorParameter<TProject, TResultTypes, TResultType>) {
        this.mDefaultParameters = pParameters.defaultParameters;
        this.mGenerator = pParameters.generate;
        this.mResultType = pParameters.resultType;
        this.mUpdater = pParameters.update;
    }

    /**
     * Build the preview element. Called once when a preview is toggled on.
     *
     * @returns The preview element.
     */
    public generate(): Element {
        return this.mGenerator();
    }

    /**
     * Refresh the preview element. Receives the driver for execution access
     * and the per-type adapter conforming to the result type's adapter contract.
     *
     * @param pElement - The preview element to update.
     * @param pDriver - Runtime driver bridging to the function execution.
     * @param pAdapter - Per-type adapter that fulfils the result type's adapter contract.
     */
    public update(pElement: Element, pDriver: PotatnoPreviewDriver<TProject, TResultTypes[TResultType]['parameter'], TResultTypes[TResultType]['result']>, pAdapter: TResultTypes[TResultType]['adapter']): void | Promise<void> {
        return this.mUpdater(pElement, pDriver, pAdapter);
    }
}

/**
 * Callback that builds the preview element. Called once per preview activation.
 */
export type PotatnoPreviewResultDisplayGenerator = () => Element;

/**
 * Callback that refreshes the preview element from the driver's execution
 * result, using the per-type adapter for per-value coercion.
 */
export type PotatnoPreviewResultDisplayUpdater<TProject extends PotatnoProject, TResultTypes extends PotatnoPreviewResultTypeRegistry, TResultType extends keyof TResultTypes> = (pElement: Element, pDriver: PotatnoPreviewDriver<TProject, TResultTypes[TResultType]['parameter'], TResultTypes[TResultType]['result']>, pAdapter: TResultTypes[TResultType]['adapter']) => void | Promise<void>;

/**
 * Constructor parameters for PotatnoPreviewResultDisplay.
 */
export type PotatnoPreviewDisplayDefinitionConstructorParameter<TProject extends PotatnoProject, TResultTypes extends PotatnoPreviewResultTypeRegistry, TResultType extends keyof TResultTypes> = {
    defaultParameters: TResultTypes[TResultType]['parameter'];
    generate: PotatnoPreviewResultDisplayGenerator;
    resultType: TResultType;
    update: PotatnoPreviewResultDisplayUpdater<TProject, TResultTypes, TResultType>;
};

/**
 * Contract for one entry in the project's preview result type registry.
 * Generic over the three type-only fields that describe a result type:
 *
 * - TParameter: what the executor function RECEIVES. The driver passes one
 *               of these into the executor on every call.
 * - TResult:    what the executor function RETURNS. The display reads this
 *               to drive its rendering.
 * - TAdapter:   a record of per-value callbacks the result display invokes
 *               during rendering. Each per-(project-type, result-type) preview
 *               definition supplies one — these are how the display, which is
 *               agnostic to the project type, paints values of a specific type.
 *               E.g. a '2d' display calls `adapter.valueToRgb(value)` per
 *               pixel; for `number` the adapter returns [n,n,n], for `vec3`
 *               it returns the vector unchanged.
 *
 * Each registered result type instantiates this with its OWN concrete shapes,
 * e.g.:
 *
 *   type MyResultTypes = {
 *       flat: PotatnoPreviewResultType<
 *           {},
 *           { value: number },
 *           { valueToText: (v: number) => string }
 *       >;
 *       '2d': PotatnoPreviewResultType<
 *           { width: number; height: number },
 *           { pixels: Array<unknown> },
 *           { valueToRgb: (v: unknown) => [number, number, number] }
 *       >;
 *   };
 *
 * Indexed access through the registry preserves those narrow shapes — so
 * MyResultTypes['2d']['parameter'] resolves to { width; height }, NOT to
 * PotatnoPreviewDriverParameter.
 */
export type PotatnoPreviewResultType<TParameter extends PotatnoPreviewDriverParameter, TResult, TAdapter extends Readonly<Record<string, unknown>>> = {
    readonly parameter: TParameter;
    readonly result: TResult;
    readonly adapter: TAdapter;
};

/**
 * A project's preview result type registry. Keys are result type ids; values
 * are full result type contracts. Project-author-defined and carried as a
 * generic on PotatnoProject. Type-only — has no runtime form.
 */
export type PotatnoPreviewResultTypeRegistry = Readonly<Record<string, PotatnoPreviewResultType>>;
