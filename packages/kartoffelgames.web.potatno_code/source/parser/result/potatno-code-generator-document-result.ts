import type { PotatnoDocument } from '../../document/potatno-document.ts';
import type { PotatnoProjectTypesDefinition } from '../../project/potatno-project-types-definition.ts';
import type { PotatnoCodeGeneratorFunctionResult } from './potatno-code-generator-function-result.ts';

/**
 * Document code generation result for a entry point.
 */
export class PotatnoCodeGeneratorDocumentResult<TProjectTypes extends PotatnoProjectTypesDefinition> {
    private readonly mDocument: PotatnoDocument<TProjectTypes>;
    private readonly mDependencies: Array<PotatnoCodeGeneratorFunctionResult<TProjectTypes>>;
    private readonly mEntryPoint: PotatnoCodeGeneratorFunctionResult<TProjectTypes>;

    /**
     * Calls the underlying project definitions code generator to convert the function graphs into a single string.
     */
    public get code(): string {
        return this.mDocument.project.generator.code(this);
    }

    /**
     * Get the entry points dependency functions.
     */
    public get dependencies(): ReadonlyArray<PotatnoCodeGeneratorFunctionResult<TProjectTypes>> {
        return this.mDependencies;
    }

    /**
     * Get the documents results main entry point.
     * That entry point can differ for different generations and is not allways the documents main entry point function.
     */
    public get entryPoint(): PotatnoCodeGeneratorFunctionResult<TProjectTypes> {
        return this.mEntryPoint;
    }

    /**
     * Constructor.
     * 
     * @param pDocument - Document of the generation.
     * @param pEntryPointResult - The main entry point for the document generation. 
     * @param pDependencies - Code generation of the dependency functions ordered by appearence. 
     */
    public constructor(pDocument: PotatnoDocument<TProjectTypes>, pEntryPointResult: PotatnoCodeGeneratorFunctionResult<TProjectTypes>, pDependencies: Array<PotatnoCodeGeneratorFunctionResult<TProjectTypes>>) {
        this.mDocument = pDocument;
        this.mEntryPoint = pEntryPointResult;
        this.mDependencies = pDependencies;
    }
}